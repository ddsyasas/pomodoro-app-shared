import type { TimerSettings, TimerStats } from '../types';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const DEFAULT_STATS: TimerStats = {
  todaySessions: 0,
  totalSessions: 0,
  lastSessionDate: new Date().toISOString().split('T')[0],
};

export const SESSIONS_BEFORE_LONG_BREAK = 4;

export const STORAGE_KEY = 'pomodoro-timer-state';
export const TASKS_STORAGE_KEY = 'pomodoro-tasks';
