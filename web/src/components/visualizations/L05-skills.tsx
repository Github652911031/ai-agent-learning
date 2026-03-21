"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "System prompt contains skill names (cheap)", parts: ["sys"] },
  { label: "LLM sees available skills in prompt", parts: ["sys", "llm"] },
  { label: "LLM calls load_skill tool for needed skill", parts: ["llm", "call"] },
  { label: "SkillLoader reads full skill body from file", parts: ["call", "loader"] },
  { label: "Full skill content injected via tool_result", parts: ["loader", "inject"] },
  { label: "LLM now has the knowledge it needs", parts: ["llm", "inject"] },
];

export default function L05Skills() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];
  const a = (id: string) => step.parts.includes(id) ? 1 : 0.2;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="460" height="170" viewBox="0 0 460 170">
          <defs><marker id="a05" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" /></marker></defs>
          <rect x="10" y="20" width="130" height="50" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" opacity={a("sys")} />
          <text x="75" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534" opacity={a("sys")}>System Prompt</text>
          <text x="75" y="58" textAnchor="middle" fontSize="9" fill="#15803D" opacity={a("sys")}>skill names only</text>
          <rect x="170" y="20" width="120" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" opacity={a("llm")} />
          <text x="230" y="50" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1E40AF" opacity={a("llm")}>LLM</text>
          <line x1="230" y1="70" x2="230" y2="98" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a05)" opacity={a("call")} />
          <rect x="170" y="100" width="120" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" opacity={a("call")} />
          <text x="230" y="125" textAnchor="middle" fontSize="10" fontWeight="500" fill="#92400E" opacity={a("call")}>load_skill("X")</text>
          <line x1="290" y1="120" x2="318" y2="120" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a05)" opacity={a("loader")} />
          <rect x="320" y="95" width="130" height="50" rx="8" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" opacity={a("loader")} />
          <text x="385" y="117" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5B21B6" opacity={a("loader")}>SkillLoader</text>
          <text x="385" y="133" textAnchor="middle" fontSize="9" fill="#7C3AED" opacity={a("loader")}>read full body</text>
          <path d="M 385 95 L 385 45 L 292 45" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#a05)" opacity={a("inject")} />
          <text x="345" y="38" fontSize="9" fill="#7C3AED" opacity={a("inject")}>tool_result</text>
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
