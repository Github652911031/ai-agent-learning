"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Agent A needs Agent B to approve a plan", phase: 0 },
  { label: "Agent A sends protocol request with req_id=42", phase: 1 },
  { label: "Request travels through protocol bus", phase: 2 },
  { label: "Agent B receives and processes the request", phase: 3 },
  { label: "Agent B sends response with matching req_id=42", phase: 4 },
  { label: "Agent A correlates response by req_id — protocol complete", phase: 5 },
];

export default function L10Protocols() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="440" height="160" viewBox="0 0 440 160">
          <defs><marker id="a10" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" /></marker></defs>
          <rect x="20" y="30" width="110" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" opacity={step.phase >= 0 ? 1 : 0.3} />
          <text x="75" y="60" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1E40AF">Agent A</text>
          <rect x="310" y="30" width="110" height="50" rx="8" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" opacity={step.phase >= 3 ? 1 : 0.3} />
          <text x="365" y="60" textAnchor="middle" fontSize="12" fontWeight="600" fill="#5B21B6">Agent B</text>
          {/* Forward request */}
          <line x1="130" y1="45" x2="308" y2="45" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#a10)" opacity={step.phase >= 1 ? 1 : 0.15} />
          {step.phase >= 1 && <text x="220" y="38" textAnchor="middle" fontSize="10" fontWeight="600" fill="#3B82F6">req_id=42</text>}
          {/* Protocol bus */}
          <rect x="165" y="55" width="110" height="30" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" opacity={step.phase >= 2 ? 1 : 0.2} />
          <text x="220" y="75" textAnchor="middle" fontSize="10" fill="#92400E" opacity={step.phase >= 2 ? 1 : 0.2}>Protocol Bus</text>
          {/* Return response */}
          <line x1="308" y1="70" x2="132" y2="70" stroke="#8B5CF6" strokeWidth="2" markerEnd="url(#a10)" strokeDasharray="6 3" opacity={step.phase >= 4 ? 1 : 0.15} />
          {step.phase >= 4 && <text x="220" y="100" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8B5CF6">resp req_id=42</text>}
          {step.phase >= 5 && (
            <g>
              <rect x="130" y="115" width="180" height="30" rx="6" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5" />
              <text x="220" y="135" textAnchor="middle" fontSize="11" fontWeight="500" fill="#166534">✓ Protocol Complete</text>
            </g>
          )}
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
