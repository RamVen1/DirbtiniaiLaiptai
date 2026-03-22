import { useEffect, useState } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
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
  
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        setHasToken(!!token);
      } catch (e) {
        setHasToken(false);
      } finally {
        setIsReady(true);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'LoginForm' || segments[0] === 'RegisterForm';

    if (!hasToken && !inAuthGroup) {
      router.replace('/LoginForm');
    } else if (hasToken && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [hasToken, segments, isReady]);

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