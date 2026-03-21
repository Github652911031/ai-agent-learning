"use client";
import { useState, useCallback, useEffect, useRef } from "react";

export function useSteppedVisualization(totalSteps: number, autoPlaySpeed = 1500) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isComplete = currentStep >= totalSteps - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const play = useCallback(() => {
    if (isComplete) setCurrentStep(0);
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStep(0);
  }, [clearTimer]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlaySpeed);
    }
    return clearTimer;
  }, [isPlaying, autoPlaySpeed, totalSteps, clearTimer]);

  return { currentStep, isPlaying, isComplete, next, prev, goTo, play, pause, reset };
}
