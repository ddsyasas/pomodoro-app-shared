# Pomodoro Timer App - Technical Specification

> **Purpose**: Test project for Claude Code development capabilities
> **Complexity**: Low (2-3 hours)
> **Stack**: Expo + React Native + TypeScript
> **Backend**: None (local storage only)
> **Version**: 1.0.0
> **Last Updated**: January 2026

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
- Dark and Light mode support

### 1.2 Core Features

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| Timer Display | P0 | ✅ | Large countdown timer (MM:SS) |
| Timer Controls | P0 | ✅ | Start, Pause, Reset, Skip |
| Session Type | P0 | ✅ | Work / Short Break / Long Break |
| Session Counter | P0 | ✅ | Track completed pomodoros |
| Sound Alert | P1 | ✅ | Play sound when timer ends |
| Haptic Feedback | P1 | ✅ | Vibrate on timer end |
| Daily Stats | P1 | ✅ | Sessions completed today |
| Settings | P2 | ✅ | Customize durations |
| Persistence | P2 | ✅ | Save stats locally |
| Dark/Light Mode | P2 | ✅ | Theme toggle with persistence |

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
    "expo": "~54.0.33",
    "expo-av": "~16.0.8",
    "expo-constants": "~18.0.13",
    "expo-haptics": "~15.0.8",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.23",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "@react-native-async-storage/async-storage": "2.2.0",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2"
  }
}
```

### 2.2 Why These Choices

- **Expo SDK 54**: Quick setup, easy testing, latest React Native support
- **Expo Router**: File-based routing for React Native
- **Zustand**: Simple state management (no Redux boilerplate)
- **expo-av**: Audio playback for timer sounds
- **expo-haptics**: Vibration feedback
- **AsyncStorage**: Persist stats and settings locally

---

## 3. PROJECT STRUCTURE

```
pomodoro-app/
│
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with Stack navigation
│   ├── index.tsx                 # Main timer screen
│   ├── stats.tsx                 # Stats screen (modal)
│   └── settings.tsx              # Settings screen (modal)
│
├── src/
│   ├── components/               # UI Components
│   │   ├── Timer/
│   │   │   ├── index.ts          # Barrel export
│   │   │   ├── TimerDisplay.tsx  # MM:SS display
│   │   │   ├── TimerControls.tsx # Start/Pause/Reset buttons
│   │   │   └── SessionIndicator.tsx # Work/Break label + dots
│   │   │
│   │   ├── Stats/
│   │   │   ├── index.ts          # Barrel export
│   │   │   ├── SessionCount.tsx  # Today's completed sessions
│   │   │   └── StatsCard.tsx     # Stats display card
│   │   │
│   │   └── ui/
│   │       ├── index.ts          # Barrel export
│   │       ├── Button.tsx        # Reusable button
│   │       └── Card.tsx          # Container card
│   │
│   ├── hooks/
│   │   ├── index.ts              # Barrel export
│   │   ├── useTimer.ts           # Timer logic hook
│   │   ├── useSound.ts           # Sound playback hook
│   │   └── useTheme.ts           # Theme access hook
│   │
│   ├── stores/
│   │   ├── timerStore.ts         # Zustand timer store
│   │   └── themeStore.ts         # Zustand theme store
│   │
│   ├── utils/
│   │   └── time.ts               # Time formatting utilities
│   │
│   ├── constants/
│   │   ├── config.ts             # Timer durations, storage keys
│   │   └── theme.ts              # Colors (dark/light), fonts, spacing
│   │
│   └── types/
│       └── index.ts              # TypeScript types
│
├── assets/
│   ├── sounds/
│   │   └── bell.mp3              # Timer complete sound
│   ├── icon.png
│   ├── favicon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── index.ts                      # Entry point (expo-router/entry)
```

---

## 4. FEATURES & SCREENS

### 4.1 Main Timer Screen (`app/index.tsx`)

```
┌─────────────────────────────────────┐
│  [Stats]                [Settings]  │
│                                     │
│           SESSION TYPE              │
│            "FOCUS"                  │
│           ● ● ○ ○                   │
│                                     │
│        ┌───────────────┐            │
│        │               │            │
│        │    25:00      │            │
│        │               │            │
│        └───────────────┘            │
│                                     │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │Reset│ │Start│ │Skip │        │
│     └─────┘ └─────┘ └─────┘        │
│                                     │
│      ────────────────────          │
│                                     │
│              4                      │
│       sessions today                │
│                                     │
└─────────────────────────────────────┘
```

**Elements:**
- Navigation buttons (Stats, Settings)
- Session type label (Focus / Short Break / Long Break)
- Progress dots (4 dots showing session progress)
- Large timer display (MM:SS)
- Control buttons (Reset, Start/Pause, Skip)
- Today's completed sessions count

### 4.2 Stats Screen (`app/stats.tsx`)

```
┌─────────────────────────────────────┐
│  ←  Statistics                      │
│                                     │
│  Today                              │
│  ┌──────────────┐ ┌──────────────┐ │
│  │  SESSIONS    │ │  FOCUS TIME  │ │
│  │      4       │ │    100m      │ │
│  └──────────────┘ └──────────────┘ │
│                                     │
│  All Time                           │
│  ┌──────────────┐ ┌──────────────┐ │
│  │TOTAL SESSIONS│ │ TOTAL FOCUS  │ │
│  │     156      │ │    65h       │ │
│  └──────────────┘ └──────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 4.3 Settings Screen (`app/settings.tsx`)

