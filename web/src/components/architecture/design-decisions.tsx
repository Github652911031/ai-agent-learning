"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "@/lib/i18n";

interface Decision {
  id: string;
  title: string;
  description: string;
  alternatives?: string;
  zh?: {
    title: string;
    description: string;
  };
}

interface AnnotationData {
  version: string;
  decisions: Decision[];
}

interface DesignDecisionsProps {
  lessonId: string;
}

export function DesignDecisions({ lessonId }: DesignDecisionsProps) {
  const locale = useLocale();
  const t = useTranslations("deep_dive");
  const [annotations, setAnnotations] = useState<AnnotationData | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    import(`@/data/annotations/${lessonId}.json`)
      .then((mod) => setAnnotations(mod.default as AnnotationData))
      .catch(() => setAnnotations(null));
  }, [lessonId]);

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!annotations || annotations.decisions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-400">{t("no_decisions")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {annotations.decisions.map((d) => {
        const expanded = expandedIds.has(d.id);
        const title = locale === "zh" && d.zh?.title ? d.zh.title : d.title;
        const description = locale === "zh" && d.zh?.description ? d.zh.description : d.description;

        return (
          <div
            key={d.id}
            className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <button
              onClick={() => toggle(d.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <Lightbulb size={16} className="shrink-0 text-amber-500" />
              <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{title}</span>
              {expanded ? (
                <ChevronDown size={16} className="shrink-0 text-zinc-400" />
              ) : (
                <ChevronRight size={16} className="shrink-0 text-zinc-400" />
              )}
            </button>
            {expanded && (
              <div className="border-t border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
                {d.alternatives && (
                  <div className="mt-3 rounded-md bg-zinc-100 p-3 dark:bg-zinc-800">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("alternatives")}</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{d.alternatives}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
