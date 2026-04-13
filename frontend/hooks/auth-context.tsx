import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import { getItem, saveItem } from "../utils/storage";

type AuthContextValue = {
  isReady: boolean;
  hasToken: boolean;
  setHasToken: (val: boolean) => void;
  user: any | null;
  setUser: (val: any | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = useCallback(async () => {
    const token = await getItem("userToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const freshData = await response.json();

        const normalizedUser = {
          ...freshData,
          role: freshData.role || freshData.Role,
        };

        setUser(normalizedUser);
        await saveItem("userData", JSON.stringify(normalizedUser));
        console.log("AUTH DEBUG - Duomenys sėkmingai atnaujinti");
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      const token = await getItem("userToken");
      const userDataStr = await getItem("userData");

      setHasToken(!!token);

      if (userDataStr) {
        try {
          const parsedUser = JSON.parse(userDataStr);
          const normalizedUser = {
            ...parsedUser,
            role: parsedUser.Role || parsedUser.role,
          };

          console.log("AUTH DEBUG - Vartotojo rolė:", parsedUser.username);
          setUser(normalizedUser);
        } catch (e) {
          console.error("Failed to parse userData", e);
        }
      }
      setIsReady(true);
    }
    void initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        hasToken,
        setHasToken,
        user,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { hasToken, refreshUser, isReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup =
      segments[0] === "LoginForm" || segments[0] === "RegisterForm";

    if (!hasToken && !inAuthGroup) {
      router.replace("/LoginForm");
    } else if (hasToken) {
      void refreshUser().catch(console.error);

      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [hasToken, segments, isReady, router, refreshUser]);

  return <>{children}</>;
}
