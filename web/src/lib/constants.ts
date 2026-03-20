export const LESSON_ORDER = [
  "L00", "L01", "L02", "L03", "L04", "L05", "L06",
  "L07", "L08", "L09", "L10", "L11", "L12", "L13"
] as const;

export const LEARNING_PATH = LESSON_ORDER;

export type LessonId = typeof LEARNING_PATH[number];

export const LESSON_META: Record<string, {
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  coreAddition: string;
  keyInsight: string;
  keyInsightZh: string;
  layer: "tools" | "planning" | "memory" | "concurrency" | "collaboration";
  prevLesson: string | null;
}> = {
  L00: { title: "Basic Chat Loop", titleZh: "基础聊天循环", subtitle: "The Foundation of Every Agent", subtitleZh: "每个 Agent 的基石", coreAddition: "Minimal chat completion loop", keyInsight: "The simplest agent is just a while loop calling the model", keyInsightZh: "最简单的 Agent 就是一个调用模型的 while 循环", layer: "tools", prevLesson: null },
  L01: { title: "Tool Use", titleZh: "工具使用", subtitle: "Function Calling Basics", subtitleZh: "函数调用基础", coreAddition: "Function calling + tool dispatch", keyInsight: "Function calling turns a chat model into an agent that can act", keyInsightZh: "函数调用将聊天模型变成了能采取行动的 Agent", layer: "tools", prevLesson: "L00" },
  L02: { title: "Tools", titleZh: "多工具", subtitle: "One Handler Per Tool", subtitleZh: "每个工具一个处理器", coreAddition: "Tool dispatch map", keyInsight: "The loop stays the same; new tools register into the dispatch map", keyInsightZh: "循环保持不变，新工具注册到分发映射中", layer: "tools", prevLesson: "L01" },
  L03: { title: "TodoWrite", titleZh: "待办管理", subtitle: "Plan Before You Act", subtitleZh: "先计划，再行动", coreAddition: "TodoManager + nag reminder", keyInsight: "An agent without a plan drifts; list the steps first, then execute", keyInsightZh: "没有计划的 Agent 会迷失方向；先列出步骤，再执行", layer: "planning", prevLesson: "L02" },
  L04: { title: "Subagents", titleZh: "子 Agent", subtitle: "Clean Context Per Subtask", subtitleZh: "每个子任务独立上下文", coreAddition: "Subagent spawn with isolated context", keyInsight: "Subagents use independent context, keeping the main conversation clean", keyInsightZh: "子 Agent 使用独立上下文，保持主对话的整洁", layer: "planning", prevLesson: "L03" },
  L05: { title: "Skills", titleZh: "技能系统", subtitle: "Load on Demand", subtitleZh: "按需加载", coreAddition: "SkillLoader + two-layer injection", keyInsight: "Inject knowledge via tool_result when needed, not upfront in the system prompt", keyInsightZh: "在需要时通过 tool_result 注入知识，而不是预先放在系统提示中", layer: "planning", prevLesson: "L04" },
  L06: { title: "Compact", titleZh: "上下文压缩", subtitle: "Three-Layer Compression", subtitleZh: "三层压缩策略", coreAddition: "micro-compact + auto-compact + archival", keyInsight: "Context will fill up; three-layer compression enables infinite sessions", keyInsightZh: "上下文终将填满；三层压缩策略实现无限会话", layer: "memory", prevLesson: "L05" },
  L07: { title: "Tasks", titleZh: "任务系统", subtitle: "Task Graph + Dependencies", subtitleZh: "任务图 + 依赖关系", coreAddition: "TaskManager with file-based state", keyInsight: "A file-based task graph with ordering, parallelism, and dependencies", keyInsightZh: "基于文件的任务图，支持排序、并行和依赖关系", layer: "planning", prevLesson: "L06" },
  L08: { title: "Background Tasks", titleZh: "后台任务", subtitle: "Background Threads + Notifications", subtitleZh: "后台线程 + 通知机制", coreAddition: "BackgroundManager + notification queue", keyInsight: "Run slow operations in the background; the agent keeps thinking ahead", keyInsightZh: "在后台运行耗时操作；Agent 继续向前思考", layer: "concurrency", prevLesson: "L07" },
  L09: { title: "Agent Teams", titleZh: "Agent 团队", subtitle: "Teammates + Mailboxes", subtitleZh: "队友 + 邮箱系统", coreAddition: "TeammateManager + file-based mailbox", keyInsight: "When one agent can't finish, delegate to persistent teammates via async mailboxes", keyInsightZh: "当一个 Agent 无法完成时，通过异步邮箱委托给持久化的队友", layer: "collaboration", prevLesson: "L08" },
  L10: { title: "Team Protocols", titleZh: "团队协议", subtitle: "Shared Communication Rules", subtitleZh: "共享通信规则", coreAddition: "request_id correlation for protocols", keyInsight: "One request-response pattern drives all team negotiation", keyInsightZh: "一个请求-响应模式驱动所有团队协商", layer: "collaboration", prevLesson: "L09" },
  L11: { title: "Autonomous Agents", titleZh: "自主 Agent", subtitle: "Scan Board, Claim Tasks", subtitleZh: "扫描看板，认领任务", coreAddition: "Task board polling + self-governance", keyInsight: "Teammates scan the board and claim tasks themselves; no need for assignment", keyInsightZh: "队友自行扫描看板并认领任务，无需分配", layer: "collaboration", prevLesson: "L10" },
  L12: { title: "Worktree Isolation", titleZh: "工作树隔离", subtitle: "Isolate by Directory", subtitleZh: "目录级别隔离", coreAddition: "Worktree lifecycle + event stream", keyInsight: "Each works in its own directory; tasks manage goals, worktrees manage directories", keyInsightZh: "每个 Agent 在自己的目录中工作；任务管理目标，工作树管理目录", layer: "collaboration", prevLesson: "L11" },
  L13: { title: "Full Reference Agent", titleZh: "完整参考 Agent", subtitle: "Capstone — Everything Combined", subtitleZh: "毕业项目 — 全部整合", coreAddition: "All mechanisms combined", keyInsight: "The capstone combines every mechanism from Lessons 1–12 into one agent", keyInsightZh: "毕业项目将第 1-12 课的所有机制整合到一个 Agent 中", layer: "collaboration", prevLesson: "L12" },
};

export const LAYERS = [
  { id: "tools" as const, label: "Tools & Execution", labelZh: "工具与执行", color: "#3B82F6", lessons: ["L00", "L01", "L02"] },
  { id: "planning" as const, label: "Planning & Coordination", labelZh: "规划与协调", color: "#10B981", lessons: ["L03", "L04", "L05", "L07"] },
  { id: "memory" as const, label: "Memory Management", labelZh: "内存管理", color: "#8B5CF6", lessons: ["L06"] },
  { id: "concurrency" as const, label: "Concurrency", labelZh: "并发", color: "#F59E0B", lessons: ["L08"] },
  { id: "collaboration" as const, label: "Collaboration", labelZh: "协作", color: "#EF4444", lessons: ["L09", "L10", "L11", "L12", "L13"] },
] as const;
