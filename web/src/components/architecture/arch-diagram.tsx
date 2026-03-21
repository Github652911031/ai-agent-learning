"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { LessonVersion } from "@/types/agent-data";
import versionData from "@/data/generated/versions.json";
import type { LessonIndex } from "@/types/agent-data";
import { LEARNING_PATH } from "@/lib/constants";

const data = versionData as LessonIndex;

const CLASS_COLORS = [
  "bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:border-blue-700",
  "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-700",
  "bg-purple-100 border-purple-300 dark:bg-purple-900/40 dark:border-purple-700",
  "bg-amber-100 border-amber-300 dark:bg-amber-900/40 dark:border-amber-700",
  "bg-red-100 border-red-300 dark:bg-red-900/40 dark:border-red-700",
  "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/40 dark:border-cyan-700",
  "bg-pink-100 border-pink-300 dark:bg-pink-900/40 dark:border-pink-700",
  "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-700",
];

interface ArchDiagramProps {
  lessonId: string;
}

export function ArchDiagram({ lessonId }: ArchDiagramProps) {
  const versionInfo = useMemo(() => data.versions.find((v) => v.id === lessonId), [lessonId]);

  // Find all classes up to and including this lesson
  const cumulativeClasses = useMemo(() => {
    const idx = LEARNING_PATH.indexOf(lessonId as any);
    if (idx < 0) return [];

    const seen = new Map<string, { name: string; fromLesson: string; lines: number }>();
    for (let i = 0; i <= idx; i++) {
      const ver = data.versions.find((v) => v.id === LEARNING_PATH[i]);
      if (!ver) continue;
      for (const cls of ver.classes) {
        if (!seen.has(cls.name)) {
          seen.set(cls.name, {
            name: cls.name,
            fromLesson: LEARNING_PATH[i],
            lines: cls.endLine - cls.startLine + 1,
          });
        }
      }
    }
    return Array.from(seen.values());
  }, [lessonId]);

  const currentClasses = new Set(versionInfo?.classes.map((c) => c.name) ?? []);

  if (cumulativeClasses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-400">No inner classes in this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cumulativeClasses.map((cls, i) => {
        const isCurrent = currentClasses.has(cls.name);
        const heightPx = Math.max(36, Math.min(cls.lines * 0.5, 80));

        return (
          <div
            key={cls.name}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 transition-all",
              CLASS_COLORS[i % CLASS_COLORS.length],
              !isCurrent && "opacity-40"
            )}
            style={{ height: heightPx }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">{cls.name}</span>
              {cls.fromLesson === lessonId && (
                <span className="rounded bg-white/60 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-black/30 dark:text-green-400">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{cls.lines} lines</span>
              <span className="font-mono">{cls.fromLesson}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
