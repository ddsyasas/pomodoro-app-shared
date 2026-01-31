import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/time';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../constants/theme';
import type { SessionType } from '../../types';

interface TimerDisplayProps {
  timeRemaining: number;
  sessionType: SessionType;
}

export function TimerDisplay({ timeRemaining, sessionType }: TimerDisplayProps) {
  const { sessionColors } = useTheme();
  const timerColor = sessionColors[sessionType];

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, { color: timerColor }]}>
        {formatTime(timeRemaining)}
      </Text>
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
