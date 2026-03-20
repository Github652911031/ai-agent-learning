"use client";

import { DocRenderer } from "@/components/docs/doc-renderer";
import { SourceViewer } from "@/components/code/source-viewer";
import { Tabs } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/i18n";

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

  const tabs = [
    { id: "learn", label: t("tab_learn") },
    { id: "code", label: t("tab_code") },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} defaultTab="learn">
        {(activeTab) => (
          <>
            {activeTab === "learn" && <DocRenderer lessonId={lessonId} />}
            {activeTab === "code" && (
              source ? (
                <SourceViewer source={source} filename={filename} />
              ) : (
                <div className="py-8 text-center text-zinc-400">
                  Source code not available.
                </div>
              )
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
