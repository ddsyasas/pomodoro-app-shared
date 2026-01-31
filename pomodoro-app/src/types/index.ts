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

// Task Types
export type TaskCategory = 'work' | 'personal' | 'study' | 'other';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  dueDate: string | null; // ISO date string or null
  completed: boolean;
  createdAt: string; // ISO timestamp
}

export type TaskFilter = 'active' | 'completed';

export interface TaskStore {
  // State
  tasks: Task[];
  filter: TaskFilter;
  categoryFilter: TaskCategory | null;
  activeTaskId: string | null; // Currently selected task for pomodoro

  // Actions
  addTask: (title: string, category: TaskCategory, dueDate: string | null) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  setFilter: (filter: TaskFilter) => void;
  setCategoryFilter: (category: TaskCategory | null) => void;
  setActiveTask: (id: string | null) => void;
  clearCompleted: () => void;
}
