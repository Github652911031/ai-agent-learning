"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "User sends message", active: ["user"] },
  { label: "Message added to array", active: ["user", "messages"] },
  { label: "Send messages to LLM", active: ["messages", "llm"] },
  { label: "LLM generates response", active: ["llm", "response"] },
  { label: "Response added to array", active: ["response", "messages"] },
  { label: "Display to user — loop complete", active: ["messages", "output"] },
];

export default function L00BasicLoop() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="460" height="200" viewBox="0 0 460 200">
          {/* User */}
          <g opacity={step.active.includes("user") ? 1 : 0.3}>
            <rect x="10" y="70" width="90" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
            <text x="55" y="100" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1E40AF">User</text>
          </g>
          {/* Messages Array */}
          <g opacity={step.active.includes("messages") ? 1 : 0.3}>
            <rect x="140" y="60" width="110" height="70" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <text x="195" y="88" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400E">messages[]</text>
            <text x="195" y="112" textAnchor="middle" fontSize="10" fill="#A16207">conversation</text>
          </g>
          {/* LLM */}
          <g opacity={step.active.includes("llm") ? 1 : 0.3}>
            <rect x="290" y="70" width="90" height="50" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" />
            <text x="335" y="100" textAnchor="middle" fontSize="13" fontWeight="600" fill="#166534">LLM</text>
          </g>
          {/* Arrows */}
          <line x1="100" y1="85" x2="138" y2="85" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrowViz)" opacity={step.active.includes("messages") ? 1 : 0.2} />
          <line x1="250" y1="85" x2="288" y2="85" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrowViz)" opacity={step.active.includes("llm") ? 1 : 0.2} />
          <path d="M 335 120 L 335 170 L 195 170 L 195 132" stroke="#94A3B8" strokeWidth="1.5" fill="none" markerEnd="url(#arrowViz)" opacity={step.active.includes("response") ? 1 : 0.2} />
          {/* Output */}
          <g opacity={step.active.includes("output") ? 1 : 0.3}>
            <rect x="130" y="155" width="130" height="35" rx="6" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="195" y="177" textAnchor="middle" fontSize="11" fill="#5B21B6">Display Response</text>
          </g>
          <defs>
            <marker id="arrowViz" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
