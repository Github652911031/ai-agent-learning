"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "User request arrives — full agent activated", active: ["input"] },
  { label: "TodoManager creates a plan", active: ["input", "todo"] },
  { label: "TaskManager breaks plan into dependency graph", active: ["todo", "tasks"] },
  { label: "SkillLoader injects needed knowledge", active: ["tasks", "skills"] },
  { label: "Some tasks dispatched to background threads", active: ["tasks", "bg"] },
  { label: "Complex subtasks delegated to teammates", active: ["tasks", "team"] },
  { label: "Context compression keeps window manageable", active: ["compact"] },
  { label: "All results collected — final response generated", active: ["output"] },
];

export default function L13FullAgent() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];
  const a = (id: string) => step.active.includes(id) ? 1 : 0.25;

  const blocks = [
    { id: "input", x: 180, y: 5, w: 120, h: 30, label: "User Input", fill: "#DBEAFE", stroke: "#3B82F6", text: "#1E40AF" },
    { id: "todo", x: 10, y: 50, w: 100, h: 35, label: "TodoMgr", fill: "#DCFCE7", stroke: "#22C55E", text: "#166534" },
    { id: "tasks", x: 130, y: 50, w: 100, h: 35, label: "TaskMgr", fill: "#FEF3C7", stroke: "#F59E0B", text: "#92400E" },
    { id: "skills", x: 250, y: 50, w: 100, h: 35, label: "SkillLoader", fill: "#F3E8FF", stroke: "#8B5CF6", text: "#5B21B6" },
    { id: "bg", x: 10, y: 110, w: 100, h: 35, label: "Background", fill: "#FEE2E2", stroke: "#EF4444", text: "#991B1B" },
    { id: "team", x: 130, y: 110, w: 100, h: 35, label: "Teammates", fill: "#E0E7FF", stroke: "#6366F1", text: "#3730A3" },
    { id: "compact", x: 250, y: 110, w: 100, h: 35, label: "Compact", fill: "#CCFBF1", stroke: "#14B8A6", text: "#115E59" },
    { id: "output", x: 130, y: 165, w: 200, h: 30, label: "Final Response", fill: "#DCFCE7", stroke: "#22C55E", text: "#166534" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="380" height="210" viewBox="0 0 380 210">
          {blocks.map((b) => (
            <g key={b.id} opacity={a(b.id)}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill={b.fill} stroke={b.stroke} strokeWidth="2" />
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="600" fill={b.text}>{b.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
