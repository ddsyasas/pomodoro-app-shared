import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  color,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  const buttonStyles = [
    styles.base,
    variant === 'primary' && { backgroundColor: color || colors.focus },
    variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: color || colors.textSecondary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    styles[`${size}Size`],
    disabled && { opacity: 0.5 },
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && { color: '#FFFFFF' },
    variant === 'secondary' && { color: color || colors.textSecondary },
    variant === 'ghost' && { color: colors.textSecondary },
    styles[`${size}Text`],
    disabled && { color: colors.disabled },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },

  // Sizes
  smSize: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 60,
  },
  mdSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minWidth: 80,
  },
  lgSize: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minWidth: 120,
  },

  // Text styles
  text: {
    fontWeight: '600',
  },

  // Text sizes
  smText: {
    fontSize: fontSize.sm,
  },
  mdText: {
    fontSize: fontSize.md,
  },
  lgText: {
    fontSize: fontSize.lg,
  },
});
