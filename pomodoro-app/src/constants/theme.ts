export const colors = {
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
} as const;

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

export const sessionColors = {
  focus: colors.focus,
  shortBreak: colors.shortBreak,
  longBreak: colors.longBreak,
} as const;
