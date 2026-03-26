import React, { useState } from 'react';
import { Pressable, View, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { deleteItem, getItem } from '@/utils/storage';
import { useAuth } from '@/app/_layout';

export default function ProfileModalScreen() {
  const { setHasToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleLogout = async () => {
    await deleteItem('userToken');
    await deleteItem('userData');
    setHasToken(false);
  };

  const handleApplyModerator = async () => {
    setLoading(true);
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/admin/request-moderator`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Success", "Request submitted! An admin will review it.");
      } else {
        Alert.alert("Notice", data.detail || "You already have a pending request.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    setLoading(true);
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/group/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "You have left the group.");
        router.replace('/profile');
      } else {
        Alert.alert("Error", data.detail || "Failed to leave the group.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <NeonCard className="w-full p-6 shadow-sm" overflowHidden={false}>
        <Text className="text-2xl font-extrabold text-foreground mb-4" style={{ textAlign: 'center' }}>
          Account
        </Text>
        <Text className="text-muted-foreground mb-6" style={{ textAlign: 'center' }}>
          Choose what you want to do.
        </Text>

        <View className="gap-3">
          {user?.role?.toLowerCase() === 'member' && (
            <Pressable
              onPress={handleApplyModerator}
            disabled={loading}
              className="w-full rounded-xl bg-secondary px-10 py-5 border border-primary/30 active:opacity-80"
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-primary font-extrabold text-lg text-center">Become Moderator</Text>
              )}
            </Pressable>
          )}

          {user?.team_id ? (
            <Pressable
              onPress={handleLeaveGroup}
              disabled={loading}
              className="w-full rounded-xl bg-destructive/10 border border-destructive/20 px-10 py-5 active:bg-destructive/20"
              accessibilityRole="button"
            >
              <Text className="text-destructive font-extrabold text-lg text-center">
                Leave group
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.replace('/join-group')}
              className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-80"
              accessibilityRole="button"
            >
              <Text className="text-foreground font-extrabold text-lg text-center">Join group</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => router.navigate('/profile/edit')}
            className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-80"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">
              Edit profile
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-80"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">Logout</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/profile')}
            className="w-full rounded-xl border border-border bg-background px-10 py-4 active:bg-muted"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">Close</Text>
          </Pressable>
        </View>
      </NeonCard>
    </View>
  );
}