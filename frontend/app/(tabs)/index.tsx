import React from 'react';
import { ScrollView, View, Pressable, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ModuleCard } from '@/components/dashboard/module-card';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Fixed top app bar (similar to the provided HTML) */}
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => router.navigate('/profile')}
                className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary items-center justify-center overflow-hidden active:scale-95"
                accessibilityRole="button"
                accessibilityLabel="Open profile"
              >
                <Ionicons name="person" size={18} color={tint} />
              </Pressable>
              <Text className="text-lg font-black text-primary tracking-tighter">
                The Next Step
              </Text>
            </View>

            <Pressable
              onPress={() => router.navigate('/task')}
              className="p-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Open Daily Mission"
            >
              <Ionicons name="flame" size={22} color={tint} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-background pt-24 px-6 pb-28"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Take the next step to improving your soft-skills
            </Text>
            <Text className="text-foreground/80 font-medium mt-1">
              Your soft-skills architecture is evolving. Click on the flame to start your next task.
            </Text>
          </View>

          {/* Bento Grid: Hero + Companion */}
          <View className={isTablet ? 'flex-row gap-6' : 'flex-col gap-6'}>
            <View className={isTablet ? 'flex-1' : 'w-full'}>
              <View className="bg-primary rounded-3xl p-8 relative overflow-hidden shadow-sm">
                <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                <View className="absolute top-6 right-6 opacity-20">
                  <Ionicons name="sparkles" size={90} color="#fff" />
                </View>

                <View className="relative z-10">
                  <View className="flex-row items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                    <Ionicons name="sparkles" size={18} color="#fff" />
                    <Text className="text-white font-bold text-[10px] uppercase tracking-widest">
                      Momentum Active
                    </Text>
                  </View>

                  <Text className="text-white font-extrabold text-6xl mb-2">14 Days</Text>
                  <Text className="text-white/80 text-lg max-w-[320px]">
                    You're in the top 5% of engineers refining empathy this week.
                  </Text>

                  <Button
                    className="mt-8 bg-background border border-border/20"
                    onPress={() => router.navigate('/task')}
                  >
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-primary font-extrabold text-base">
                        Continue Daily Next Step
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color={tint} />
                    </View>
                  </Button>
                </View>
              </View>
            </View>

            <View className={isTablet ? 'w-80' : 'w-full'}>
              <View className="bg-card rounded-3xl p-6 flex-1 items-center justify-center text-center relative overflow-hidden border border-border/20">
                <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center mb-4 relative">
                  <View className="absolute inset-0 rounded-full bg-primary/10" />
                  <Ionicons name="heart" size={42} color={tint} />
                </View>

                <Text className="text-foreground font-bold text-xl mb-1">Bit, your Peer</Text>
                <Text className="text-foreground/80 text-sm mb-4 italic">
                  &quot;Your empathy logic is compiling perfectly!&quot;
                </Text>

                {/* Happiness bar (primary -> secondary look without requiring gradient support) */}
                <View className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <View className="flex-row h-full">
                    <View className="bg-primary" style={{ width: '65%' }} />
                    <View className="bg-secondary" style={{ width: '35%' }} />
                  </View>
                </View>
                <Text className="mt-2 text-[10px] uppercase font-bold text-primary tracking-tighter">
                  Happiness: 88%
                </Text>
              </View>
            </View>
          </View>

          {/* Active Modules */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-foreground">Current Improvement Course</Text>
            </View>

            <View className="flex-col gap-6">
              <ModuleCard
                index=""
                title="Active Listening"
                completionLabel="COMPLETION"
                completionValue={75}
                barColor="primary"
                icon="ear"
                iconColor={tint}
              />
            </View>
          </View>

          {/* Weekly Skill Matrix (Glass-ish card) */}
          <View className="mt-6 bg-card/40 border border-border/20 rounded-[2rem] p-8">
            <View className="flex-col items-center gap-6">
              {/* Graphs */}
              <View className="flex-row items-end gap-6">
                <View className="flex-col items-center gap-2">
                  <View className="w-12 h-32 bg-primary/20 rounded-full flex items-end p-1">
                    <View className="w-full h-[80%] bg-primary rounded-full" />
                  </View>
                  <Text className="text-[10px] font-bold text-foreground/60 uppercase">COM</Text>
                </View>

                <View className="flex-col items-center gap-2">
                  <View className="w-12 h-32 bg-secondary/20 rounded-full flex items-end p-1">
                    <View className="w-full h-[40%] bg-secondary rounded-full" />
                  </View>
                  <Text className="text-[10px] font-bold text-foreground/60 uppercase">LDR</Text>
                </View>

                <View className="flex-col items-center gap-2">
                  <View className="w-12 h-32 bg-accent/20 rounded-full flex items-end p-1">
                    <View className="w-full h-[60%] bg-accent rounded-full" />
                  </View>
                  <Text className="text-[10px] font-bold text-foreground/60 uppercase">PRO</Text>
                </View>
              </View>

              {/* Text under graphs */}
              <View className="w-full">
                <Text className="text-2xl font-bold text-foreground mb-2">Weekly Skill Matrix</Text>
                <Text className="text-foreground/80">
                  Your &quot;Communication&quot; node is growing faster than your
                  &quot;Leadership&quot; node. Try a technical mentorship module to balance the
                  graph.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
