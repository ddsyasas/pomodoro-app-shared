import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../constants/theme';

interface SessionCountProps {
  count: number;
}

export function SessionCount({ count }: SessionCountProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.count, { color: colors.textPrimary }]}>{count}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        sessions today
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  count: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  label: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
