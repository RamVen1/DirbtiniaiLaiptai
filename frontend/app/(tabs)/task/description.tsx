import React from 'react';
import { Pressable, ScrollView, Text as RNText, View, useWindowDimensions } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { LessonTopBar } from '@/components/dashboard/lesson-top-bar';
import { useThemePalette } from '@/hooks/use-color-scheme';

export default function TaskDescriptionScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const { tint } = useThemePalette();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LessonTopBar
        title="The Next Step"
        tintColor={tint}
        onFlamePress={() => router.navigate('/task')}
        onAvatarPress={() => router.navigate('/profile')}
      />

      <ScrollView className="flex-1 bg-background px-0 pb-28" showsVerticalScrollIndicator={false}>
        <View className="px-6 max-w-[420px] self-center w-full">
          {/* Title Section */}
          <View className="items-center gap-2">
            <Text className="text-[42px] leading-[44px] font-extrabold tracking-tight text-foreground mb-0">
              The Art of the
            </Text>
            <Text className="text-primary italic text-[56px] leading-[62px] font-extrabold tracking-tight mb-12">
              Pause
            </Text>
          </View>

          {/* Content Layout: Asymmetric Bento Style */}
          <View className={isTablet ? 'flex-row gap-8' : 'flex-col gap-8'}>
            {/* Key Tip Card */}
            <View className={isTablet ? 'flex-[7]' : 'w-full bg-card rounded-[2rem]'}>
              <NeonCard className="shadow-sm p-8 relative" overflowHidden={false}>
                <View className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full" />

                <View className="relative z-10">
                  <Ionicons
                    name={'chatbubble-ellipses'}
                    size={26}
                    color={tint}
                    style={{ marginBottom: 24 }}
                  />

                  <Text className="text-xl font-medium leading-relaxed text-foreground">
                    In high-stakes meetings, the most powerful word is often{' '}
                    <Text className="text-primary font-bold underline underline-offset-4">
                      silence
                    </Text>
                    . A three-second pause after someone finishes speaking signals respect, creates
                    space for clarification, and prevents reactive interruptions.
                  </Text>
                </View>
              </NeonCard>
            </View>

            {/* Purple Illustrative Graphic */}
          </View>

          {/* Detailed Content / Narrative */}
          <NeonCard className="mt-4 p-10" overflowHidden={false}>
            <Text className="text-2xl font-bold text-foreground mb-6">Why it works</Text>

            <View className={isTablet ? 'flex-row gap-10' : 'flex-col gap-10'}>
              <View className="flex-row gap-4 flex-1">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
                  <Ionicons name={'person'} size={18} color={tint} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground mb-2">Cognitive Load</Text>
                  <Text className="text-sm text-muted-foreground">
                    The pause allows your prefrontal cortex to process the emotional nuance behind
                    the literal words spoken.
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4 flex-1">
                <View className="w-10 h-10 rounded-xl bg-secondary/10 items-center justify-center shrink-0">
                  <Ionicons name={'chatbubble'} size={18} color={'#9720ab'} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground mb-2">Social Safety</Text>
                  <Text className="text-sm text-muted-foreground">
                    Silence creates a non-threatening environment where colleagues feel safe to
                    expand on complex ideas.
                  </Text>
                </View>
              </View>
            </View>
          </NeonCard>

          {/* CTA: go to the daily task window */}
          <View className="mt-16 flex-col items-center">
            <Text className="text-muted-foreground text-sm font-bold text-center mb-4">
              Read the intro above, then load today&apos;s daily task.
            </Text>

            <View className="w-full items-center">
              <Pressable
                className="w-full rounded-xl bg-primary px-10 py-5 active:opacity-90"
                onPress={() => router.navigate('/task/daily')}
              >
                <RNText className="font-extrabold text-lg text-center" style={{ color: '#FFFFFF' }}>
                  Load daily task
                </RNText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
