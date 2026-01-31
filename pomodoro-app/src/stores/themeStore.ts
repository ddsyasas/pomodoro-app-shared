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
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'dark',
      colors: darkColors,

      toggleTheme: () => {
        set((state) => {
          const newMode = state.mode === 'dark' ? 'light' : 'dark';
          return {
            mode: newMode,
            colors: newMode === 'dark' ? darkColors : lightColors,
          };
        });
      },

      setTheme: (mode: ThemeMode) => {
        set({
          mode,
          colors: mode === 'dark' ? darkColors : lightColors,
        });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.colors = state.mode === 'dark' ? darkColors : lightColors;
        }
      },
    }
  )
);
