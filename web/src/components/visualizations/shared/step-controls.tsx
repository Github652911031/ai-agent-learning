"use client";

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  annotation?: string;
  onNext: () => void;
  onPrev: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  annotation,
  onNext,
  onPrev,
  onPlay,
  onPause,
  onReset,
}: StepControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} disabled={currentStep <= 0} className="rounded-lg p-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
          <SkipBack size={14} />
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className="rounded-lg p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={onNext} disabled={currentStep >= totalSteps - 1} className="rounded-lg p-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
          <SkipForward size={14} />
        </button>
        <button onClick={onReset} className="rounded-lg p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
          <RotateCcw size={14} />
        </button>
        <span className="ml-2 text-xs text-zinc-400">{currentStep + 1} / {totalSteps}</span>

        {/* Progress dots */}
        <div className="ml-auto flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i <= currentStep ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-600"
              )}
            />
          ))}
        </div>
      </div>

      {annotation && (
        <p className="rounded-md bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
          {annotation}
        </p>
      )}
    </div>
  );
}
