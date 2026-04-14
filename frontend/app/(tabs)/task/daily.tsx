import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text as RNText,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { ConfettiBurst } from '@/components/animations/confetti-burst';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useDailyTask } from '@/hooks/use-daily-task';
import { formatElapsed } from '@/lib/format-elapsed';

export default function TaskDailyScreen() {
  const { tint } = useThemePalette();
  const {
    dailyTask,
    loadingDailyTask,
    dailyTaskError,
    elapsedSeconds,
    showConfetti,
    isCompleting,
    handleDonePress,
  } = useDailyTask();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LessonTopBar
        title="Today's Task"
        tintColor={tint}
        onFlamePress={() => router.navigate('/task/description')}
        onAvatarPress={() => router.navigate('/profile')}
      />

      <ScrollView className="flex-1 bg-background px-0 pb-28" showsVerticalScrollIndicator={false}>
        <View className="px-6 max-w-[520px] self-center w-full gap-6">

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
              <Text className="text-foreground/80 text-xl font-bold">{dailyTask}</Text>
            )}
          </NeonCard>

          <NeonCard className="p-10 w-full" overflowHidden={false}>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground mb-2">Complete the task</Text>

              <View className="mt-4 w-full items-center">
                <Text className="mb-6 text-primary text-4xl font-black tracking-widest">
                  {formatElapsed(elapsedSeconds)}
                </Text>

                <Pressable
                  disabled={!dailyTask || loadingDailyTask || isCompleting}
                  className={`w-full rounded-2xl px-10 py-5 shadow-lg active:scale-95 ${!dailyTask || loadingDailyTask || isCompleting ? 'bg-primary/40' : 'bg-primary'
                    }`}
                  onPress={handleDonePress}
                >
                  <RNText
                    className="font-extrabold text-xl text-center"
                    style={{ color: '#FFFFFF' }}
                  >
                    {loadingDailyTask ? 'Loading...' : isCompleting ? 'Great work...' : 'Mark as Done'}
                  </RNText>
                </Pressable>
              </View>
            </View>
          </NeonCard>
        </View>
      </ScrollView>
      <ConfettiBurst visible={showConfetti} />
    </SafeAreaView>
  );
}