import type { FlowNode, FlowEdge } from "@/components/architecture/execution-flow";

export interface FlowDef {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const flows: Record<string, FlowDef> = {
  L00: {
    nodes: [
      { id: "start", label: "User Input", x: 10, y: 10, type: "start" },
      { id: "send", label: "Send to LLM", x: 10, y: 70, type: "process" },
      { id: "resp", label: "Get Response", x: 10, y: 130, type: "process" },
      { id: "print", label: "Print Output", x: 10, y: 190, type: "end" },
    ],
    edges: [
      { from: "start", to: "send" },
      { from: "send", to: "resp" },
      { from: "resp", to: "print" },
    ],
  },
  L01: {
    nodes: [
      { id: "start", label: "User Input", x: 10, y: 10, type: "start" },
      { id: "send", label: "Send to LLM", x: 10, y: 70, type: "process" },
      { id: "check", label: "Tool Call?", x: 10, y: 130, type: "decision" },
      { id: "exec", label: "Execute Tool", x: 180, y: 130, type: "tool" },
      { id: "feed", label: "Feed Result", x: 180, y: 70, type: "process" },
      { id: "done", label: "Print Output", x: 10, y: 200, type: "end" },
    ],
    edges: [
      { from: "start", to: "send" },
      { from: "send", to: "check" },
      { from: "check", to: "exec", label: "Yes" },
      { from: "exec", to: "feed" },
      { from: "feed", to: "send" },
      { from: "check", to: "done", label: "No" },
    ],
  },
  L02: {
    nodes: [
      { id: "start", label: "User Input", x: 10, y: 10, type: "start" },
      { id: "send", label: "Send to LLM", x: 10, y: 70, type: "process" },
      { id: "check", label: "Tool Call?", x: 10, y: 130, type: "decision" },
      { id: "dispatch", label: "Dispatch Map", x: 180, y: 130, type: "process" },
      { id: "exec", label: "Execute Handler", x: 180, y: 70, type: "tool" },
      { id: "feed", label: "Feed Result", x: 350, y: 70, type: "process" },
      { id: "done", label: "Print Output", x: 10, y: 200, type: "end" },
    ],
    edges: [
      { from: "start", to: "send" },
      { from: "send", to: "check" },
      { from: "check", to: "dispatch", label: "Yes" },
      { from: "dispatch", to: "exec" },
      { from: "exec", to: "feed" },
      { from: "feed", to: "send" },
      { from: "check", to: "done", label: "No" },
    ],
  },
  L03: {
    nodes: [
      { id: "start", label: "User Input", x: 10, y: 10, type: "start" },
      { id: "send", label: "Send to LLM", x: 10, y: 70, type: "process" },
      { id: "check", label: "Tool Call?", x: 10, y: 140, type: "decision" },
      { id: "todo", label: "TodoManager", x: 200, y: 70, type: "tool" },
      { id: "tools", label: "Other Tools", x: 200, y: 140, type: "tool" },
      { id: "nag", label: "Nag Reminder", x: 200, y: 210, type: "process" },
      { id: "done", label: "Print Output", x: 10, y: 210, type: "end" },
    ],
    edges: [
      { from: "start", to: "send" },
      { from: "send", to: "check" },
      { from: "check", to: "todo", label: "todo_write" },
      { from: "check", to: "tools", label: "other" },
      { from: "todo", to: "send" },
      { from: "tools", to: "nag" },
      { from: "nag", to: "send" },
      { from: "check", to: "done", label: "No" },
    ],
  },
  L04: {
    nodes: [
      { id: "start", label: "User Input", x: 120, y: 10, type: "start" },
      { id: "main", label: "Main Agent", x: 120, y: 70, type: "process" },
      { id: "check", label: "Spawn Sub?", x: 120, y: 140, type: "decision" },
      { id: "sub", label: "Subagent", x: 300, y: 140, type: "process" },
      { id: "sub_loop", label: "Sub Loop", x: 300, y: 70, type: "tool" },
      { id: "result", label: "Return Result", x: 300, y: 210, type: "process" },
      { id: "done", label: "Final Output", x: 120, y: 210, type: "end" },
    ],
    edges: [
      { from: "start", to: "main" },
      { from: "main", to: "check" },
      { from: "check", to: "sub", label: "Yes" },
      { from: "sub", to: "sub_loop" },
      { from: "sub_loop", to: "result" },
      { from: "result", to: "main" },
      { from: "check", to: "done", label: "No" },
    ],
  },
  L05: {
    nodes: [
      { id: "start", label: "User Input", x: 10, y: 10, type: "start" },
      { id: "sys", label: "System + Skills", x: 10, y: 70, type: "process" },
      { id: "send", label: "Send to LLM", x: 10, y: 140, type: "process" },
      { id: "check", label: "Skill Load?", x: 10, y: 210, type: "decision" },
      { id: "load", label: "Load Skill Body", x: 200, y: 210, type: "tool" },
      { id: "inject", label: "Inject via Result", x: 200, y: 140, type: "process" },
      { id: "done", label: "Output", x: 10, y: 280, type: "end" },
    ],
    edges: [
      { from: "start", to: "sys" },
      { from: "sys", to: "send" },
      { from: "send", to: "check" },
      { from: "check", to: "load", label: "Yes" },
      { from: "load", to: "inject" },
      { from: "inject", to: "send" },
      { from: "check", to: "done", label: "No" },
    ],
  },
  L06: {
    nodes: [
      { id: "start", label: "Agent Loop", x: 10, y: 10, type: "start" },
      { id: "check", label: "Context Full?", x: 10, y: 80, type: "decision" },
      { id: "micro", label: "Micro Compact", x: 200, y: 10, type: "process" },
      { id: "auto", label: "Auto Compact", x: 200, y: 80, type: "process" },
      { id: "archive", label: "Archive Old", x: 200, y: 150, type: "tool" },
      { id: "resume", label: "Resume Loop", x: 10, y: 150, type: "end" },
    ],
    edges: [
      { from: "start", to: "check" },
      { from: "check", to: "micro", label: ">75%" },
      { from: "check", to: "auto", label: ">90%" },
      { from: "auto", to: "archive" },
      { from: "micro", to: "resume" },
      { from: "archive", to: "resume" },
      { from: "check", to: "resume", label: "OK" },
    ],
  },
  L07: {
    nodes: [
      { id: "start", label: "Create Tasks", x: 10, y: 10, type: "start" },
      { id: "deps", label: "Check Deps", x: 10, y: 80, type: "decision" },
      { id: "ready", label: "Ready Queue", x: 200, y: 80, type: "process" },
      { id: "exec", label: "Execute Task", x: 200, y: 10, type: "tool" },
      { id: "update", label: "Update Status", x: 200, y: 150, type: "process" },
      { id: "done", label: "All Done", x: 10, y: 150, type: "end" },
    ],
    edges: [
      { from: "start", to: "deps" },
      { from: "deps", to: "ready", label: "Met" },
      { from: "ready", to: "exec" },
      { from: "exec", to: "update" },
      { from: "update", to: "deps" },
      { from: "deps", to: "done", label: "Empty" },
    ],
  },
  L08: {
    nodes: [
      { id: "main", label: "Main Loop", x: 10, y: 10, type: "start" },
      { id: "bg_check", label: "Background?", x: 10, y: 80, type: "decision" },
      { id: "spawn", label: "Spawn Thread", x: 200, y: 80, type: "process" },
      { id: "bg_run", label: "BG Execute", x: 200, y: 10, type: "tool" },
      { id: "notify", label: "Notify Queue", x: 370, y: 10, type: "process" },
      { id: "poll", label: "Poll Notifs", x: 370, y: 80, type: "process" },
      { id: "done", label: "Continue", x: 10, y: 150, type: "end" },
    ],
    edges: [
      { from: "main", to: "bg_check" },
      { from: "bg_check", to: "spawn", label: "Yes" },
      { from: "spawn", to: "bg_run" },
      { from: "bg_run", to: "notify" },
      { from: "notify", to: "poll" },
      { from: "poll", to: "main" },
      { from: "bg_check", to: "done", label: "No" },
    ],
  },
  L09: {
    nodes: [
      { id: "main", label: "Main Agent", x: 10, y: 80, type: "start" },
      { id: "bus", label: "Message Bus", x: 200, y: 80, type: "process" },
      { id: "teammate1", label: "Teammate A", x: 370, y: 10, type: "tool" },
      { id: "teammate2", label: "Teammate B", x: 370, y: 150, type: "tool" },
      { id: "inbox", label: "JSONL Inbox", x: 200, y: 160, type: "process" },
      { id: "done", label: "Collect Results", x: 10, y: 160, type: "end" },
    ],
    edges: [
      { from: "main", to: "bus" },
      { from: "bus", to: "teammate1" },
      { from: "bus", to: "teammate2" },
      { from: "teammate1", to: "inbox" },
      { from: "teammate2", to: "inbox" },
      { from: "inbox", to: "done" },
    ],
  },
  L10: {
    nodes: [
      { id: "agent", label: "Agent A", x: 10, y: 10, type: "start" },
      { id: "req", label: "Send Request", x: 10, y: 80, type: "process" },
      { id: "bus", label: "Protocol Bus", x: 200, y: 80, type: "process" },
      { id: "agentB", label: "Agent B", x: 370, y: 80, type: "tool" },
      { id: "resp", label: "Send Response", x: 370, y: 10, type: "process" },
      { id: "correlate", label: "Match req_id", x: 200, y: 10, type: "decision" },
      { id: "done", label: "Protocol Done", x: 10, y: 150, type: "end" },
    ],
    edges: [
      { from: "agent", to: "req" },
      { from: "req", to: "bus" },
      { from: "bus", to: "agentB" },
      { from: "agentB", to: "resp" },
      { from: "resp", to: "correlate" },
      { from: "correlate", to: "done" },
    ],
  },
  L11: {
    nodes: [
      { id: "board", label: "Task Board", x: 200, y: 10, type: "start" },
      { id: "scan", label: "Scan Tasks", x: 10, y: 80, type: "process" },
      { id: "claim", label: "Claim Task", x: 10, y: 150, type: "decision" },
      { id: "exec", label: "Execute", x: 200, y: 150, type: "tool" },
      { id: "identity", label: "Re-inject ID", x: 200, y: 80, type: "process" },
      { id: "done", label: "Mark Done", x: 370, y: 150, type: "end" },
    ],
    edges: [
      { from: "board", to: "scan" },
      { from: "scan", to: "claim" },
      { from: "claim", to: "exec", label: "Claimed" },
      { from: "exec", to: "identity" },
      { from: "identity", to: "scan" },
      { from: "exec", to: "done" },
    ],
  },
  L12: {
    nodes: [
      { id: "task", label: "Receive Task", x: 200, y: 10, type: "start" },
      { id: "create", label: "Create Worktree", x: 10, y: 80, type: "process" },
      { id: "isolate", label: "Isolated Dir", x: 10, y: 150, type: "tool" },
      { id: "exec", label: "Execute in WT", x: 200, y: 150, type: "process" },
      { id: "events", label: "Event Stream", x: 370, y: 150, type: "process" },
      { id: "cleanup", label: "Cleanup WT", x: 370, y: 80, type: "process" },
      { id: "done", label: "Return Result", x: 200, y: 220, type: "end" },
    ],
    edges: [
      { from: "task", to: "create" },
      { from: "create", to: "isolate" },
      { from: "isolate", to: "exec" },
      { from: "exec", to: "events" },
      { from: "events", to: "cleanup" },
      { from: "cleanup", to: "done" },
    ],
  },
  L13: {
    nodes: [
      { id: "start", label: "User Request", x: 200, y: 10, type: "start" },
      { id: "plan", label: "Plan (Todo)", x: 200, y: 70, type: "process" },
      { id: "tasks", label: "Create Tasks", x: 200, y: 130, type: "process" },
      { id: "dispatch", label: "Dispatch", x: 10, y: 200, type: "decision" },
      { id: "local", label: "Local Tool", x: 10, y: 270, type: "tool" },
      { id: "bg", label: "Background", x: 200, y: 270, type: "tool" },
      { id: "team", label: "Delegate", x: 370, y: 270, type: "tool" },
      { id: "compact", label: "Compact", x: 370, y: 200, type: "process" },
      { id: "done", label: "Final Output", x: 200, y: 340, type: "end" },
    ],
    edges: [
      { from: "start", to: "plan" },
      { from: "plan", to: "tasks" },
      { from: "tasks", to: "dispatch" },
      { from: "dispatch", to: "local", label: "local" },
      { from: "dispatch", to: "bg", label: "bg" },
      { from: "dispatch", to: "team", label: "team" },
      { from: "local", to: "compact" },
      { from: "bg", to: "compact" },
      { from: "team", to: "compact" },
      { from: "compact", to: "done" },
    ],
  },
};

export function getExecutionFlow(lessonId: string): FlowDef | null {
  return flows[lessonId] ?? null;
}

export default flows;
