import React from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NeonCard } from '@/components/dashboard/neon-card';
import { SkillCard } from '@/components/dashboard/skill-card';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="px-6 py-4 border-b border-border/20 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <View className="flex-1 items-center justify-center">
              <Ionicons name="person" size={18} color={tint} />
            </View>
          </View>
          <Text className="text-lg font-black text-primary tracking-tighter">The Next Step</Text>
        </View>

        <Pressable
          onPress={() => router.navigate('/profile/modal')}
          className="p-2 rounded-full active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name={'settings' as any} size={20} color={tint} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-background px-6 pb-28" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="items-center mt-8 mb-10">
          <View className="relative mb-6">
            <View className="w-36 h-36 rounded-full p-1 bg-primary/20 items-center justify-center">
              <View className="w-full h-full rounded-full border-4 border-background items-center justify-center">
                <Ionicons name="person" size={72} color={tint} />
              </View>
            </View>
            <View className="absolute bottom-1 right-1 bg-primary px-2 py-0.5 rounded-full items-center justify-center">
              <Ionicons name={'checkmark-circle' as any} size={16} color="#fff" />
            </View>
          </View>

          <Text className="text-3xl font-bold tracking-tight text-foreground">Name Surname</Text>
          <Text className="text-muted-foreground font-medium tracking-wide uppercase text-xs mt-1">
            Senior Cloud Architect
          </Text>

          <View className="flex-row gap-3 mt-4">
            <Button className="flex-1 rounded-xl" onPress={() => {router.navigate('/join-group')}}>
              <Text className="text-white font-bold text-base">Join Team</Text>
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl" onPress={() => {router.navigate('/profile/modal')}}>
              <Text className="text-primary font-bold text-base">Profile Settings</Text>
            </Button>
          </View>
        </View>

        {/* Skill Matrix */}
        <View className="mb-12">
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-8 h-[2px] bg-primary" />
            <Text className="text-xl font-bold">Skill Matrix</Text>
          </View>

          <View className={isTablet ? 'flex-row gap-6' : 'flex-col gap-6'}>
            <View className={isTablet ? 'flex-1' : undefined}>
              <SkillCard value={90} label="Communication" subtitle="Expert Level" color={tint} />
            </View>
            <View className={isTablet ? 'flex-1' : undefined}>
              <SkillCard
                value={75}
                label="Leadership"
                subtitle="Advanced Level"
                color={'#9720ab'}
              />
            </View>
            <View className={isTablet ? 'flex-1' : undefined}>
              <SkillCard value={82} label="Empathy" subtitle="Fluent Level" color={'#6e5275'} />
            </View>
          </View>
        </View>

        {/* Achievements & Certificates */}
        <View className="flex-col gap-8 mb-12">
          <NeonCard className="p-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-foreground">Achievement Badges</Text>
              <Pressable onPress={() => {}} accessibilityRole="button">
                <Text className="text-primary font-bold text-sm">View All</Text>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-4 gap-x-0">
              <NeonCard className="w-16 h-16 rounded-full items-center justify-center border border-white/20 bg-card">
                <Ionicons name={'ribbon' as any} size={28} color={tint} />
              </NeonCard>
              <NeonCard className="w-16 h-16 rounded-full items-center justify-center border border-white/20 bg-card">
                <Ionicons name={'heart' as any} size={28} color={tint} />
              </NeonCard>
              <NeonCard className="w-16 h-16 rounded-full items-center justify-center border border-white/20 bg-card">
                <Ionicons name={'people' as any} size={28} color={'#9720ab'} />
              </NeonCard>
              <NeonCard className="w-16 h-16 rounded-full items-center justify-center border border-white/20 bg-card">
                <Ionicons name={'rocket' as any} size={28} color={'#6e5275'} />
              </NeonCard>
            </View>
          </NeonCard>

          <NeonCard className="p-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-foreground">Certificates</Text>
              <Ionicons name={'card' as any} size={18} color={Colors.light.icon} />
            </View>

            <View className="gap-4">
              <Pressable onPress={() => {}} className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-card rounded-xl items-center justify-center">
                  <Ionicons name={'cloud-done' as any} size={20} color={tint} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-sm">Professional Cloud Architect</Text>
                  <Text className="text-[12px] text-muted-foreground">
                    Issued by Google Cloud • 2023
                  </Text>
                </View>
                <Ionicons name={'chevron-forward' as any} size={18} color={tint} />
              </Pressable>

              <Pressable onPress={() => {}} className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-card rounded-xl items-center justify-center">
                  <Ionicons name={'document-text' as any} size={20} color={tint} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-sm">Negotiation &amp; Persuasion</Text>
                  <Text className="text-[12px] text-muted-foreground">
                    Atelier Soft Skills • 2024
                  </Text>
                </View>
                <Ionicons name={'chevron-forward' as any} size={18} color={tint} />
              </Pressable>
            </View>
          </NeonCard>
        </View>

        {/* Navigation Links */}
        <View className="mb-12">
          <Pressable
            onPress={() => {}}
            className="flex-row items-center justify-between p-5 bg-card rounded-2xl mb-2"
          >
            <View className="flex-row items-center gap-4">
              <Ionicons name={'time' as any} size={18} color={tint} />
              <Text className="font-semibold">Learning History</Text>
            </View>
            <Ionicons name={'chevron-forward' as any} size={18} color={tint} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
