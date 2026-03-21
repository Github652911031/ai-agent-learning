"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Context window filling up as agent works", fill: 30 },
  { label: "Context at 50% — still fine", fill: 50 },
  { label: "Context at 75% — micro-compact trims tool results", fill: 75 },
  { label: "Micro-compact reclaims some space", fill: 60 },
  { label: "Context hits 90% — auto-compact summarizes old turns", fill: 90 },
  { label: "Auto-compact brings context down", fill: 45 },
  { label: "If still too full — archival saves to file and drops", fill: 25 },
];

export default function L06Compact() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  const barColor = step.fill > 85 ? "#EF4444" : step.fill > 70 ? "#F59E0B" : "#22C55E";

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="400" height="200" viewBox="0 0 400 200">
          <text x="200" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">Context Window</text>
          {/* Bar */}
          <rect x="50" y="35" width="300" height="40" rx="6" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
          <rect x="50" y="35" width={300 * step.fill / 100} height="40" rx="6" fill={barColor} opacity="0.7" />
          <text x="200" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1F2937">{step.fill}%</text>
          {/* Three layers */}
          {[
            { y: 95, label: "Micro-Compact", desc: "Trim verbose tool results", color: "#DCFCE7", stroke: "#22C55E", text: "#166534", threshold: "75%" },
            { y: 130, label: "Auto-Compact", desc: "Summarize old turns", color: "#FEF3C7", stroke: "#F59E0B", text: "#92400E", threshold: "90%" },
            { y: 165, label: "Archival", desc: "Save to file & drop", color: "#FEE2E2", stroke: "#EF4444", text: "#991B1B", threshold: "95%" },
          ].map((layer, i) => (
            <g key={i} opacity={viz.currentStep >= i * 2 + 2 ? 1 : 0.3}>
              <rect x="50" y={layer.y} width="200" height="28" rx="5" fill={layer.color} stroke={layer.stroke} strokeWidth="1.5" />
              <text x="60" y={layer.y + 18} fontSize="11" fontWeight="600" fill={layer.text}>{layer.label}</text>
              <text x="275" y={layer.y + 18} fontSize="10" fill="#6B7280">{layer.desc}</text>
            </g>
          ))}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
