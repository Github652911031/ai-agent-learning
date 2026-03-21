"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "User requests action requiring tools", highlights: [0] },
  { label: "LLM decides to call a tool", highlights: [1] },
  { label: "Tool executes and returns result", highlights: [2] },
  { label: "Result fed back into messages", highlights: [3] },
  { label: "LLM generates final response with tool knowledge", highlights: [4] },
];

export default function L01ToolUse() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  const boxes = [
    { x: 30, y: 20, w: 120, h: 40, label: "User Input", color: "#DBEAFE", stroke: "#3B82F6", text: "#1E40AF" },
    { x: 180, y: 20, w: 120, h: 40, label: "LLM Decides", color: "#DCFCE7", stroke: "#22C55E", text: "#166534" },
    { x: 330, y: 20, w: 120, h: 40, label: "Execute Tool", color: "#F3E8FF", stroke: "#8B5CF6", text: "#5B21B6" },
    { x: 330, y: 100, w: 120, h: 40, label: "Tool Result", color: "#FEF3C7", stroke: "#F59E0B", text: "#92400E" },
    { x: 30, y: 100, w: 120, h: 40, label: "Final Answer", color: "#FEE2E2", stroke: "#EF4444", text: "#991B1B" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="490" height="170" viewBox="0 0 490 170">
          <defs>
            <marker id="a01" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
          {/* Arrows */}
          <line x1="150" y1="40" x2="178" y2="40" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a01)" opacity={viz.currentStep >= 1 ? 1 : 0.2} />
          <line x1="300" y1="40" x2="328" y2="40" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a01)" opacity={viz.currentStep >= 2 ? 1 : 0.2} />
          <line x1="390" y1="62" x2="390" y2="98" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a01)" opacity={viz.currentStep >= 3 ? 1 : 0.2} />
          <line x1="328" y1="120" x2="152" y2="120" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a01)" opacity={viz.currentStep >= 4 ? 1 : 0.2} />
          {/* Boxes */}
          {boxes.map((box, i) => (
            <g key={i} opacity={step.highlights.includes(i) ? 1 : 0.3}>
              <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="8" fill={box.color} stroke={box.stroke} strokeWidth="2" />
              <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="600" fill={box.text}>{box.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
