import { Tabs, router } from 'expo-router';  // ← import router here
import React, { useEffect } from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../_layout';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const { user } = useAuth();

  useEffect(() => {
    console.log("TAB LAYOUT DEBUG:", user?.team_id);
  }, [user]);

  const getMiddleTabConfig = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'admin') return { title: 'Requests', icon: 'shield-checkmark' };
    if (role === 'moderator') return { title: 'Manage', icon: 'people' };
    if (role === 'member' && !user?.team_id) return { title: 'Join', icon: 'add-circle' };
    return { title: 'Task', icon: 'flame' };
  };

  const config = getMiddleTabConfig();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
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