import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/time';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../constants/theme';
import { CircularProgress } from './CircularProgress';
import type { SessionType } from '../../types';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  sessionType: SessionType;
}

export function TimerDisplay({ timeRemaining, totalTime, sessionType }: TimerDisplayProps) {
  const { sessionColors } = useTheme();
  const timerColor = sessionColors[sessionType];
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;

  return (
    <View style={styles.container}>
      <CircularProgress
        progress={progress}
        size={280}
        strokeWidth={8}
        color={timerColor}
      >
        <Text style={[styles.timer, { color: timerColor }]}>
          {formatTime(timeRemaining)}
        </Text>
      </CircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  timer: {
    fontSize: fontSize.timer,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
});