```
┌─────────────────────────────────────┐
│  ←  Settings                        │
│                                     │
│  Appearance                         │
│  ┌─────────────────────────────┐   │
│  │  Dark Mode            [ON]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Timer Durations                    │
│  ┌─────────────────────────────┐   │
│  │  Focus Duration             │   │
│  │  [15][20][25][30][45][60]   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Short Break                │   │
│  │  [3] [5] [10]               │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Long Break                 │   │
│  │  [10][15][20][30]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Notifications                      │
│  ┌─────────────────────────────┐   │
│  │  Sound              [ON]    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Vibration          [ON]    │   │
│  └─────────────────────────────┘   │
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
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
}

// Displays time as MM:SS
// Large, centered text (72px)
// Color changes based on session type:
//   - Focus: Red (#E53935 dark / #D32F2F light)
//   - Short Break: Green (#43A047 dark / #388E3C light)
//   - Long Break: Blue (#1E88E5 dark / #1976D2 light)
```

### 5.2 TimerControls

```typescript
// src/components/Timer/TimerControls.tsx

interface TimerControlsProps {
  isRunning: boolean;
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

// Three buttons in a row:
// [Reset] [Start/Pause] [Skip]
// Start/Pause toggles based on isRunning
// Primary button color matches session type
```

### 5.3 SessionIndicator

```typescript
// src/components/Timer/SessionIndicator.tsx

interface SessionIndicatorProps {
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
  currentSession: number;  // 1-4
}

// Displays:
// - "FOCUS" / "SHORT BREAK" / "LONG BREAK" (uppercase)
// - Four dots showing progress: ● ● ○ ○
```

### 5.4 Button Component

```typescript
// src/components/ui/Button.tsx

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Variants:
// - primary: Filled background, white text
// - secondary: Outlined, colored border/text
// - ghost: No background, text only
```

### 5.5 Card Component

```typescript
// src/components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Surface background with rounded corners
// Uses theme colors (dark: #16213E, light: #FFFFFF)
```

---

## 6. STATE MANAGEMENT

### 6.1 Timer Store (Zustand)

