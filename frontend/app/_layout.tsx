import { useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { getItem, saveItem } from '@/utils/storage';
import { View, ActivityIndicator } from 'react-native';
import '../global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

const AuthContext = createContext<{
  hasToken: boolean;
  setHasToken: (val: boolean) => void;
  user: any | null;
  setUser: (val: any | null) => void;
  refreshUser: () => Promise<void>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function AuthGuard({ children, isReady }: { children: React.ReactNode, isReady: boolean }) {
  const { hasToken, refreshUser } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'LoginForm' || segments[0] === 'RegisterForm';

    if (!hasToken && !inAuthGroup) {
      router.replace('/LoginForm');
    } else if (hasToken) {
      refreshUser().catch(console.error);

      if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [hasToken, segments, isReady]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const refreshUser = async () => {
    const token = await getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const freshData = await response.json();
        
        const normalizedUser = {
          ...freshData,
          role: freshData.role || freshData.Role
        };

        setUser(normalizedUser);
        await saveItem('userData', JSON.stringify(normalizedUser));
        console.log("AUTH DEBUG - Duomenys sėkmingai atnaujinti");
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
  };

  useEffect(() => {
  async function initialize() {
    const token = await getItem('userToken');
    const userDataStr = await getItem('userData');
    
    setHasToken(!!token);

    if (userDataStr) {
      try {
        const parsedUser = JSON.parse(userDataStr);
        const normalizedUser = {
          ...parsedUser,
          role: parsedUser.Role || parsedUser.role
        };

        console.log("AUTH DEBUG - Vartotojo rolė:", parsedUser.username);
        setUser(normalizedUser);
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
    setIsReady(true);
  }
  initialize();
}, []);

  return (
    <AuthContext.Provider value={{hasToken, setHasToken, user, setUser, refreshUser}}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme]}>
          <AuthGuard isReady={isReady}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="LoginForm" />
              <Stack.Screen name="RegisterForm" />
              <Stack.Screen name="MiniReport" options={{ headerShown: true, title: 'Home' }} />
              <Stack.Screen name="AdminRequest" />
              <Stack.Screen name="ManageTeams" />
              <Stack.Screen name="join-group" />
            </Stack>
          </AuthGuard>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
          <PortalHost />
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}
