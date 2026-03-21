"use client";
import { useState, useCallback, useEffect, useRef } from "react";

export interface SimStep {
  type: "user_message" | "assistant_text" | "tool_call" | "tool_result";
  content: string;
  toolName?: string;
  annotation?: string;
}

export interface Scenario {
  version: string;
  title: string;
  description: string;
  steps: SimStep[];
}

export function useSimulator(scenario: Scenario | null) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = scenario?.steps.length ?? 0;
  const isComplete = currentStep >= totalSteps - 1;
  const visibleSteps = scenario ? scenario.steps.slice(0, currentStep + 1) : [];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const step = useCallback(() => {
    setCurrentStep((prev) => {
      if (!scenario || prev >= scenario.steps.length - 1) return prev;
      return prev + 1;
    });
  }, [scenario]);

  const play = useCallback(() => {
    if (isComplete) return;
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStep(-1);
  }, [clearTimer]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      // step immediately when first playing
      step();
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (!scenario || prev >= scenario.steps.length - 1) {
            setIsPlaying(false);
            clearTimer();
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return clearTimer;
  }, [isPlaying, speed, isComplete, step, scenario, clearTimer]);

  // Reset when scenario changes
  useEffect(() => {
    reset();
  }, [scenario?.version]);

  return { currentStep, visibleSteps, isPlaying, isComplete, play, pause, step, reset, speed, setSpeed };
}