```typescript
// src/stores/timerStore.ts

type SessionType = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focusDuration: number;      // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface TimerStats {
  todaySessions: number;
  totalSessions: number;
  lastSessionDate: string;  // ISO date string (YYYY-MM-DD)
}

interface TimerStore {
  // Timer state
  timeRemaining: number;
  isRunning: boolean;
  sessionType: SessionType;
  currentSession: number;  // 1-4

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

// Default settings
const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  vibrationEnabled: true,
};

// Persisted fields (via AsyncStorage):
// - settings
// - stats
// - sessionType
// - currentSession
```

### 6.2 Theme Store (Zustand)

```typescript
// src/stores/themeStore.ts

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

// Persisted fields (via AsyncStorage):
// - mode
```

---

## 7. TIMER LOGIC

### 7.1 useTimer Hook

```typescript
// src/hooks/useTimer.ts

export function useTimer() {
  // Manages the interval for ticking
  // Triggers sound/haptics on completion
  // Returns timer state and control functions

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
```

### 7.2 Session Transition Logic

```
Focus Session Complete:
  - If currentSession < 4: → Short Break, increment session
  - If currentSession >= 4: → Long Break, reset session to 0

Short Break Complete:
  - → Focus, keep current session number

Long Break Complete:
  - → Focus, reset session to 1
```

### 7.3 Time Formatting Utilities

```typescript
// src/utils/time.ts

formatTime(seconds: number): string
// Returns "MM:SS" format

formatMinutes(minutes: number): string
// Returns "X min" or "Xh Ym" format

getSessionLabel(sessionType: SessionType): string
// Returns "Focus" / "Short Break" / "Long Break"

minutesToSeconds(minutes: number): number
// Converts minutes to seconds

getTodayDate(): string
// Returns "YYYY-MM-DD" format
```

---

## 8. STYLING & THEME

### 8.1 Theme Constants

```typescript
// src/constants/theme.ts

// Dark Theme Colors
export const darkColors: ThemeColors = {
  // Session colors
  focus: '#E53935',
  shortBreak: '#43A047',
  longBreak: '#1E88E5',

  // Background colors
  background: '#1A1A2E',
  surface: '#16213E',
  surfaceLight: '#1F2E4D',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#6B6B6B',

  // UI colors
  border: '#2A2A4A',
  disabled: '#4A4A6A',
};

// Light Theme Colors
export const lightColors: ThemeColors = {
  // Session colors
  focus: '#D32F2F',
  shortBreak: '#388E3C',
  longBreak: '#1976D2',

  // Background colors
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceLight: '#E0E0E8',

  // Text colors
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A5E',
  textMuted: '#7A7A8E',

  // UI colors
  border: '#9A9AB0',
  disabled: '#A0A0B0',
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  timer: 72,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

### 8.2 Using Theme in Components

```typescript
// Access theme via useTheme hook
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { colors, sessionColors, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>Hello</Text>
    </View>
  );
}
```

---

## 9. SOUND & HAPTICS

### 9.1 Sound Hook

```typescript
// src/hooks/useSound.ts

import { Audio } from 'expo-av';

export function useSound() {
  // Loads bell.mp3 on mount
  // Provides playSound() function
  // Unloads sound on unmount

  return { playSound };
}
```

### 9.2 Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

// On timer completion:
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

### 9.3 Sound File

Place at: `assets/sounds/bell.mp3`

---

## 10. LOCAL STORAGE

### 10.1 Storage Keys

```typescript
// Timer state persistence
const STORAGE_KEY = 'pomodoro-timer-state';

// Theme persistence
const THEME_STORAGE_KEY = 'pomodoro-theme';
```

### 10.2 Persisted Data Structure

```json
{
  "pomodoro-timer-state": {
    "settings": {
      "focusDuration": 25,
      "shortBreakDuration": 5,
      "longBreakDuration": 15,
      "soundEnabled": true,
      "vibrationEnabled": true
    },
    "stats": {
      "todaySessions": 4,
      "totalSessions": 156,
      "lastSessionDate": "2026-01-31"
    },
    "sessionType": "focus",
    "currentSession": 1
  },
  "pomodoro-theme": {
    "mode": "dark"
  }
}
```

### 10.3 Daily Reset Logic

```typescript
// Automatically resets todaySessions when date changes
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
```

---

## 11. DEVELOPMENT TASKS

### Task Checklist

```markdown
## Phase 1: Project Setup ✅
- [x] Create new Expo project with TypeScript
- [x] Install dependencies (zustand, expo-av, expo-haptics, async-storage, expo-router)
- [x] Set up folder structure as specified
- [x] Configure app.json with app name and scheme

