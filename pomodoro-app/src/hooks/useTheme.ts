import { useThemeStore } from '../stores/themeStore';
import { getSessionColors } from '../constants/theme';

export function useTheme() {
  const { mode, colors, toggleTheme, setTheme } = useThemeStore();

  const sessionColors = getSessionColors(colors);

  return {
    mode,
    colors,
    sessionColors,
    toggleTheme,
    setTheme,
    isDark: mode === 'dark',
  };
}
