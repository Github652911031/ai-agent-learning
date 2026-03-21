"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface VizProps {
  lessonId: string;
}

const vizMap: Record<string, ComponentType<VizProps>> = {
  L00: dynamic(() => import("./L00-basic-loop"), { ssr: false }),
  L01: dynamic(() => import("./L01-tool-use"), { ssr: false }),
  L02: dynamic(() => import("./L02-multi-tools"), { ssr: false }),
  L03: dynamic(() => import("./L03-todo"), { ssr: false }),
  L04: dynamic(() => import("./L04-subagents"), { ssr: false }),
  L05: dynamic(() => import("./L05-skills"), { ssr: false }),
  L06: dynamic(() => import("./L06-compact"), { ssr: false }),
  L07: dynamic(() => import("./L07-tasks"), { ssr: false }),
  L08: dynamic(() => import("./L08-background"), { ssr: false }),
  L09: dynamic(() => import("./L09-teams"), { ssr: false }),
  L10: dynamic(() => import("./L10-protocols"), { ssr: false }),
  L11: dynamic(() => import("./L11-autonomous"), { ssr: false }),
  L12: dynamic(() => import("./L12-worktree"), { ssr: false }),
  L13: dynamic(() => import("./L13-full-agent"), { ssr: false }),
};

export function LessonVisualization({ lessonId }: VizProps) {
  const Viz = vizMap[lessonId];

  if (!Viz) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-300 p-8 dark:border-zinc-700">
        <p className="text-sm text-zinc-400">No visualization available for {lessonId}</p>
      </div>
    );
  }

  return <Viz lessonId={lessonId} />;
}