## Phase 2: Core Components ✅
- [x] Create theme constants (colors, spacing, fonts)
- [x] Create Button component (primary, secondary, ghost variants)
- [x] Create Card component
- [x] Create TimerDisplay component
- [x] Create TimerControls component
- [x] Create SessionIndicator component

## Phase 3: State Management ✅
- [x] Create Zustand timer store
- [x] Add timer actions (start, pause, reset, skip, tick)
- [x] Add session completion logic
- [x] Add settings state and actions
- [x] Add stats state and actions
- [x] Configure persistence with AsyncStorage

## Phase 4: Timer Logic ✅
- [x] Create useTimer hook with interval logic
- [x] Handle timer tick and completion
- [x] Implement session transitions (focus → break → focus)
- [x] Add time formatting utilities

## Phase 5: Main Screen ✅
- [x] Build main timer screen layout
- [x] Connect TimerDisplay to store
- [x] Connect TimerControls to store
- [x] Add SessionIndicator
- [x] Add today's session count
- [x] Style with session-based colors

## Phase 6: Sound & Haptics ✅
- [x] Add bell sound file to assets
- [x] Create useSound hook
- [x] Trigger sound on timer completion
- [x] Add haptic feedback on completion

## Phase 7: Additional Screens ✅
- [x] Create Stats screen
- [x] Create Settings screen (with ScrollView)
- [x] Add navigation between screens (modal presentation)
- [x] Connect settings to store

## Phase 8: Dark/Light Mode ✅
- [x] Create theme store with persistence
- [x] Define light and dark color schemes
- [x] Create useTheme hook
- [x] Update all components to use dynamic colors
- [x] Add theme toggle in Settings
- [x] Update StatusBar based on theme

## Phase 9: Polish ✅
- [x] Test full pomodoro cycle
- [x] Test persistence (close and reopen app)
- [x] Test settings changes
- [x] Test theme switching
- [x] Fix scrolling on Settings screen
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
10. ✅ Dark/Light mode toggle works and persists

---

## File Quick Reference

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with Stack navigation |
| `app/index.tsx` | Main timer screen |
| `app/stats.tsx` | Statistics screen |
| `app/settings.tsx` | Settings screen |
| `src/stores/timerStore.ts` | Timer state management |
| `src/stores/themeStore.ts` | Theme state management |
| `src/hooks/useTimer.ts` | Timer interval logic |
| `src/hooks/useSound.ts` | Audio playback |
| `src/hooks/useTheme.ts` | Theme access |
| `src/components/Timer/*` | Timer UI components |
| `src/components/Stats/*` | Stats UI components |
| `src/components/ui/*` | Reusable UI components |
| `src/constants/theme.ts` | Colors (dark/light), spacing |
| `src/constants/config.ts` | Default settings, storage keys |
| `src/utils/time.ts` | Time formatting |
| `src/types/index.ts` | TypeScript definitions |

---

## Troubleshooting

### Common Issues

**React version mismatch:**
- Error: "react" and "react-native-renderer" must have exact same version
- Fix: `npm install react@19.1.0 --legacy-peer-deps`

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

**Settings page doesn't scroll:**
- Ensure using `ScrollView` instead of `View` for content
- Add `showsVerticalScrollIndicator={false}` for cleaner look

**Theme not updating:**
- Check useTheme hook is imported in component
- Verify colors are applied dynamically (not from static imports)

---

**End of Specification**

This document contains everything needed to build and maintain the Pomodoro Timer app.
