import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text as RNText,
  View,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useElapsedSeconds } from '@/hooks/use-elapsed-seconds';
import { useDailyTask } from '@/hooks/use-daily-task';
import { formatElapsed } from '@/lib/format-elapsed';

export default function TaskDailyScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  const { dailyTask, loadingDailyTask, dailyTaskError } = useDailyTask();

  // Timer should only run while this screen is focused and we already have the daily task.
  const { elapsedSeconds } = useElapsedSeconds({ autoStart: Boolean(dailyTask) });

  const progressPct = 75;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LessonTopBar
        title="Today's Task"
        tintColor={tint}
        onFlamePress={() => router.navigate('/task/description')}
        onAvatarPress={() => router.navigate('/profile')}
      />

      <ScrollView className="flex-1 bg-background px-0 pb-28" showsVerticalScrollIndicator={false}>
        <View className="px-6 max-w-[520px] self-center w-full">
          <View className="mb-8">
            <NeonCard className="p-6 shadow-sm" overflowHidden={false}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-3xl font-extrabold text-foreground">Daily Task</Text>
                <View className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 items-center justify-center">
                  <Ionicons name="chatbubble-ellipses" size={18} color={tint} />
                </View>
              </View>

              {loadingDailyTask && (
                <View className="py-6 items-center justify-center">
                  <ActivityIndicator size="small" color={tint} />
                </View>
              )}

              {!loadingDailyTask && dailyTaskError && (
                <Text className="text-muted-foreground text-sm">{dailyTaskError}</Text>
              )}

              {!loadingDailyTask && !dailyTaskError && dailyTask && (
                <Text className="text-foreground/80 text-1xl font-bold">{dailyTask}</Text>
              )}

              {!loadingDailyTask && !dailyTaskError && !dailyTask && (
                <Text className="text-muted-foreground text-sm">
                  No task found. Try again later.
                </Text>
              )}
            </NeonCard>
          </View>

          <View className={isTablet ? 'flex-row gap-8' : 'flex-col gap-6'}>
            <NeonCard className="p-10 flex-1" overflowHidden={false}>
              <Text className="text-2xl font-bold text-foreground mb-2">Complete the task</Text>
              <View className="mt-4">
                <Text className="mb-3 text-muted-foreground text-sm font-bold">
                  Time: {formatElapsed(elapsedSeconds)}
                </Text>
                <View className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
                  <View className="flex-row h-full">
                    <View className="bg-primary" style={{ flex: progressPct, flexBasis: 0 }} />
                    <View
                      className="bg-secondary"
                      style={{ flex: 100 - progressPct, flexBasis: 0 }}
                    />
                  </View>
                </View>

                <View className="w-full items-center">
                  <Pressable
                    disabled={!dailyTask || loadingDailyTask}
                    className={`w-full rounded-xl px-10 py-5 ${!dailyTask || loadingDailyTask ? 'bg-primary/40' : 'bg-primary'}`}
                    onPress={() => {
                      if (!dailyTask) return;
                      router.navigate('/task/active');
                    }}
                  >
                    <RNText
                      className="font-extrabold text-lg text-center"
                      style={{ color: '#FFFFFF' }}
                    >
                      {loadingDailyTask ? 'Loading...' : 'Complete task'}
                    </RNText>
                  </Pressable>
                </View>
              </View>
            </NeonCard>

            <View className="flex-1">
              <NeonCard className="p-10" overflowHidden={false}>
                <Text className="text-xl font-bold text-foreground mb-3">What to do</Text>
                <Text className="text-muted-foreground text-sm leading-5">
                  Read the task, stay with the pause, and respond with empathy. When you are done,
                  mark it completed.
                </Text>
              </NeonCard>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
