"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const TODOS = [
  { text: "Read requirements", status: "pending" },
  { text: "Create file structure", status: "pending" },
  { text: "Write implementation", status: "pending" },
  { text: "Run tests", status: "pending" },
];

const STEPS = [
  { label: "Agent creates a plan with todo items", statuses: ["pending", "pending", "pending", "pending"] },
  { label: "First task begins execution", statuses: ["in_progress", "pending", "pending", "pending"] },
  { label: "First task completed ✓", statuses: ["completed", "pending", "pending", "pending"] },
  { label: "Second task in progress", statuses: ["completed", "in_progress", "pending", "pending"] },
  { label: "Two done, third starting", statuses: ["completed", "completed", "in_progress", "pending"] },
  { label: "Nag reminder: 2 tasks remaining!", statuses: ["completed", "completed", "in_progress", "pending"] },
  { label: "All tasks completed", statuses: ["completed", "completed", "completed", "completed"] },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "fill-zinc-100", text: "fill-zinc-500", icon: "○" },
  in_progress: { bg: "fill-blue-100", text: "fill-blue-700", icon: "◉" },
  completed: { bg: "fill-green-100", text: "fill-green-700", icon: "✓" },
};

export default function L03Todo() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="360" height="220" viewBox="0 0 360 220">
          <text x="180" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#374151">TodoManager</text>
          {TODOS.map((todo, i) => {
            const y = 40 + i * 45;
            const status = step.statuses[i];
            const colors = STATUS_COLORS[status];
            return (
              <g key={i}>
                <rect x="20" y={y} width="320" height="36" rx="6" className={colors.bg} stroke="#D1D5DB" strokeWidth="1" />
                <text x="46" y={y + 23} fontSize="16" className={colors.text}>{colors.icon}</text>
                <text x="70" y={y + 23} fontSize="12" fill="#374151">{todo.text}</text>
                <text x="310" y={y + 23} textAnchor="end" fontSize="10" className={colors.text}>{status}</text>
              </g>
            );
          })}
          {viz.currentStep === 5 && (
            <g>
              <rect x="80" y="185" width="200" height="30" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="180" y="205" textAnchor="middle" fontSize="11" fontWeight="500" fill="#92400E">⚠ Nag: 2 tasks remaining</text>
            </g>
          )}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
