"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Two tasks need to run in parallel without conflicts", wt: [false, false], events: 0 },
  { label: "Worktree A created: /tmp/wt-a/", wt: [true, false], events: 0 },
  { label: "Worktree B created: /tmp/wt-b/", wt: [true, true], events: 0 },
  { label: "Both agents work in isolated directories simultaneously", wt: [true, true], events: 1 },
  { label: "Event stream reports progress from both worktrees", wt: [true, true], events: 2 },
  { label: "Work complete — worktrees cleaned up", wt: [false, false], events: 3 },
];

export default function L12Worktree() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="440" height="180" viewBox="0 0 440 180">
          <text x="220" y="18" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">Worktree Isolation</text>
          {/* Main repo */}
          <rect x="160" y="30" width="120" height="35" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="220" y="52" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400E">Main Repo</text>
          {/* Worktree A */}
          <rect x="20" y="90" width="150" height="50" rx="8" fill={step.wt[0] ? "#DBEAFE" : "#F3F4F6"} stroke={step.wt[0] ? "#3B82F6" : "#D1D5DB"} strokeWidth="2" />
          <text x="95" y="112" textAnchor="middle" fontSize="11" fontWeight="600" fill={step.wt[0] ? "#1E40AF" : "#9CA3AF"}>Worktree A</text>
          <text x="95" y="128" textAnchor="middle" fontSize="9" fill="#6B7280">/tmp/wt-a/</text>
          {/* Worktree B */}
          <rect x="270" y="90" width="150" height="50" rx="8" fill={step.wt[1] ? "#F3E8FF" : "#F3F4F6"} stroke={step.wt[1] ? "#8B5CF6" : "#D1D5DB"} strokeWidth="2" />
          <text x="345" y="112" textAnchor="middle" fontSize="11" fontWeight="600" fill={step.wt[1] ? "#5B21B6" : "#9CA3AF"}>Worktree B</text>
          <text x="345" y="128" textAnchor="middle" fontSize="9" fill="#6B7280">/tmp/wt-b/</text>
          {/* Connections */}
          <line x1="195" y1="65" x2="95" y2="88" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 3" />
          <line x1="245" y1="65" x2="345" y2="88" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 3" />
          {/* Event stream */}
          {step.events > 0 && (
            <g>
              <rect x="150" y="155" width="140" height="22" rx="4" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1" />
              <text x="220" y="170" textAnchor="middle" fontSize="9" fill="#166534">Event Stream: {step.events} events</text>
            </g>
          )}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
