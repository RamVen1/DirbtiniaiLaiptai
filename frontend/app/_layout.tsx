import { useEffect, useState } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';

import '../global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';
import { getItem } from '@/utils/storage';

function AuthGuard({ children, isReady, hasToken }: { children: React.ReactNode, isReady: boolean, hasToken: boolean }) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'LoginForm' || segments[0] === 'RegisterForm';

    // Redirect logic
    if (!hasToken && !inAuthGroup) {
      router.replace('/LoginForm');
    } else if (hasToken && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [hasToken, segments, isReady]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    async function initialize() {
      const token = await getItem('userToken');
      setHasToken(!!token);
      setIsReady(true);
    }
    initialize();
  }, [segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NAV_THEME[theme].colors.background }}>
        <ActivityIndicator size="large" color={NAV_THEME[theme].colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[theme]}>
        <AuthGuard isReady={isReady} hasToken={hasToken}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="LoginForm" />
            <Stack.Screen name="RegisterForm" />
            <Stack.Screen name="MiniReport" options={{ headerShown: true, title: 'Home' }} />
          </Stack>
        </AuthGuard>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}