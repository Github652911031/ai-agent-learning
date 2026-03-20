# Lesson 8: Background Tasks

```
L00 > L01 > L02 > L03 > L04 > L05 > L06 > L07 > [ L08 ] > L09 > L10 > L11 > L12 > L13
```

> "Fire and forget -- the agent doesn't block while the command runs."

---

## The Problem

Some commands take a long time: `mvn clean install`, `docker build`, running a test suite. With the synchronous `bash` tool from earlier lessons, the agent blocks on each call. It cannot do anything else while waiting for a 5-minute build to finish.

```
  Agent calls bash("mvn clean install")
      |
      +--- waits 5 minutes doing nothing ---+
      |                                      |
      v                                      v
  Agent receives output            (wasted 5 minutes)
```

## The Solution

Run long commands in **daemon threads**. A `BackgroundManager` launches each command in its own thread, returns a `task_id` immediately, and queues a notification when the command finishes. Before each LLM call, the agent loop **drains** the notification queue and injects results as context.

```
  Agent calls background_run("mvn clean install")
      |
      +--- returns immediately: "task_id: a1b2c3d4" ---+
      |                                                  |
      v                                                  |
  Agent continues with other work                        |
      |                                                  |
      |   [daemon thread runs mvn in background]         |
      |                                                  |
      v                                                  v
  Before next LLM call:                        Thread finishes,
  drain() -> notifications injected            pushes to queue
```

## How It Works

### BackgroundManager: Threaded Execution + Notification Queue

```java
static class BackgroundManager {
    private final Map<String, TaskInfo> tasks = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> notificationQueue =
        new CopyOnWriteArrayList<>();
    private final ReentrantLock lock = new ReentrantLock();

    public String run(String command) {
        String taskId = UUID.randomUUID().toString().substring(0, 8);
        tasks.put(taskId, new TaskInfo("running", command, null));

        Thread thread = new Thread(
            () -> execute(taskId, command), "bg-" + taskId);
        thread.setDaemon(true);
        thread.start();

        return "Background task " + taskId + " started: "
            + truncate(command, 80);
    }
}
```

Three key design decisions:

1. **Daemon threads** (`thread.setDaemon(true)`) -- they die when the JVM exits, so no cleanup needed.
2. **ConcurrentHashMap** for task state -- thread-safe reads without locking.
3. **ReentrantLock** for the notification queue -- only locked during push and drain.

### Thread-Safe Notification Queue

When a background command finishes, the thread pushes a notification:

```java
private void execute(String taskId, String command) {
    try {
        ProcessBuilder pb = new ProcessBuilder(
            "powershell.exe", "-NoProfile", "-Command", command);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        boolean finished = process.waitFor(300, TimeUnit.SECONDS);
        String output;
        String status;

        if (!finished) {
            process.destroyForcibly();
            output = "Error: Timeout (300s)";
            status = "timeout";
        } else {
            output = readProcessOutput(process);
            status = "completed";
        }

        tasks.get(taskId).status = status;
        tasks.get(taskId).result = output;

        lock.lock();
        try {
            notificationQueue.add(Map.of(
                "task_id", taskId,
                "status", status,
                "command", truncate(command, 80),
                "result", truncate(output, 500)
            ));
        } finally {
            lock.unlock();
        }
    } catch (Exception e) {
        // ... error handling with same pattern
    }
}
```

### Draining Notifications Before Each LLM Call

The critical integration point: drain and inject **before** the LLM sees the messages.

```java
private void agentLoop(OpenAIClient client,
        List<ChatCompletionMessageParam> messages, ...) {
    while (true) {
        // Drain background notifications BEFORE the LLM call
        List<Map<String, Object>> notifs =
            backgroundManager.drainNotifications();

        if (notifs != null && !notifs.isEmpty()) {
            StringBuilder notifText =
                new StringBuilder("<background-results>\n");
            for (Map<String, Object> n : notifs) {
                notifText.append("[bg:").append(n.get("task_id"))
                    .append("] ").append(n.get("status"))
                    .append(": ").append(n.get("result"))
                    .append("\n");
            }
            notifText.append("</background-results>");

            messages.add(ofUser(notifText.toString()));
            messages.add(ofAssistant("Noted background results."));
        }

        // Now make the LLM call with injected results
        ChatCompletion completion = client.chat().completions()
            .create(params);
        // ... rest of agent loop
    }
}
```

The drain method is atomic -- it clears the queue and returns all pending notifications:

```java
public List<Map<String, Object>> drainNotifications() {
    lock.lock();
    try {
        if (notificationQueue.isEmpty()) return null;
        List<Map<String, Object>> notifs =
            new ArrayList<>(notificationQueue);
        notificationQueue.clear();
        return notifs;
    } finally {
        lock.unlock();
    }
}
```

### TaskInfo: Volatile Fields for Cross-Thread Visibility

```java
static class TaskInfo {
    volatile String status;
    final String command;
    volatile String result;

    TaskInfo(String status, String command, String result) {
        this.status = status;
        this.command = command;
        this.result = result;
    }
}
```

The `volatile` keyword ensures the main thread sees the latest status written by the background thread without explicit synchronization.

### Tool Definitions

Two new tools:

```java
tools.add(buildTool("background_run",
    "Run command in background thread. Returns task_id immediately.",
    Map.of("command", Map.of("type", "string")),
    List.of("command")));

tools.add(buildTool("check_background",
    "Check background task status. Omit task_id to list all.",
    Map.of("task_id", Map.of("type", "string")),
    List.of()));
```

---

## What Changed (from Lesson 7)

| Aspect | Lesson 7 (Task System) | Lesson 8 (Background Tasks) |
|--------|----------------------|---------------------------|
| Execution model | Synchronous | Async with daemon threads |
| Blocking | `bash` blocks agent loop | `background_run` returns immediately |
| Result delivery | Tool return value | Notification queue drained before LLM call |
| Thread safety | Single-threaded | `ConcurrentHashMap` + `ReentrantLock` + `volatile` |
| New tools | `task_*` | `background_run`, `check_background` |
| New inner class | `TaskManager` | `BackgroundManager`, `TaskInfo` |

---

## Try It

1. Run `Lesson8RunSimple` with: `"Run 'ping localhost -n 10' in background, then immediately list files in the current directory."`
2. Observe the agent gets the `task_id` back instantly and proceeds to list files.
3. On the next loop iteration, the drain injects the ping results as `<background-results>`.
4. Try `check_background` to poll a running task manually.

---

**Source**: [`Lesson8RunSimple.java`](../../openai/src/main/java/ai/agent/learning/lesson/Lesson8RunSimple.java)
