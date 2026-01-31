import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '../src/components/Stats/StatsCard';
import { useTimerStore } from '../src/stores/timerStore';
import { useTheme } from '../src/hooks/useTheme';
import { spacing, fontSize } from '../src/constants/theme';

export default function StatsScreen() {
  const stats = useTimerStore((state) => state.stats);
  const { colors } = useTheme();

  const focusTimeToday = stats.todaySessions * 25; // minutes
  const totalFocusTime = stats.totalSessions * 25;

  const formatHoursMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Today
        </Text>
        <View style={styles.row}>
          <StatsCard title="Sessions" value={stats.todaySessions} />
          <StatsCard title="Focus Time" value={formatHoursMinutes(focusTimeToday)} />
        </View>

        <Text
          style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.textPrimary }]}
        >
          All Time
        </Text>
        <View style={styles.row}>
          <StatsCard title="Total Sessions" value={stats.totalSessions} />
          <StatsCard title="Total Focus" value={formatHoursMinutes(totalFocusTime)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  sectionSpacing: {
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
