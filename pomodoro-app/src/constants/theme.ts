export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Session colors
  focus: string;
  shortBreak: string;
  longBreak: string;

  // Background colors
  background: string;
  surface: string;
  surfaceLight: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // UI colors
  border: string;
  disabled: string;

  // Task category colors
  categoryWork: string;
  categoryPersonal: string;
  categoryStudy: string;
  categoryOther: string;

  // Task UI colors
  taskOverdue: string;
  taskCompleted: string;
  checkboxBorder: string;
  checkboxFilled: string;
}

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

  // Task category colors
  categoryWork: '#9C27B0',
  categoryPersonal: '#FF9800',
  categoryStudy: '#00BCD4',
  categoryOther: '#607D8B',

  // Task UI colors
  taskOverdue: '#EF5350',
  taskCompleted: '#66BB6A',
  checkboxBorder: '#5A5A7A',
  checkboxFilled: '#7C4DFF',
};

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

  // Task category colors
  categoryWork: '#7B1FA2',
  categoryPersonal: '#F57C00',
  categoryStudy: '#0097A7',
  categoryOther: '#455A64',

  // Task UI colors
  taskOverdue: '#D32F2F',
  taskCompleted: '#388E3C',
  checkboxBorder: '#9A9AB0',
  checkboxFilled: '#651FFF',
};

// Legacy export for backwards compatibility
export const colors = darkColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  timer: 72,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const getSessionColors = (theme: ThemeColors) => ({
  focus: theme.focus,
  shortBreak: theme.shortBreak,
  longBreak: theme.longBreak,
});

// Legacy export
export const sessionColors = {
  focus: darkColors.focus,
  shortBreak: darkColors.shortBreak,
  longBreak: darkColors.longBreak,
} as const;
