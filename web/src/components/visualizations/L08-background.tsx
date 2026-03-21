"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Main loop receives a slow task", main: "thinking", bg: "idle", notif: false },
  { label: "Spawns background thread for slow operation", main: "thinking", bg: "starting", notif: false },
  { label: "Main loop continues working on other things", main: "working", bg: "running", notif: false },
  { label: "Background task completes — pushes to notification queue", main: "working", bg: "done", notif: true },
  { label: "Main loop polls notifications and picks up the result", main: "reading", bg: "done", notif: false },
];

export default function L08Background() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="460" height="160" viewBox="0 0 460 160">
          {/* Main thread */}
          <rect x="20" y="20" width="180" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
          <text x="110" y="42" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1E40AF">Main Loop</text>
          <text x="110" y="58" textAnchor="middle" fontSize="10" fill="#3B82F6">{step.main}</text>
          {/* BG thread */}
          <rect x="20" y="95" width="180" height="50" rx="8" fill={step.bg === "idle" ? "#F3F4F6" : step.bg === "done" ? "#DCFCE7" : "#FEF3C7"} stroke={step.bg === "idle" ? "#D1D5DB" : step.bg === "done" ? "#22C55E" : "#F59E0B"} strokeWidth="2" />
          <text x="110" y="117" textAnchor="middle" fontSize="12" fontWeight="600" fill={step.bg === "idle" ? "#6B7280" : "#92400E"}>Background Thread</text>
          <text x="110" y="133" textAnchor="middle" fontSize="10" fill="#6B7280">{step.bg}</text>
          {/* Notification queue */}
          <rect x="260" y="55" width="170" height="50" rx="8" fill={step.notif ? "#FEF3C7" : "#F3F4F6"} stroke={step.notif ? "#F59E0B" : "#D1D5DB"} strokeWidth="2" />
          <text x="345" y="77" textAnchor="middle" fontSize="12" fontWeight="600" fill="#92400E">Notification Queue</text>
          <text x="345" y="93" textAnchor="middle" fontSize="10" fill="#A16207">{step.notif ? "1 pending" : "empty"}</text>
          {/* Arrows */}
          <line x1="200" y1="120" x2="258" y2="90" stroke="#94A3B8" strokeWidth="1.5" opacity={step.notif ? 1 : 0.2} />
          <line x1="260" y1="70" x2="202" y2="45" stroke="#94A3B8" strokeWidth="1.5" opacity={step.main === "reading" ? 1 : 0.2} />
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
