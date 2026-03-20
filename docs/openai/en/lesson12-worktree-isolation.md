# Lesson 12: Worktree + Task Isolation

```
L00 > L01 > L02 > L03 > L04 > L05 > L06 > L07 > L08 > L09 > L10 > L11 > [ L12 ] > L13
```

> "Isolate by directory, coordinate by task ID."

---

## The Problem

When multiple agents (or even a single agent) work on several tasks simultaneously, they all operate in the **same directory**. File edits collide. One agent's `git checkout` stomps another's uncommitted changes.

```
  Shared directory problem:

    Alice: edits src/App.java    --+
    Bob:   edits src/App.java    --+--> CONFLICT
    Alice: git checkout feature-a --+
    Bob:   (loses uncommitted changes)
```

## The Solution

Two-plane architecture using **git worktrees**:

- **Control plane** (`.tasks/`): Task definitions, status, dependency graph -- read by everyone.
- **Execution plane** (`.worktrees/`): Each task gets its own git worktree -- a full working copy on a separate branch.

Tasks and worktrees are **bound by task ID**. A worktree is created for a task, work happens inside the worktree directory, and when the work is done, the worktree is removed (and optionally the task is marked completed).

```
  Two-plane architecture:

    CONTROL PLANE                    EXECUTION PLANE
    .tasks/                          .worktrees/
      |                                |
      +-- task_1.json                  +-- fix-login/
      |   status: in_progress         |   (full git checkout)
      |   worktree: "fix-login"       |   branch: wt/fix-login
      |                                |
      +-- task_2.json                  +-- add-api/
      |   status: in_progress         |   (full git checkout)
      |   worktree: "add-api"         |   branch: wt/add-api
      |                                |
      +-- task_3.json                  +-- index.json
          status: pending                  (worktree registry)
          worktree: ""

  Each worktree is completely isolated -- separate files, separate branch.
```

## How It Works

### EventBus: Append-Only Lifecycle Events

All task and worktree lifecycle changes are logged to `events.jsonl`:

```java
static class EventBus {
    private final Path path;

    public void emit(String event, Map<String, Object> task,
                     Map<String, Object> worktree, String error) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("event", event);
        payload.put("ts", System.currentTimeMillis() / 1000.0);
        payload.put("task", task != null ? task : Map.of());
        payload.put("worktree", worktree != null ? worktree : Map.of());
        if (error != null) payload.put("error", error);

        Files.write(path,
            (mapToJson(payload) + "\n").getBytes(StandardCharsets.UTF_8),
            StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    public String listRecent(int limit) {
        List<String> lines = Files.readAllLines(path);
        return lines.subList(Math.max(0, lines.size() - limit),
            lines.size()).stream()
            .map(Lesson9RunSimple::parseJsonToMap)
            .collect(/* to JSON list */);
    }
}
```

Events include: `worktree.create.before`, `worktree.create.after`, `worktree.create.failed`, `worktree.remove.before`, `worktree.remove.after`, `worktree.keep`, `task.completed`.

### TaskManager with Worktree Binding

Extended from Lesson 7 with worktree-aware fields:

```java
public String create(String subject, String description) {
    Map<String, Object> task = new LinkedHashMap<>();
    task.put("id", nextId);
    task.put("subject", subject);
    task.put("description", description != null ? description : "");
    task.put("status", "pending");
    task.put("owner", "");
    task.put("worktree", "");         // <-- new: bound worktree name
    task.put("blockedBy", new ArrayList<>());
    task.put("created_at", System.currentTimeMillis() / 1000.0);
    task.put("updated_at", System.currentTimeMillis() / 1000.0);
    save(task);
    nextId++;
    return mapToJson(task);
}

public String bindWorktree(int taskId, String worktree, String owner) {
    Map<String, Object> task = load(taskId);
    task.put("worktree", worktree);
    if (owner != null && !owner.isEmpty()) task.put("owner", owner);
    if ("pending".equals(task.get("status")))
        task.put("status", "in_progress");
    task.put("updated_at", System.currentTimeMillis() / 1000.0);
    save(task);
    return mapToJson(task);
}

public String unbindWorktree(int taskId) {
    Map<String, Object> task = load(taskId);
    task.put("worktree", "");
    task.put("updated_at", System.currentTimeMillis() / 1000.0);
    save(task);
    return mapToJson(task);
}
```

### WorktreeManager: Git Worktree Operations

Creates real git worktrees via the `git worktree` command:

