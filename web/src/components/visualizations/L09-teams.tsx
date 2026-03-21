"use client";

import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const STEPS = [
  { label: "Main agent has a task too big to handle alone", active: ["main"] },
  { label: "Sends message via MessageBus to teammates", active: ["main", "bus"] },
  { label: "Message arrives in Teammate A's JSONL inbox", active: ["bus", "inboxA"] },
  { label: "Message arrives in Teammate B's JSONL inbox", active: ["bus", "inboxB"] },
  { label: "Teammates read inbox and work independently", active: ["teamA", "teamB"] },
  { label: "Teammates write results back to main's inbox", active: ["teamA", "teamB", "resultBus"] },
  { label: "Main agent reads collected results", active: ["main", "resultBus"] },
];

export default function L09Teams() {
  const viz = useSteppedVisualization(STEPS.length);
  const step = STEPS[viz.currentStep];
  const a = (id: string) => step.active.includes(id) ? 1 : 0.2;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width="460" height="200" viewBox="0 0 460 200">
          <defs><marker id="a09" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" /></marker></defs>
          <rect x="10" y="70" width="110" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" opacity={a("main")} />
          <text x="65" y="100" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1E40AF" opacity={a("main")}>Main Agent</text>
          <rect x="160" y="75" width="110" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" opacity={a("bus")} />
          <text x="215" y="100" textAnchor="middle" fontSize="11" fontWeight="500" fill="#92400E" opacity={a("bus")}>MessageBus</text>
          <line x1="120" y1="95" x2="158" y2="95" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#a09)" opacity={a("bus")} />
          {/* Team A */}
          <rect x="310" y="20" width="130" height="40" rx="6" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" opacity={a("teamA")} />
          <text x="375" y="45" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5B21B6" opacity={a("teamA")}>Teammate A</text>
          <rect x="310" y="65" width="80" height="25" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" opacity={a("inboxA")} />
          <text x="350" y="82" textAnchor="middle" fontSize="9" fill="#92400E" opacity={a("inboxA")}>inbox.jsonl</text>
          <line x1="270" y1="85" x2="308" y2="78" stroke="#94A3B8" strokeWidth="1" markerEnd="url(#a09)" opacity={a("inboxA")} />
          {/* Team B */}
          <rect x="310" y="120" width="130" height="40" rx="6" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5" opacity={a("teamB")} />
          <text x="375" y="145" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534" opacity={a("teamB")}>Teammate B</text>
          <rect x="310" y="165" width="80" height="25" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" opacity={a("inboxB")} />
          <text x="350" y="182" textAnchor="middle" fontSize="9" fill="#92400E" opacity={a("inboxB")}>inbox.jsonl</text>
          <line x1="270" y1="105" x2="308" y2="175" stroke="#94A3B8" strokeWidth="1" markerEnd="url(#a09)" opacity={a("inboxB")} />
          {/* Return arrows */}
          <line x1="310" y1="50" x2="122" y2="80" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 3" opacity={a("resultBus")} />
          <line x1="310" y1="140" x2="122" y2="110" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 3" opacity={a("resultBus")} />
        </svg>
      </div>
      <StepControls currentStep={viz.currentStep} totalSteps={STEPS.length} isPlaying={viz.isPlaying} annotation={step.label} onNext={viz.next} onPrev={viz.prev} onPlay={viz.play} onPause={viz.pause} onReset={viz.reset} />
    </div>
  );
}
