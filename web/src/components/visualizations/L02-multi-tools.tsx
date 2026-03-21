"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";
import { cn } from "@/lib/utils";

const TOOLS = ["bash", "read_file", "write_file", "glob"];
const STEPS = [
  { label: "LLM decides which tool to call", activeIdx: -1 },
  { label: "Dispatch map routes to bash handler", activeIdx: 0 },
  { label: "Dispatch map routes to read_file handler", activeIdx: 1 },
  { label: "Dispatch map routes to write_file handler", activeIdx: 2 },
  { label: "Dispatch map routes to glob handler", activeIdx: 3 },
  { label: "All tools registered — loop handles any of them", activeIdx: -2 },
];

const TOOL_COLORS = ["#3B82F6", "#22C55E", "#8B5CF6", "#F59E0B"];

export default function L02MultiTools() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="440" height="200" viewBox="0 0 440 200">
          <defs>
            <marker id="a02" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
          {/* Dispatch box */}
          <rect x="140" y="60" width="130" height="70" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" opacity={viz.currentStep >= 0 ? 1 : 0.3} />
          <text x="205" y="90" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">Dispatch</text>
          <text x="205" y="108" textAnchor="middle" fontSize="10" fill="#A16207">Map&lt;name, fn&gt;</text>
          {/* LLM arrow */}
          <rect x="10" y="75" width="100" height="40" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" opacity={viz.currentStep >= 0 ? 1 : 0.3} />
          <text x="60" y="100" textAnchor="middle" fontSize="12" fontWeight="600" fill="#166534">LLM</text>
          <line x1="110" y1="95" x2="138" y2="95" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a02)" />
          {/* Tool boxes */}
          {TOOLS.map((tool, i) => {
            const y = 20 + i * 45;
            const active = step.activeIdx === i || step.activeIdx === -2;
            return (
              <g key={tool} opacity={active ? 1 : 0.25}>
                <line x1="270" y1="95" x2="310" y2={y + 18} stroke={TOOL_COLORS[i]} strokeWidth={active ? 2 : 1} markerEnd="url(#a02)" />
                <rect x="312" y={y} width="110" height="35" rx="6" fill="white" stroke={TOOL_COLORS[i]} strokeWidth="2" />
                <text x="367" y={y + 22} textAnchor="middle" fontSize="11" fontWeight="500" fill={TOOL_COLORS[i]}>{tool}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