```java
static class WorktreeManager {
    private final Path repoRoot, dir, indexPath;
    private final TaskManager tasks;
    private final EventBus events;

    public String create(String name, Integer taskId, String baseRef) {
        if (!Pattern.matches("[A-Za-z0-9._-]{1,40}", name))
            return "Error: Invalid worktree name";
        if (find(name) != null)
            return "Error: Worktree '" + name + "' already exists";

        Path path = dir.resolve(name);
        String branch = "wt/" + name;

        events.emit("worktree.create.before", /* ... */);

        // Create the git worktree
        String result = runGit(List.of(
            "git", "worktree", "add",
            "-b", branch, path.toString(),
            baseRef != null ? baseRef : "HEAD"));

        if (result.startsWith("Error:")) {
            events.emit("worktree.create.failed", /* ... */);
            return result;
        }

        // Register in index.json
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("name", name);
        entry.put("path", path.toString());
        entry.put("branch", branch);
        entry.put("task_id", taskId);
        entry.put("status", "active");
        entry.put("created_at", System.currentTimeMillis() / 1000.0);

        // Add to index, bind to task
        addToIndex(entry);
        if (taskId != null) tasks.bindWorktree(taskId, name, null);

        events.emit("worktree.create.after", /* ... */);
        return mapToJson(entry);
    }
}
```

### Running Commands Inside a Worktree

The `worktree_run` tool executes commands with the worktree directory as CWD:

```java
public String run(String name, String command) {
    Map<String, Object> wt = find(name);
    if (wt == null) return "Error: Unknown worktree '" + name + "'";
    Path p = Paths.get((String) wt.get("path"));

    ProcessBuilder pb = new ProcessBuilder(
        "powershell.exe", "-NoProfile", "-Command", command);
    pb.directory(p.toFile());  // <-- runs IN the worktree
    pb.redirectErrorStream(true);
    Process proc = pb.start();
    // ... read output
}
```

### State Machines

**Task states:**

```
    PENDING ----> IN_PROGRESS ----> COMPLETED
       \               |
        \              v
         +------> (bind worktree
                   auto-transitions
                   to IN_PROGRESS)
```

**Worktree states:**

```
    ACTIVE ----> REMOVED       (worktree_remove)
      |
      +--------> KEPT          (worktree_keep -- mark for preservation)
```

### Worktree Removal with Task Completion

When removing a worktree, you can optionally complete the bound task:

```java
public String remove(String name, boolean force, boolean completeTask) {
    Map<String, Object> wt = find(name);
    events.emit("worktree.remove.before", /* ... */);

    String result = runGit(List.of(
        "git", "worktree", "remove",
        force ? "--force" : "", wt.get("path")));

    if (completeTask && wt.get("task_id") != null) {
        int taskId = ((Number) wt.get("task_id")).intValue();
        tasks.update(taskId, "completed", null);
        tasks.unbindWorktree(taskId);
        events.emit("task.completed", /* ... */);
    }

    // Update index status to "removed"
    updateIndexStatus(name, "removed");
    events.emit("worktree.remove.after", /* ... */);
    return "Removed worktree '" + name + "'";
}
```

### Full Tool Set

```
  Task tools:          Worktree tools:
  - task_create        - worktree_create
  - task_list          - worktree_list
  - task_get           - worktree_status
  - task_update        - worktree_run
  - task_bind_worktree - worktree_remove
                       - worktree_keep
                       - worktree_events
```

---

## What Changed (from Lesson 11)

| Aspect | Lesson 11 (Autonomous Agents) | Lesson 12 (Worktree Isolation) |
|--------|------------------------------|-------------------------------|
| Isolation | All agents share one directory | Each task gets its own worktree |
| Git branches | Not managed | Auto-created `wt/<name>` branches |
| Task-worktree binding | None | `task.worktree` field links them |
| Event logging | None | `events.jsonl` append-only log |
| Command execution | Always in workDir | `worktree_run` runs in worktree CWD |
| Architecture | Single plane | Control plane + execution plane |
| New inner classes | -- | `WorktreeManager`, `EventBus` |
| New tools | -- | `worktree_*` (7 tools), `task_bind_worktree` |

---

## Try It

1. Run `Lesson12RunSimple` in a git repo with: `"Create two tasks: fix-login and add-api. Create a worktree for each task and make changes in each worktree independently."`
2. Check `.worktrees/index.json` to see registered worktrees.
3. Run `worktree_status` on each -- they have different branches and different file states.
4. Use `worktree_run` to execute commands inside a specific worktree.
5. Remove a worktree with `complete_task=true` and verify the task status changes to `completed`.
6. Check `events.jsonl` for the full lifecycle audit trail.

---

**Source**: [`Lesson12RunSimple.java`](../../openai/src/main/java/ai/agent/learning/lesson/Lesson12RunSimple.java)
