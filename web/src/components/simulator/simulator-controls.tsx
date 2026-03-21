"use client";

import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorControlsProps {
  isPlaying: boolean;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [
  { label: "0.5x", value: 4000 },
  { label: "1x", value: 2000 },
  { label: "2x", value: 1000 },
  { label: "3x", value: 666 },
];

export function SimulatorControls({
  isPlaying,
  isComplete,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}: SimulatorControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isComplete && !isPlaying}
          className={cn(
            "rounded-lg p-2 transition-colors",
            "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={onStep}
          disabled={isComplete || isPlaying}
          className={cn(
            "rounded-lg p-2 transition-colors",
            "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Step"
        >
          <SkipForward size={16} />
        </button>
        <button
          onClick={onReset}
          className={cn(
            "rounded-lg p-2 transition-colors",
            "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          )}
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {SPEEDS.map((s) => (
          <button
            key={s.value}
            onClick={() => onSpeedChange(s.value)}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs transition-colors",
              speed === s.value
                ? "bg-white font-medium shadow-sm dark:bg-zinc-700"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <span className="text-xs text-zinc-400">
        {Math.max(0, currentStep + 1)} / {totalSteps}
      </span>

      {/* Progress bar */}
      <div className="ml-auto h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ minWidth: 80 }}>
        <div
          className="h-full rounded-full bg-zinc-900 transition-all duration-300 dark:bg-white"
          style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
