import React from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../src/components/ui/Card';
import { useTimerStore } from '../src/stores/timerStore';
import { colors, spacing, fontSize, borderRadius } from '../src/constants/theme';
import { formatMinutes } from '../src/utils/time';

const DURATION_OPTIONS = {
  focus: [15, 20, 25, 30, 45, 60],
  shortBreak: [3, 5, 10],
  longBreak: [10, 15, 20, 30],
};

export default function SettingsScreen() {
  const settings = useTimerStore((state) => state.settings);
  const updateSettings = useTimerStore((state) => state.updateSettings);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Timer Durations */}
        <Text style={styles.sectionTitle}>Timer Durations</Text>

        <Card style={styles.card}>
          <Text style={styles.settingLabel}>Focus Duration</Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.focus.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  settings.focusDuration === duration && styles.optionButtonActive,
                ]}
                onPress={() => updateSettings({ focusDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.focusDuration === duration && styles.optionTextActive,
                  ]}
                >
                  {formatMinutes(duration)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.settingLabel}>Short Break</Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.shortBreak.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  settings.shortBreakDuration === duration && styles.optionButtonActive,
                ]}
                onPress={() => updateSettings({ shortBreakDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.shortBreakDuration === duration && styles.optionTextActive,
                  ]}
                >
                  {formatMinutes(duration)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.settingLabel}>Long Break</Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.longBreak.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  settings.longBreakDuration === duration && styles.optionButtonActive,
                ]}
                onPress={() => updateSettings({ longBreakDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.longBreakDuration === duration && styles.optionTextActive,
                  ]}
                >
                  {formatMinutes(duration)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Notifications</Text>

        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: colors.border, true: colors.focus }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
              trackColor={{ false: colors.border, true: colors.focus }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionSpacing: {
    marginTop: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  optionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonActive: {
    backgroundColor: colors.focus,
    borderColor: colors.focus,
  },
  optionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
