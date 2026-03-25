import { useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { getItem } from '@/utils/storage';
import '../global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

const AuthContext = createContext<{
  hasToken: boolean;
  setHasToken: (val: boolean) => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function AuthGuard({ children, isReady }: { children: React.ReactNode, isReady: boolean }) {
  const { hasToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'LoginForm' || segments[0] === 'RegisterForm';

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

  useEffect(() => {
    async function initialize() {
      const token = await getItem('userToken');
      setHasToken(!!token);
      setIsReady(true);
    }
    initialize();
  }, []);

  return (
    <AuthContext.Provider value={{ hasToken, setHasToken }}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme]}>
          <AuthGuard isReady={isReady}>
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
    </AuthContext.Provider>
  );
}
