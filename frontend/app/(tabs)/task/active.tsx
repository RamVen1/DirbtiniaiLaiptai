import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { NeonCard } from '@/components/dashboard/neon-card';

export default function TaskActiveScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LessonTopBar
        title="The Next Step"
        tintColor={tint}
        onFlamePress={() => router.navigate('/task/daily')}
        onAvatarPress={() => router.navigate('/profile')}
      />

      <View className="flex-1 items-center justify-center px-6 pb-28">
        <NeonCard className="w-full p-8 items-center shadow-sm" overflowHidden={false}>
          <Text className="text-2xl font-extrabold text-foreground text-center mb-2">
            How was the task?
          </Text>
          <Text className="text-muted-foreground text-base text-center mb-6">
            Choose the option that fits best.
          </Text>

          <View className="w-full gap-3">
            <Pressable
              className="w-full rounded-xl bg-primary px-10 py-5"
              onPress={() => router.navigate('/MiniReport')}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Too difficult
              </RNText>
            </Pressable>

            <Pressable
              className="w-full rounded-xl bg-primary px-10 py-5"
              onPress={() => router.navigate('/MiniReport')}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Too easy
              </RNText>
            </Pressable>

            <Pressable
              className="w-full rounded-xl bg-primary px-10 py-5"
              onPress={() => router.navigate('/MiniReport')}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Correct hardness
              </RNText>
            </Pressable>
          </View>
        </NeonCard>
      </View>
    </SafeAreaView>
  );
}
