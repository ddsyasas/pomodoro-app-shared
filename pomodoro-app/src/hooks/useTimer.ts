import { useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useTimerStore } from '../stores/timerStore';
import { useSound } from './useSound';

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const { playSound } = useSound();

  const {
    timeRemaining,
    isRunning,
    sessionType,
    currentSession,
    settings,
    stats,
    start,
    pause,
    reset,
    skip,
    tick,
  } = useTimerStore();

  // Handle timer completion (sound and haptics)
  const handleCompletion = useCallback(async () => {
    if (settings.soundEnabled) {
      await playSound();
    }
    if (settings.vibrationEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [settings.soundEnabled, settings.vibrationEnabled, playSound]);

  // Timer interval effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick]);

  // Detect timer completion (when time goes from 1 to 0)
  useEffect(() => {
    if (prevTimeRef.current === 1 && timeRemaining !== 1) {
      // Timer just completed
      handleCompletion();
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, handleCompletion]);

  return {
    timeRemaining,
    isRunning,
    sessionType,
    currentSession,
    settings,
    stats,
    start,
    pause,
    reset,
    skip,
  };
}
