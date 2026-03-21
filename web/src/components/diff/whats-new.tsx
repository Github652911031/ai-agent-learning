"use client";

import { useMemo } from "react";
import { Box, Wrench, FunctionSquare, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import type { LessonIndex } from "@/types/agent-data";
import versionData from "@/data/generated/versions.json";
import { LEARNING_PATH } from "@/lib/constants";

const data = versionData as LessonIndex;

interface WhatsNewProps {
  lessonId: string;
}

export function WhatsNew({ lessonId }: WhatsNewProps) {
  const t = useTranslations("diff");

  const diff = useMemo(() => {
    const idx = LEARNING_PATH.indexOf(lessonId as any);
    if (idx <= 0) return null;
    return data.diffs.find(
      (d) => d.from === LEARNING_PATH[idx - 1] && d.to === lessonId
    );
  }, [lessonId]);

  if (!diff) {
    return null;
  }

  const sections = [
    { icon: Box, label: t("new_classes"), items: diff.newClasses, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { icon: Wrench, label: t("new_tools"), items: diff.newTools, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: FunctionSquare, label: t("new_methods"), items: diff.newMethods, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* LOC Delta */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <FileCode size={14} />
          <span className="text-xs">{t("loc_delta")}</span>
        </div>
        <p className={cn("mt-1 text-xl font-bold", diff.locDelta >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
          {diff.locDelta >= 0 ? "+" : ""}{diff.locDelta}
        </p>
      </div>

      {sections.map(({ icon: Icon, label, items, color, bg }) => (
        <div key={label} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Icon size={14} />
            <span className="text-xs">{label}</span>
          </div>
          <p className={cn("mt-1 text-xl font-bold", color)}>{items.length}</p>
          {items.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {items.map((item) => (
                <span key={item} className={cn("rounded px-1.5 py-0.5 text-xs", bg, color)}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
