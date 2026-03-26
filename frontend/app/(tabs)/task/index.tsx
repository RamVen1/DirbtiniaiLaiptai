import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { NeonCard } from '@/components/dashboard/neon-card';

export default function TaskIntroScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LessonTopBar
        title="The Next Step"
        tintColor={tint}
        onFlamePress={() => router.navigate('/task')}
        onAvatarPress={() => router.navigate('/profile')}
      />

      <View className="flex-1 items-center justify-center px-6 pb-28">
        <NeonCard className="w-full p-8 items-center shadow-sm" overflowHidden={false}>
          <Text className="text-2xl font-extrabold text-foreground text-center mb-3">
            Ready for the lesson?
          </Text>
          <Text className="text-muted-foreground text-base text-center mb-6">
            Tap to start your next task and take the next step in improving your skills. Remember, consistency is key to growth!
          </Text>

          <Pressable
            onPress={() => router.navigate('/task/daily')}
            className="w-full rounded-xl bg-primary px-10 py-5"
          >
            <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
              Start Your Task
            </RNText>
          </Pressable>
        </NeonCard>
      </View>
    </SafeAreaView>
  );
}
