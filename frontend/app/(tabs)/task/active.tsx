import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { NeonCard } from '@/components/dashboard/neon-card';
import { TaskActive } from '@/lib/task-active';

export default function TaskActiveScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  const handleDifficultyUpdate = async (adjustment: number) => {
    try {
      const token = await getItem('userToken');
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/update-difficulty?adjustment=${adjustment}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check if we should show the report based on backend logic
        if (data.show_report) {
          // Pass report_id if it exists (for previous week reports)
          if (data.report_id) {
            router.push(`/MiniReport?reportId=${data.report_id}`);
          } else {
            router.push('/MiniReport');
          }
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
      router.replace('/(tabs)');
    }
  };

  const handleTestData = async () => {
    try {
      const token = await getItem('userToken');
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/test-create-week-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Test data created:', data);
        // Navigate to MiniReport to see the test data
        router.push('/MiniReport');
      } else {
        console.error('Failed to create test data');
      }
    } catch (error) {
      console.error('Test data error:', error);
    }
  };

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
              className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-90"
              disabled={isSubmitting}
              onPress={() => handleDifficultyUpdate(-1)}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Too difficult
              </RNText>
            </Pressable>

            <Pressable
              className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-90"
              disabled={isSubmitting}
              onPress={() => handleDifficultyUpdate(0)}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Correct hardness
              </RNText>
            </Pressable>

            <Pressable
              className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-90"
              disabled={isSubmitting}
              onPress={() => handleDifficultyUpdate(1)}
            >
              <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                Too easy
              </RNText>
            </Pressable>

            {/* TEST BUTTON - Remove this after testing */}
            <Pressable
              className="w-full rounded-xl bg-orange-500 px-10 py-3 active:opacity-90 mt-4"
              onPress={handleTestData}
            >
              <RNText className="font-bold text-sm text-center" style={{ color: '#FFFFFF' }}>
                [TEST] Create Full Week Data
              </RNText>
            </Pressable>
          </View>
        </NeonCard>
      </View>
    </SafeAreaView>
  );
}