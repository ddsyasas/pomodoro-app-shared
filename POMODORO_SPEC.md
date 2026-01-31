# Pomodoro Timer App - Technical Specification

> **Purpose**: Test project for Claude Code development capabilities
> **Complexity**: Low (2-3 hours)
> **Stack**: Expo + React Native + TypeScript
> **Backend**: None (local storage only)

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Features & Screens](#4-features--screens)
5. [Component Specifications](#5-component-specifications)
6. [State Management](#6-state-management)
7. [Timer Logic](#7-timer-logic)
8. [Styling & Theme](#8-styling--theme)
9. [Sound & Haptics](#9-sound--haptics)
10. [Local Storage](#10-local-storage)
11. [Development Tasks](#11-development-tasks)

---

## 1. PROJECT OVERVIEW

### 1.1 What We're Building

A clean, functional Pomodoro Timer app with:
- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks (every 4 sessions)
- Session tracking and daily stats
- Sound/vibration notifications

### 1.2 Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Timer Display | P0 | Large countdown timer (MM:SS) |
| Timer Controls | P0 | Start, Pause, Reset, Skip |
| Session Type | P0 | Work / Short Break / Long Break |
| Session Counter | P0 | Track completed pomodoros |
| Sound Alert | P1 | Play sound when timer ends |
| Haptic Feedback | P1 | Vibrate on timer end |
| Daily Stats | P1 | Sessions completed today |
| Settings | P2 | Customize durations |
| Persistence | P2 | Save stats locally |

### 1.3 Pomodoro Rules

```
Standard Pomodoro Technique:
1. Work for 25 minutes
2. Take a 5-minute short break
3. Repeat steps 1-2 four times
4. Take a 15-minute long break
5. Reset and repeat

Cycle: [Work → Short Break] × 4 → Long Break
```

---

## 2. TECH STACK

### 2.1 Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-av": "~14.0.0",
    "expo-haptics": "~13.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-safe-area-context": "4.12.0",
    "@react-native-async-storage/async-storage": "1.24.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0"
  }
}
```

### 2.2 Why These Choices

- **Expo**: Quick setup, easy testing
- **Zustand**: Simple state management (no Redux boilerplate)
- **expo-av**: Audio playback for timer sounds
- **expo-haptics**: Vibration feedback
- **AsyncStorage**: Persist stats locally

---

## 3. PROJECT STRUCTURE

```
pomodoro-app/
│
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Main timer screen
│   ├── stats.tsx                 # Stats screen
│   └── settings.tsx              # Settings screen
│
├── src/
│   ├── components/               # UI Components
│   │   ├── Timer/
│   │   │   ├── TimerDisplay.tsx  # MM:SS display
│   │   │   ├── TimerControls.tsx # Start/Pause/Reset buttons
│   │   │   ├── SessionIndicator.tsx # Work/Break label
│   │   │   └── ProgressRing.tsx  # Circular progress (optional)
│   │   │
│   │   ├── Stats/
│   │   │   ├── SessionCount.tsx  # Today's completed sessions
│   │   │   └── StatsCard.tsx     # Stats display card
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx        # Reusable button
│   │       ├── IconButton.tsx    # Icon-only button
│   │       └── Card.tsx          # Container card
│   │
│   ├── hooks/
│   │   ├── useTimer.ts           # Timer logic hook
│   │   └── useSound.ts           # Sound playback hook
│   │
│   ├── stores/
│   │   └── timerStore.ts         # Zustand store
│   │
│   ├── utils/
│   │   ├── time.ts               # Time formatting
│   │   └── storage.ts            # AsyncStorage helpers
│   │
│   ├── constants/
│   │   ├── config.ts             # Timer durations
│   │   └── theme.ts              # Colors, fonts
│   │
│   └── types/
│       └── index.ts              # TypeScript types
│
├── assets/
│   ├── sounds/
│   │   └── bell.mp3              # Timer complete sound
│   └── images/
│       └── icon.png
│
├── app.json
├── tsconfig.json
└── package.json
```

---

## 4. FEATURES & SCREENS

### 4.1 Main Timer Screen (`app/index.tsx`)

```
┌─────────────────────────────────────┐
│                                     │
│           SESSION TYPE              │
│            "Focus"                  │
│                                     │
│        ┌───────────────┐            │
│        │               │            │
│        │    25:00      │            │
│        │               │            │
│        └───────────────┘            │
│                                     │
│         Session 1 of 4              │
│                                     │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │  ⟲  │ │ ▶️  │ │  ⏭  │        │
│     │Reset│ │Start│ │Skip │        │
│     └─────┘ └─────┘ └─────┘        │
│                                     │
│      ────────────────────          │
│                                     │
│       Today: 🍅 4 sessions          │
│                                     │
│     [Stats]              [Settings] │
└─────────────────────────────────────┘
```

**Elements:**
- Session type label (Focus / Short Break / Long Break)
- Large timer display (MM:SS)
- Session counter (1 of 4)
- Control buttons (Reset, Start/Pause, Skip)
- Today's completed sessions
- Navigation to Stats and Settings

### 4.2 Stats Screen (`app/stats.tsx`)

```
┌─────────────────────────────────────┐
│  ←  Statistics                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Today                       │   │
│  │  🍅 4 sessions (100 min)     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  This Week                   │   │
│  │  🍅 24 sessions              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  All Time                    │   │
│  │  🍅 156 sessions             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Reset All Stats]                  │
│                                     │
└─────────────────────────────────────┘
```

### 4.3 Settings Screen (`app/settings.tsx`)

```
┌─────────────────────────────────────┐
│  ←  Settings                        │
│                                     │
│  Timer Durations                    │
│  ┌─────────────────────────────┐   │
│  │  Focus         [25] minutes  │   │
│  │  Short Break   [ 5] minutes  │   │
│  │  Long Break    [15] minutes  │   │
│  │  Sessions until long break [4]│   │
│  └─────────────────────────────┘   │
│                                     │
│  Notifications                      │
│  ┌─────────────────────────────┐   │
│  │  Sound            [ON]       │   │
│  │  Vibration        [ON]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Reset to Defaults]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 TimerDisplay

```typescript
// src/components/Timer/TimerDisplay.tsx

interface TimerDisplayProps {
  timeRemaining: number;  // seconds
  isRunning: boolean;
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
}

// Displays time as MM:SS
// Large, centered text
// Color changes based on session type:
//   - Focus: Red/Tomato (#E53935)
//   - Short Break: Green (#43A047)
//   - Long Break: Blue (#1E88E5)
```

### 5.2 TimerControls

```typescript
// src/components/Timer/TimerControls.tsx

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

// Three buttons in a row:
// [Reset] [Start/Pause] [Skip]
// Start/Pause toggles based on isRunning
// Icons: ↺ ▶/⏸ ⏭
```

### 5.3 SessionIndicator

```typescript
// src/components/Timer/SessionIndicator.tsx

interface SessionIndicatorProps {
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
  currentSession: number;  // 1-4
  totalSessions: number;   // typically 4
}

// Displays:
// - "Focus" / "Short Break" / "Long Break"
// - "Session 2 of 4" (only during focus)
// - Four dots showing progress: ● ● ○ ○
```

### 5.4 Button Component

```typescript
// src/components/ui/Button.tsx

interface ButtonProps {
  title?: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
}

// Variants:
// - primary: Filled background, white text
// - secondary: Outlined, colored text
// - ghost: No background, icon only
```

---

## 6. STATE MANAGEMENT

### 6.1 Timer Store (Zustand)

```typescript
// src/stores/timerStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SessionType = 'focus' | 'shortBreak' | 'longBreak';

interface TimerState {
  // Timer state
  timeRemaining: number;
  isRunning: boolean;
  sessionType: SessionType;
  currentSession: number;  // 1-4
  
  // Settings
  focusDuration: number;      // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  // Stats
  todaySessions: number;
  totalSessions: number;
  lastSessionDate: string;  // ISO date string
  
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  completeSession: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<TimerSettings>) => void;
  resetSettings: () => void;
  
  // Stats actions
  resetStats: () => void;
}

interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeRemaining: DEFAULT_SETTINGS.focusDuration * 60,
      isRunning: false,
      sessionType: 'focus',
      currentSession: 1,
      
      // Settings
      ...DEFAULT_SETTINGS,
      
      // Stats
      todaySessions: 0,
      totalSessions: 0,
      lastSessionDate: new Date().toISOString().split('T')[0],
      
      // Actions
      start: () => set({ isRunning: true }),
      
      pause: () => set({ isRunning: false }),
      
      reset: () => {
        const state = get();
        const duration = getDurationForSession(state.sessionType, state);
        set({ timeRemaining: duration * 60, isRunning: false });
      },
      
      skip: () => {
        const state = get();
        get().completeSession();
      },
      
      tick: () => {
        const state = get();
        if (state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 });
        } else {
          get().completeSession();
        }
      },
      
      completeSession: () => {
        const state = get();
        
        // Determine next session
        let nextType: SessionType;
        let nextSession = state.currentSession;
        let todaySessions = state.todaySessions;
        let totalSessions = state.totalSessions;
        
        // Check if we need to reset daily stats
        const today = new Date().toISOString().split('T')[0];
        if (state.lastSessionDate !== today) {
          todaySessions = 0;
        }
        
        if (state.sessionType === 'focus') {
          // Completed a focus session
          todaySessions += 1;
          totalSessions += 1;
          
          if (state.currentSession >= state.sessionsUntilLongBreak) {
            nextType = 'longBreak';
            nextSession = 1;
          } else {
            nextType = 'shortBreak';
          }
        } else {
          // Completed a break
          nextType = 'focus';
          if (state.sessionType === 'longBreak') {
            nextSession = 1;
          } else {
            nextSession = state.currentSession + 1;
          }
        }
        
        const nextDuration = getDurationForSession(nextType, state);
        
        set({
          sessionType: nextType,
          currentSession: nextSession,
          timeRemaining: nextDuration * 60,
          isRunning: false,
          todaySessions,
          totalSessions,
          lastSessionDate: today,
        });
      },
      
      updateSettings: (settings) => {
        set({ ...settings });
        // Reset timer with new duration if not running
        const state = get();
        if (!state.isRunning) {
          const duration = getDurationForSession(state.sessionType, { ...state, ...settings });
          set({ timeRemaining: duration * 60 });
        }
      },
      
      resetSettings: () => {
        set({ ...DEFAULT_SETTINGS });
        const state = get();
        const duration = getDurationForSession(state.sessionType, { ...state, ...DEFAULT_SETTINGS });
        set({ timeRemaining: duration * 60, isRunning: false });
      },
      
      resetStats: () => set({
        todaySessions: 0,
        totalSessions: 0,
        lastSessionDate: new Date().toISOString().split('T')[0],
      }),
    }),
    {
      name: 'pomodoro-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
        soundEnabled: state.soundEnabled,
        vibrationEnabled: state.vibrationEnabled,
        todaySessions: state.todaySessions,
        totalSessions: state.totalSessions,
        lastSessionDate: state.lastSessionDate,
      }),
    }
  )
);

// Helper function
function getDurationForSession(
  type: SessionType,
  settings: { focusDuration: number; shortBreakDuration: number; longBreakDuration: number }
): number {
  switch (type) {
    case 'focus':
      return settings.focusDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}
```

---

## 7. TIMER LOGIC

### 7.1 useTimer Hook

```typescript
// src/hooks/useTimer.ts

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '@/stores/timerStore';
import { useSound } from './useSound';
import * as Haptics from 'expo-haptics';

export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSound();
  
  const {
    timeRemaining,
    isRunning,
    sessionType,
    currentSession,
    sessionsUntilLongBreak,
    soundEnabled,
    vibrationEnabled,
    todaySessions,
    start,
    pause,
    reset,
    skip,
    tick,
  } = useTimerStore();

  // Main timer interval
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
      }
    };
  }, [isRunning, tick]);

  // Handle timer completion
  useEffect(() => {
    if (timeRemaining === 0 && !isRunning) {
      // Timer just completed
      if (soundEnabled) {
        playSound();
      }
      if (vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [timeRemaining, isRunning, soundEnabled, vibrationEnabled]);

  // Handle app state (pause when backgrounded - optional)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      // Optional: pause when app goes to background
      // if (state === 'background' && isRunning) {
      //   pause();
      // }
    });

    return () => subscription.remove();
  }, [isRunning]);

  return {
    timeRemaining,
    isRunning,
    sessionType,
    currentSession,
    sessionsUntilLongBreak,
    todaySessions,
    start,
    pause,
    reset,
    skip,
    toggle: isRunning ? pause : start,
  };
}
```

### 7.2 Time Formatting Utility

```typescript
// src/utils/time.ts

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getSessionLabel(type: 'focus' | 'shortBreak' | 'longBreak'): string {
  switch (type) {
    case 'focus':
      return 'Focus';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
  }
}
```

---

## 8. STYLING & THEME

### 8.1 Theme Constants

```typescript
// src/constants/theme.ts

export const colors = {
  // Session colors
  focus: '#E53935',       // Red
  shortBreak: '#43A047',  // Green
  longBreak: '#1E88E5',   // Blue
  
  // UI colors
  background: '#1A1A2E',  // Dark blue-black
  surface: '#16213E',     // Slightly lighter
  surfaceLight: '#0F3460',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',
  
  // Button colors
  buttonPrimary: '#E53935',
  buttonSecondary: '#2A2A4A',
  buttonDisabled: '#404040',
  
  // Accent
  accent: '#E94560',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  timer: 72,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
```

### 8.2 Session-Based Theming

```typescript
// Get color based on current session type
export function getSessionColor(sessionType: 'focus' | 'shortBreak' | 'longBreak'): string {
  return colors[sessionType];
}

// Usage in components:
// const bgColor = getSessionColor(sessionType);
// style={{ backgroundColor: bgColor }}
```

---

## 9. SOUND & HAPTICS

### 9.1 Sound Hook

```typescript
// src/hooks/useSound.ts

import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useSound() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Load sound on mount
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/bell.mp3')
      );
      soundRef.current = sound;
    }

    loadSound();

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  return { playSound };
}
```

### 9.2 Sound File

You'll need a bell/chime sound file. Options:
- Download a free one from freesound.org
- Use a simple iOS/Android system sound
- Generate one using an online tool

Place at: `assets/sounds/bell.mp3`

---

## 10. LOCAL STORAGE

### 10.1 Storage Structure

```typescript
// Data stored in AsyncStorage via Zustand persist

{
  "pomodoro-storage": {
    "state": {
      // Settings
      "focusDuration": 25,
      "shortBreakDuration": 5,
      "longBreakDuration": 15,
      "sessionsUntilLongBreak": 4,
      "soundEnabled": true,
      "vibrationEnabled": true,
      
      // Stats
      "todaySessions": 4,
      "totalSessions": 156,
      "lastSessionDate": "2025-01-31"
    },
    "version": 0
  }
}
```

### 10.2 Daily Reset Logic

```typescript
// In the store, check if day changed
const today = new Date().toISOString().split('T')[0];
if (state.lastSessionDate !== today) {
  // New day, reset daily counter
  set({ 
    todaySessions: 0,
    lastSessionDate: today 
  });
}
```

---

## 11. DEVELOPMENT TASKS

### Task Checklist for Claude Code

Use this checklist to instruct Claude Code step by step:

```markdown
## Phase 1: Project Setup
- [ ] Create new Expo project with TypeScript
- [ ] Install dependencies (zustand, expo-av, expo-haptics, async-storage)
- [ ] Set up folder structure as specified
- [ ] Configure app.json with app name and icons

## Phase 2: Core Components
- [ ] Create theme constants (colors, spacing, fonts)
- [ ] Create Button component (primary, secondary, ghost variants)
- [ ] Create Card component
- [ ] Create TimerDisplay component
- [ ] Create TimerControls component
- [ ] Create SessionIndicator component

## Phase 3: State Management
- [ ] Create Zustand store with timer state
- [ ] Add timer actions (start, pause, reset, skip, tick)
- [ ] Add session completion logic
- [ ] Add settings state and actions
- [ ] Add stats state and actions
- [ ] Configure persistence with AsyncStorage

## Phase 4: Timer Logic
- [ ] Create useTimer hook with interval logic
- [ ] Handle timer tick and completion
- [ ] Implement session transitions (focus → break → focus)
- [ ] Add time formatting utilities

## Phase 5: Main Screen
- [ ] Build main timer screen layout
- [ ] Connect TimerDisplay to store
- [ ] Connect TimerControls to store
- [ ] Add SessionIndicator
- [ ] Add today's session count
- [ ] Style with session-based colors

## Phase 6: Sound & Haptics
- [ ] Add bell sound file to assets
- [ ] Create useSound hook
- [ ] Trigger sound on timer completion
- [ ] Add haptic feedback on completion

## Phase 7: Additional Screens
- [ ] Create Stats screen
- [ ] Create Settings screen
- [ ] Add navigation between screens
- [ ] Connect settings to store

## Phase 8: Polish
- [ ] Test full pomodoro cycle
- [ ] Test persistence (close and reopen app)
- [ ] Test settings changes
- [ ] Fix any bugs
- [ ] Add app icon
```

---

## Example Prompts for Claude Code

### Prompt 1: Initial Setup
```
Read the POMODORO_SPEC.md file. Set up the Expo project with TypeScript, 
install all required dependencies, and create the folder structure exactly 
as specified in section 3.
```

### Prompt 2: Build Components
```
Following POMODORO_SPEC.md, create the theme constants and all UI components:
Button, Card, TimerDisplay, TimerControls, and SessionIndicator. 
Use the exact interfaces specified in section 5.
```

### Prompt 3: State Management
```
Following POMODORO_SPEC.md section 6, create the Zustand store with all 
timer state, actions, and AsyncStorage persistence. Include the complete 
implementation as specified.
```

### Prompt 4: Main Screen
```
Following POMODORO_SPEC.md, build the main timer screen (app/index.tsx). 
Connect all components to the store and implement the useTimer hook. 
The layout should match section 4.1.
```

### Prompt 5: Complete App
```
Following POMODORO_SPEC.md, complete the remaining features:
- Add sound and haptics (section 9)
- Create Stats screen (section 4.2)
- Create Settings screen (section 4.3)
- Add navigation between screens
Test the complete pomodoro cycle works correctly.
```

---

## Success Criteria

The app is complete when:

1. ✅ Timer counts down from 25:00
2. ✅ Start/Pause/Reset/Skip buttons work
3. ✅ Timer auto-transitions: Focus → Short Break → Focus (×4) → Long Break
4. ✅ Sound plays when timer ends
5. ✅ Phone vibrates when timer ends
6. ✅ Session counter increments after each focus session
7. ✅ Stats persist when app is closed and reopened
8. ✅ Settings can change timer durations
9. ✅ Colors change based on session type (red/green/blue)

---

## Troubleshooting

### Common Issues

**Timer doesn't tick:**
- Check if `isRunning` is true
- Verify `setInterval` is set up in `useEffect`
- Make sure `tick()` updates `timeRemaining`

**Sound doesn't play:**
- Verify bell.mp3 exists in assets/sounds/
- Check `Audio.Sound.createAsync` path
- Ensure `soundEnabled` is true

**State not persisting:**
- Verify AsyncStorage is installed
- Check Zustand persist middleware setup
- Verify `partialize` includes the fields you want saved

**Session doesn't transition:**
- Debug `completeSession()` function
- Check `timeRemaining === 0` triggers completion
- Verify session type logic

---

## File: Quick Reference

| File | Purpose |
|------|---------|
| `app/index.tsx` | Main timer screen |
| `app/stats.tsx` | Statistics screen |
| `app/settings.tsx` | Settings screen |
| `src/stores/timerStore.ts` | All app state |
| `src/hooks/useTimer.ts` | Timer interval logic |
| `src/hooks/useSound.ts` | Audio playback |
| `src/components/Timer/*` | Timer UI components |
| `src/constants/theme.ts` | Colors, spacing |
| `src/utils/time.ts` | Time formatting |

---

**End of Specification**

This document contains everything needed to build a functional Pomodoro Timer app. 
Use it as the reference when developing with Claude Code.
