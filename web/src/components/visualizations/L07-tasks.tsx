"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Three tasks created with dependency relationships", statuses: ["pending", "pending", "pending", "pending"] },
  { label: "Task A and B have no deps — both can start", statuses: ["ready", "ready", "pending", "pending"] },
  { label: "Task A completes", statuses: ["done", "ready", "pending", "pending"] },
  { label: "Task B completes — Task C deps now met", statuses: ["done", "done", "ready", "pending"] },
  { label: "Task C executes", statuses: ["done", "done", "done", "pending"] },
  { label: "Task D depends on C — now ready", statuses: ["done", "done", "done", "ready"] },
  { label: "All tasks complete", statuses: ["done", "done", "done", "done"] },
];

const TASKS = [
  { label: "Task A", x: 30, y: 20 },
  { label: "Task B", x: 30, y: 90 },
  { label: "Task C", x: 220, y: 55 },
  { label: "Task D", x: 380, y: 55 },
];

const STATUS_FILL: Record<string, string> = { pending: "#F3F4F6", ready: "#DBEAFE", done: "#DCFCE7" };
const STATUS_STROKE: Record<string, string> = { pending: "#D1D5DB", ready: "#3B82F6", done: "#22C55E" };

export default function L07Tasks() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="500" height="140" viewBox="0 0 500 140">
          <defs><marker id="a07" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" /></marker></defs>
          {/* Dependency arrows */}
          <line x1="140" y1="40" x2="218" y2="68" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a07)" />
          <line x1="140" y1="110" x2="218" y2="82" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a07)" />
          <line x1="330" y1="75" x2="378" y2="75" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a07)" />
          {/* Task boxes */}
          {TASKS.map((task, i) => (
            <g key={i}>
              <rect x={task.x} y={task.y} width="110" height="40" rx="8" fill={STATUS_FILL[step.statuses[i]]} stroke={STATUS_STROKE[step.statuses[i]]} strokeWidth="2" />
              <text x={task.x + 55} y={task.y + 25} textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">{task.label}</text>
              {step.statuses[i] === "done" && <text x={task.x + 95} y={task.y + 15} fontSize="14" fill="#22C55E">✓</text>}
            </g>
          ))}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
