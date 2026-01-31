import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TimerStore, SessionType, TimerSettings } from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  SESSIONS_BEFORE_LONG_BREAK,
  STORAGE_KEY,
} from '../constants/config';
import { minutesToSeconds, getTodayDate } from '../utils/time';

const getInitialTimeForSession = (
  sessionType: SessionType,
  settings: TimerSettings
): number => {
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
};

const getNextSession = (
  currentSessionType: SessionType,
  currentSession: number
): { sessionType: SessionType; currentSession: number } => {
  if (currentSessionType === 'focus') {
    // After focus, determine break type
    if (currentSession >= SESSIONS_BEFORE_LONG_BREAK) {
      return { sessionType: 'longBreak', currentSession: 0 };
    }
    return { sessionType: 'shortBreak', currentSession };
  } else {
    // After any break, go to focus
    const nextSession =
      currentSessionType === 'longBreak' ? 1 : currentSession + 1;
    return { sessionType: 'focus', currentSession: nextSession };
  }
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Timer state
      timeRemaining: minutesToSeconds(DEFAULT_SETTINGS.focusDuration),
      isRunning: false,
      sessionType: 'focus' as SessionType,
      currentSession: 1,

      // Settings
      settings: DEFAULT_SETTINGS,

      // Stats
      stats: DEFAULT_STATS,

      // Actions
      start: () => {
        set({ isRunning: true });
      },

      pause: () => {
        set({ isRunning: false });
      },

      reset: () => {
        const { sessionType, settings } = get();
        set({
          timeRemaining: getInitialTimeForSession(sessionType, settings),
          isRunning: false,
        });
      },

      skip: () => {
        const { sessionType, currentSession, settings } = get();
        const next = getNextSession(sessionType, currentSession);
        set({
          sessionType: next.sessionType,
          currentSession: next.currentSession,
          timeRemaining: getInitialTimeForSession(next.sessionType, settings),
          isRunning: false,
        });
      },

      tick: () => {
        const { timeRemaining, isRunning } = get();
        if (!isRunning) return;

        if (timeRemaining <= 1) {
          get().completeSession();
        } else {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      completeSession: () => {
        const { sessionType, currentSession, settings, stats } = get();
        const next = getNextSession(sessionType, currentSession);

        // Update stats if completing a focus session
        const today = getTodayDate();
        let newStats = { ...stats };

        if (sessionType === 'focus') {
          // Check if we need to reset daily stats
          if (stats.lastSessionDate !== today) {
            newStats = {
              todaySessions: 1,
              totalSessions: stats.totalSessions + 1,
              lastSessionDate: today,
            };
          } else {
            newStats = {
              ...stats,
              todaySessions: stats.todaySessions + 1,
              totalSessions: stats.totalSessions + 1,
            };
          }
        }

        set({
          sessionType: next.sessionType,
          currentSession: next.currentSession,
          timeRemaining: getInitialTimeForSession(next.sessionType, settings),
          isRunning: false,
          stats: newStats,
        });
      },

      updateSettings: (newSettings: Partial<TimerSettings>) => {
        const { settings, sessionType, isRunning } = get();
        const updatedSettings = { ...settings, ...newSettings };

        // If not running, update the time remaining to reflect new duration
        const updates: Partial<TimerStore> = { settings: updatedSettings };

        if (!isRunning) {
          updates.timeRemaining = getInitialTimeForSession(
            sessionType,
            updatedSettings
          );
        }

        set(updates);
      },

      checkDailyReset: () => {
        const { stats } = get();
        const today = getTodayDate();

        if (stats.lastSessionDate !== today) {
          set({
            stats: {
              ...stats,
              todaySessions: 0,
              lastSessionDate: today,
            },
          });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        sessionType: state.sessionType,
        currentSession: state.currentSession,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset timer to correct duration after rehydration
          const duration = getInitialTimeForSession(
            state.sessionType,
            state.settings
          );
          state.timeRemaining = duration;
          state.isRunning = false;

          // Check for daily reset
          state.checkDailyReset();
        }
      },
    }
  )
);
