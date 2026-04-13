import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { useThemePalette } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/theme";
import { AuthProvider, AuthGuard } from "@/hooks/use-auth";

export default function RootLayout() {
  const { theme } = useThemePalette();

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme]}>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="LoginForm" />
              <Stack.Screen name="RegisterForm" />
              <Stack.Screen
                name="MiniReport"
                options={{ headerShown: true, title: "Home" }}
              />
              <Stack.Screen name="AdminRequest" />
              <Stack.Screen name="ManageTeams" />
              <Stack.Screen name="join-group" />
            </Stack>
          </AuthGuard>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <PortalHost />
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
