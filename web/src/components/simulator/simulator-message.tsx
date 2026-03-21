"use client";

import { cn } from "@/lib/utils";
import { User, Bot, Terminal, ArrowDownRight } from "lucide-react";

interface SimulatorMessageProps {
  step: {
    type: "user_message" | "assistant_text" | "tool_call" | "tool_result";
    content: string;
    toolName?: string;
    annotation?: string;
  };
  index: number;
  showAnnotation?: boolean;
}

const TYPE_CONFIG = {
  user_message: {
    icon: User,
    label: "User",
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  },
  assistant_text: {
    icon: Bot,
    label: "Assistant",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400",
  },
  tool_call: {
    icon: Terminal,
    label: "Tool Call",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
  },
  tool_result: {
    icon: ArrowDownRight,
    label: "Tool Result",
    bg: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  },
};

export function SimulatorMessage({ step, index, showAnnotation = true }: SimulatorMessageProps) {
  const config = TYPE_CONFIG[step.type];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4", config.bg)}>
      <div className="flex items-start gap-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.iconBg)}>
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              #{index + 1} {config.label}
            </span>
            {step.toolName && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-700">
                {step.toolName}
              </span>
            )}
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {step.content}
          </pre>
          {showAnnotation && step.annotation && (
            <p className="mt-2 border-t border-zinc-200/50 pt-2 text-xs italic text-zinc-500 dark:border-zinc-700/50 dark:text-zinc-400">
              {step.annotation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
