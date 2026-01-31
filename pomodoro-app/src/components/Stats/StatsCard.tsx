import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../constants/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export function StatsCard({ title, value, subtitle }: StatsCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});
