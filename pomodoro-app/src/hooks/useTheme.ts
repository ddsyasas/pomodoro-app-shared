import { useColorScheme } from 'react-native';
import { useThemeStore, getThemeColors, isDarkTheme } from '../stores/themeStore';
import { getSessionColors } from '../constants/theme';

export function useTheme() {
  const { mode, setTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const systemIsDark = systemColorScheme === 'dark';

  const colors = getThemeColors(mode, systemIsDark);
  const isDark = isDarkTheme(mode, systemIsDark);
  const sessionColors = getSessionColors(colors);

  return {
    mode,
    colors,
    sessionColors,
    setTheme,
    isDark,
  };
}
