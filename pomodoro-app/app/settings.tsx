import React from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../src/components/ui/Card';
import { useTimerStore } from '../src/stores/timerStore';
import { useTheme } from '../src/hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../src/constants/theme';
import { formatMinutes } from '../src/utils/time';

const DURATION_OPTIONS = {
  focus: [15, 20, 25, 30, 45, 60],
  shortBreak: [3, 5, 10],
  longBreak: [10, 15, 20, 30],
};

export default function SettingsScreen() {
  const settings = useTimerStore((state) => state.settings);
  const updateSettings = useTimerStore((state) => state.updateSettings);
  const { colors, mode, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Appearance
        </Text>

        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Dark Mode
            </Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.focus }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Timer Durations */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.textPrimary }]}>
          Timer Durations
        </Text>

        <Card style={styles.card}>
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            Focus Duration
          </Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.focus.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                  settings.focusDuration === duration && {
                    backgroundColor: colors.focus,
                    borderColor: colors.focus,
                  },
                ]}
                onPress={() => updateSettings({ focusDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
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
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            Short Break
          </Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.shortBreak.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                  settings.shortBreakDuration === duration && {
                    backgroundColor: colors.focus,
                    borderColor: colors.focus,
                  },
                ]}
                onPress={() => updateSettings({ shortBreakDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
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
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            Long Break
          </Text>
          <View style={styles.optionsRow}>
            {DURATION_OPTIONS.longBreak.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                  settings.longBreakDuration === duration && {
                    backgroundColor: colors.focus,
                    borderColor: colors.focus,
                  },
                ]}
                onPress={() => updateSettings({ longBreakDuration: duration })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
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
        <Text style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.textPrimary }]}>
          Notifications
        </Text>

        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Sound
            </Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: colors.border, true: colors.focus }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Vibration
            </Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
              trackColor={{ false: colors.border, true: colors.focus }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
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
    borderWidth: 1,
  },
  optionText: {
    fontSize: fontSize.sm,
  },
  optionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
