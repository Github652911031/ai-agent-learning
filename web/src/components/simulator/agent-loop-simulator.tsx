"use client";

import { useState, useEffect } from "react";
import { useSimulator } from "@/hooks/useSimulator";
import type { Scenario } from "@/hooks/useSimulator";
import { SimulatorControls } from "./simulator-controls";
import { SimulatorMessage } from "./simulator-message";
import { useTranslations } from "@/lib/i18n";

interface AgentLoopSimulatorProps {
  lessonId: string;
}

export function AgentLoopSimulator({ lessonId }: AgentLoopSimulatorProps) {
  const t = useTranslations("sim");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    import(`@/data/scenarios/${lessonId}.json`)
      .then((mod) => {
        setScenario(mod.default as Scenario);
        setLoading(false);
      })
      .catch(() => {
        setScenario(null);
        setLoading(false);
      });
  }, [lessonId]);

  const sim = useSimulator(scenario);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-white" />
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-400">{t("no_scenario")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scenario description */}
      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{scenario.title}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{scenario.description}</p>
      </div>

      {/* Controls */}
      <SimulatorControls
        isPlaying={sim.isPlaying}
        isComplete={sim.isComplete}
        currentStep={sim.currentStep}
        totalSteps={scenario.steps.length}
        speed={sim.speed}
        onPlay={sim.play}
        onPause={sim.pause}
        onStep={sim.step}
        onReset={sim.reset}
        onSpeedChange={sim.setSpeed}
      />

      {/* Messages */}
      <div className="space-y-3">
        {sim.visibleSteps.map((step, i) => (
          <SimulatorMessage key={i} step={step} index={i} />
        ))}
      </div>

      {sim.currentStep < 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-400">{t("click_play")}</p>
        </div>
      )}
    </div>
  );
}
