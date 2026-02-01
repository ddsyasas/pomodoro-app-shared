import { useEffect, useRef, useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useTimerStore } from '../stores/timerStore';
import { useSound } from './useSound';
import { minutesToSeconds } from '../utils/time';

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevSessionRef = useRef<string | null>(null);
  const { playSound } = useSound();
  const [showCelebration, setShowCelebration] = useState(false);

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

  // Calculate total time for progress
  const getTotalTime = useCallback(() => {
    switch (sessionType) {
      case 'focus':
        return minutesToSeconds(settings.focusDuration);
      case 'shortBreak':
        return minutesToSeconds(settings.shortBreakDuration);
      case 'longBreak':
        return minutesToSeconds(settings.longBreakDuration);
      default:
        return minutesToSeconds(settings.focusDuration);
    }
  }, [sessionType, settings]);

  const totalTime = getTotalTime();

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

  // Detect session change and trigger celebration for completed focus sessions
  useEffect(() => {
    if (prevSessionRef.current === 'focus' && sessionType !== 'focus') {
      // Just completed a focus session, show celebration
      setShowCelebration(true);
    }
    prevSessionRef.current = sessionType;
  }, [sessionType]);

  // Clear celebration after animation
  const clearCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    timeRemaining,
    totalTime,
    isRunning,
    sessionType,
    currentSession,
    settings,
    stats,
    showCelebration,
    clearCelebration,
    start,
    pause,
    reset,
    skip,
  };
}

