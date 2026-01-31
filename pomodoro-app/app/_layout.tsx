import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Pomodoro Timer',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="stats"
          options={{
            title: 'Statistics',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
