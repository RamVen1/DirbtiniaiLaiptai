import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { deleteItem } from '@/utils/storage';
import { useAuth } from '@/app/_layout';

export default function ProfileModalScreen() {
  const { setHasToken } = useAuth();

  const handleLogout = async () => {
    await deleteItem('userToken');
    await deleteItem('userData');
    setHasToken(false);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <NeonCard className="w-full p-6 shadow-sm" overflowHidden={false}>
        <Text
          className="text-2xl font-extrabold text-foreground mb-4"
          style={{ textAlign: 'center' }}
        >
          Account
        </Text>
        <Text className="text-muted-foreground mb-6" style={{ textAlign: 'center' }}>
          Choose what you want to do.
        </Text>

        <View className="gap-3">
          <Pressable
            onPress={() => router.replace('/join-group')}
            className="w-full rounded-xl bg-primary px-10 py-5"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">Leave group</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="w-full rounded-xl bg-primary px-10 py-5"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">Logout</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/profile/edit')}
            className="w-full rounded-xl bg-primary px-10 py-5"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">
              Edit profile
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="w-full rounded-xl border border-border bg-background px-10 py-4"
            accessibilityRole="button"
          >
            <Text className="text-foreground font-extrabold text-lg text-center">Close</Text>
          </Pressable>
        </View>
      </NeonCard>
    </View>
  );
}