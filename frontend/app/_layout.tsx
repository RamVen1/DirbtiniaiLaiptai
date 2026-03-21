import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[theme]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="join-group" options={{ headerShown: false }} />
          <Stack.Screen name="LoginForm" options={{ headerShown: false }} />
          <Stack.Screen name="RegisterForm" options={{ headerShown: false }} />
          <Stack.Screen name="MiniReport" options={{ headerShown: true, title: 'Home' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
