"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Main agent receives complex task", active: ["main"] },
  { label: "Main agent decides to spawn a subagent", active: ["main", "arrow1"] },
  { label: "Subagent created with clean context", active: ["sub"] },
  { label: "Subagent works independently using its own loop", active: ["sub", "subloop"] },
  { label: "Subagent writes result to filesystem", active: ["sub", "fs"] },
  { label: "Main agent reads result — context stays clean", active: ["main", "fs"] },
];

export default function L04Subagents() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];
  const a = (id: string) => step.active.includes(id) ? 1 : 0.2;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="440" height="180" viewBox="0 0 440 180">
          <defs><marker id="a04" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" /></marker></defs>
          <rect x="20" y="30" width="120" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" opacity={a("main")} />
          <text x="80" y="60" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1E40AF" opacity={a("main")}>Main Agent</text>
          <line x1="140" y1="55" x2="188" y2="55" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a04)" opacity={a("arrow1")} />
          <rect x="190" y="20" width="130" height="70" rx="8" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" strokeDasharray={viz.currentStep >= 2 ? "0" : "5 5"} opacity={a("sub")} />
          <text x="255" y="48" textAnchor="middle" fontSize="12" fontWeight="600" fill="#5B21B6" opacity={a("sub")}>Subagent</text>
          <text x="255" y="68" textAnchor="middle" fontSize="10" fill="#7C3AED" opacity={a("sub")}>isolated context</text>
          <g opacity={a("subloop")}>
            <path d="M 320 55 Q 360 55 360 35 Q 360 15 320 15 L 260 15" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#a04)" />
            <text x="370" y="40" fontSize="9" fill="#7C3AED">loop</text>
          </g>
          <rect x="160" y="120" width="120" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" opacity={a("fs")} />
          <text x="220" y="145" textAnchor="middle" fontSize="11" fontWeight="500" fill="#92400E" opacity={a("fs")}>Filesystem</text>
          <line x1="255" y1="90" x2="230" y2="118" stroke="#94A3B8" strokeWidth="1" markerEnd="url(#a04)" opacity={a("fs")} />
          <line x1="160" y1="130" x2="80" y2="82" stroke="#94A3B8" strokeWidth="1" markerEnd="url(#a04)" opacity={viz.currentStep === 5 ? 1 : 0.1} />
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
