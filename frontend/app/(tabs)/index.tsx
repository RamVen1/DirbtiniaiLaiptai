import React from 'react';
import { View, Pressable, Image, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ModuleCard } from '@/components/dashboard/module-card';
import { useHomeScreen } from '@/hooks/use-home-screen';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';
import { usePulseAnimation } from '@/hooks/use-pulse-animation';

export default function HomeScreen() {
  const {
    router,
    isTablet,
    tint,
    avatarSource,
    user,
    hasReport,
    destination,
    label,
    icon,
  } = useHomeScreen();
  const { opacity: heroOpacity, translateY: heroTranslateY } = useEntranceAnimation();
  const heartScale = usePulseAnimation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => router.navigate('/profile')}
                className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden"
              >
                <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </Pressable>
              <Text className="text-lg font-black text-primary tracking-tighter">The Next Step</Text>
            </View>

            <Pressable onPress={() => router.navigate(destination as any)} className="p-2">
              <Ionicons name={icon as any} size={22} color={tint} />
            </Pressable>
          </View>
        </View>

        <Animated.ScrollView
          className="flex-1 bg-background pt-24 px-6 pb-28"
          showsVerticalScrollIndicator={false}
          style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] }}
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Improving your {user?.skill || 'Soft-Skills'}
            </Text>
            <Text className="text-foreground/80 font-medium mt-1">
              Click on the flame to start your next task.
            </Text>
          </View>

          <View className={isTablet ? 'flex-row gap-6' : 'flex-col gap-6'}>
            <View className={isTablet ? 'flex-1' : 'w-full'}>
              <View className="bg-primary rounded-3xl p-8 relative overflow-hidden">
                <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                <View className="relative z-10">
                  <Text className="text-white font-extrabold text-6xl mb-2">{user?.streak || 0} Days</Text>
                  <Text className="text-white/80 text-lg">Current daily streak</Text>

                  <Button className="mt-8 bg-background" onPress={() => router.navigate(destination as any)}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-primary font-extrabold text-base">{label}</Text>
                      <Ionicons name={icon as any} size={18} color={tint} />
                    </View>
                  </Button>
                </View>
              </View>
            </View>

            <View className={isTablet ? 'w-80' : 'w-full'}>
              <View className="bg-card rounded-3xl p-6 flex-1 items-center justify-center border border-border/20">
                <Animated.View
                  className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-4"
                  style={{ transform: [{ scale: heartScale }] }}
                >
                  <Ionicons name="heart" size={42} color={tint} />
                </Animated.View>
                <Text className="text-foreground font-bold text-xl mb-1">Bit, your Peer</Text>
                <Text className="text-foreground/80 text-sm italic text-center">
                  &quot;Your empathy logic is compiling perfectly!&quot;
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-2xl font-bold text-foreground mb-6">Current Improvement Course</Text>

            {hasReport ? (
              <Pressable onPress={() => router.push(`/MiniReport`)}>
                <ModuleCard
                  index=""
                  title={`View ${user?.skill || 'Soft-Skills'} report`}
                  completionLabel="COMPLETION"
                  completionValue={100}
                  barColor="primary"
                  icon="analytics"
                  iconColor={tint}
                />
              </Pressable>
            ) : (
              <View className="bg-card/40 border border-dashed border-border p-8 rounded-2xl items-center">
                <Ionicons name="hourglass-outline" size={32} color={tint} opacity={0.5} />
                <Text className="text-foreground/50 font-bold mt-2">Keep working to see your progress</Text>
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}