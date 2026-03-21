"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Task board has unclaimed tasks", board: ["open", "open", "open"], agents: [null, null] },
  { label: "Agent X scans board during idle cycle", board: ["open", "open", "open"], agents: ["scanning", null] },
  { label: "Agent X claims Task 1", board: ["X", "open", "open"], agents: ["working", null] },
  { label: "Agent Y scans and claims Task 2", board: ["X", "Y", "open"], agents: ["working", "working"] },
  { label: "Agent X finishes, re-injects identity, scans again", board: ["done", "Y", "open"], agents: ["scanning", "working"] },
  { label: "Agent X claims Task 3", board: ["done", "Y", "X"], agents: ["working", "working"] },
  { label: "All tasks completed autonomously", board: ["done", "done", "done"], agents: ["idle", "idle"] },
];

const BOARD_COLORS: Record<string, { fill: string; stroke: string }> = {
  open: { fill: "#F3F4F6", stroke: "#D1D5DB" },
  X: { fill: "#DBEAFE", stroke: "#3B82F6" },
  Y: { fill: "#F3E8FF", stroke: "#8B5CF6" },
  done: { fill: "#DCFCE7", stroke: "#22C55E" },
};

export default function L11Autonomous() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="440" height="180" viewBox="0 0 440 180">
          <text x="170" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">Task Board</text>
          {step.board.map((status, i) => {
            const colors = BOARD_COLORS[status];
            return (
              <g key={i}>
                <rect x={30 + i * 110} y="30" width="100" height="40" rx="6" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                <text x={80 + i * 110} y="55" textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
                  Task {i + 1}: {status === "open" ? "open" : status === "done" ? "✓ done" : `→ ${status}`}
                </text>
              </g>
            );
          })}
          {/* Agents */}
          {["Agent X", "Agent Y"].map((name, i) => {
            const x = 60 + i * 200;
            const state = step.agents[i];
            return (
              <g key={name} opacity={state ? 1 : 0.3}>
                <rect x={x} y="100" width="120" height="50" rx="8" fill={i === 0 ? "#DBEAFE" : "#F3E8FF"} stroke={i === 0 ? "#3B82F6" : "#8B5CF6"} strokeWidth="2" />
                <text x={x + 60} y="122" textAnchor="middle" fontSize="12" fontWeight="600" fill={i === 0 ? "#1E40AF" : "#5B21B6"}>{name}</text>
                <text x={x + 60} y="140" textAnchor="middle" fontSize="10" fill="#6B7280">{state ?? "—"}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
