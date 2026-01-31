import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TimerDisplay } from '../src/components/Timer/TimerDisplay';
import { TimerControls } from '../src/components/Timer/TimerControls';
import { SessionIndicator } from '../src/components/Timer/SessionIndicator';
import { SessionCount } from '../src/components/Stats/SessionCount';
import { useTimer } from '../src/hooks/useTimer';
import { useTheme } from '../src/hooks/useTheme';
import { spacing, fontSize } from '../src/constants/theme';

export default function TimerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    timeRemaining,
    isRunning,
    sessionType,
    currentSession,
    stats,
    start,
    pause,
    reset,
    skip,
  } = useTimer();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/stats')}
        >
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SessionIndicator
          sessionType={sessionType}
          currentSession={currentSession}
        />

        <TimerDisplay
          timeRemaining={timeRemaining}
          sessionType={sessionType}
        />

        <TimerControls
          isRunning={isRunning}
          sessionType={sessionType}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSkip={skip}
        />

        <View style={styles.statsContainer}>
          <SessionCount count={stats.todaySessions} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  navText: {
    fontSize: fontSize.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statsContainer: {
    marginTop: spacing.xxl,
  },
});
