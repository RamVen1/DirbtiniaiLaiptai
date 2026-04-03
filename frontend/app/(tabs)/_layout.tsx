import { Tabs, router } from 'expo-router';  // ← import router here
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemePalette } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/hooks/use-auth';
import { useTabLayoutDebug } from '@/hooks/use-tab-layout-debug';
import { getMiddleTabConfig } from '@/lib/middle-tab-config';

export default function TabLayout() {
  const { tint, background } = useThemePalette();
  const { user } = useAuth();

  useTabLayoutDebug(user);
  const config = getMiddleTabConfig(user);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: background,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="task"
        options={{
          title: config.title,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name={config.icon as any} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            const role = user?.role?.toLowerCase();

            if (role === 'admin') {
              e.preventDefault();
              router.push('/AdminRequest');
            } else if (role === 'moderator') {
              e.preventDefault();
              router.push('/ManageTeams');
            } else if (role === 'member' && !user?.team_id) {
              e.preventDefault();
              router.push('/join-group');
            }
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}