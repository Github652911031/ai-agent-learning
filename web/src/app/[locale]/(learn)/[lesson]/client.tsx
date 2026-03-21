"use client";

import { DocRenderer } from "@/components/docs/doc-renderer";
import { SourceViewer } from "@/components/code/source-viewer";
import { AgentLoopSimulator } from "@/components/simulator/agent-loop-simulator";
import { LessonVisualization } from "@/components/visualizations";
import { ArchDiagram } from "@/components/architecture/arch-diagram";
import { DesignDecisions } from "@/components/architecture/design-decisions";
import { ExecutionFlow } from "@/components/architecture/execution-flow";
import { WhatsNew } from "@/components/diff/whats-new";
import { Tabs } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/i18n";
import { getExecutionFlow } from "@/data/execution-flows";

interface LessonDetailClientProps {
  lessonId: string;
  source: string;
  filename: string;
}

export function LessonDetailClient({
  lessonId,
  source,
  filename,
}: LessonDetailClientProps) {
  const t = useTranslations("lesson");
  const tDeep = useTranslations("deep_dive");

  const flow = getExecutionFlow(lessonId);

  const tabs = [
    { id: "learn", label: t("tab_learn") },
    { id: "simulate", label: t("tab_simulate") },
    { id: "code", label: t("tab_code") },
    { id: "deep_dive", label: t("tab_deep_dive") },
  ];

  return (
    <div className="space-y-6">
      {/* Visualization hero */}
      <LessonVisualization lessonId={lessonId} />

      <Tabs tabs={tabs} defaultTab="learn">
        {(activeTab) => (
          <>
            {activeTab === "learn" && <DocRenderer lessonId={lessonId} />}

            {activeTab === "simulate" && (
              <AgentLoopSimulator lessonId={lessonId} />
            )}

            {activeTab === "code" && (
              source ? (
                <SourceViewer source={source} filename={filename} />
              ) : (
                <div className="py-8 text-center text-zinc-400">
                  Source code not available.
                </div>
              )
            )}

            {activeTab === "deep_dive" && (
              <div className="space-y-8">
                {/* What's New */}
                <section>
                  <h3 className="mb-3 text-lg font-semibold">{tDeep("whats_new")}</h3>
                  <WhatsNew lessonId={lessonId} />
                </section>

                {/* Architecture Diagram */}
                <section>
                  <h3 className="mb-3 text-lg font-semibold">{tDeep("architecture")}</h3>
                  <ArchDiagram lessonId={lessonId} />
                </section>

                {/* Execution Flow */}
                {flow && (
                  <section>
                    <h3 className="mb-3 text-lg font-semibold">{tDeep("execution_flow")}</h3>
                    <ExecutionFlow flow={flow} />
                  </section>
                )}

                {/* Design Decisions */}
                <section>
                  <h3 className="mb-3 text-lg font-semibold">{tDeep("design_decisions")}</h3>
                  <DesignDecisions lessonId={lessonId} />
                </section>
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
