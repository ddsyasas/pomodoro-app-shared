export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  sessionType: SessionType;
  currentSession: number; // 1-4, resets after long break
}

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface TimerStats {
  todaySessions: number;
  totalSessions: number;
  lastSessionDate: string; // ISO date string
}

export interface TimerStore {
  // Timer state
  timeRemaining: number;
  isRunning: boolean;
  sessionType: SessionType;
  currentSession: number;

  // Settings
  settings: TimerSettings;

  // Stats
  stats: TimerStats;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  completeSession: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  checkDailyReset: () => void;
}
