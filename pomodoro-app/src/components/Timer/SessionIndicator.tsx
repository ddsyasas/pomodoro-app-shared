import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSessionLabel } from '../../utils/time';
import { sessionColors, colors, fontSize, spacing } from '../../constants/theme';
import { SESSIONS_BEFORE_LONG_BREAK } from '../../constants/config';
import type { SessionType } from '../../types';

interface SessionIndicatorProps {
  sessionType: SessionType;
  currentSession: number;
}

export function SessionIndicator({
  sessionType,
  currentSession,
}: SessionIndicatorProps) {
  const sessionColor = sessionColors[sessionType];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: sessionColor }]}>
        {getSessionLabel(sessionType)}
      </Text>
      <View style={styles.dotsContainer}>
        {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index < currentSession ? sessionColor : colors.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
