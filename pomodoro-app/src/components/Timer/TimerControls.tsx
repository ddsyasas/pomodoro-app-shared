import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { sessionColors, spacing } from '../../constants/theme';
import type { SessionType } from '../../types';

interface TimerControlsProps {
  isRunning: boolean;
  sessionType: SessionType;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  sessionType,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const primaryColor = sessionColors[sessionType];

  return (
    <View style={styles.container}>
      <Button
        title="Reset"
        onPress={onReset}
        variant="secondary"
        size="md"
      />
      <Button
        title={isRunning ? 'Pause' : 'Start'}
        onPress={isRunning ? onPause : onStart}
        variant="primary"
        size="lg"
        color={primaryColor}
      />
      <Button
        title="Skip"
        onPress={onSkip}
        variant="secondary"
        size="md"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
});
