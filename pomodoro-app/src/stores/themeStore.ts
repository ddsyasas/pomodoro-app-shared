import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ThemeMode,
  ThemeColors,
  darkColors,
  lightColors,
} from '../constants/theme';

const THEME_STORAGE_KEY = 'pomodoro-theme';

interface ThemeStore {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'system', // Default to system preference

      setTheme: (mode: ThemeMode) => {
        set({ mode });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

// Helper function to get colors based on mode and system preference
export function getThemeColors(mode: ThemeMode, systemIsDark: boolean): ThemeColors {
  if (mode === 'system') {
    return systemIsDark ? darkColors : lightColors;
  }
  return mode === 'dark' ? darkColors : lightColors;
}

// Helper function to check if current theme is dark
export function isDarkTheme(mode: ThemeMode, systemIsDark: boolean): boolean {
  if (mode === 'system') {
    return systemIsDark;
  }
  return mode === 'dark';
}
