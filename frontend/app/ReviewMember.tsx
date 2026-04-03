import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { useReviewMember } from '@/hooks/use-review-member';

export default function ReviewMemberScreen() {
  const { router, avatarSource, memberName, memberRole, memberEmail, tint, completedModules, activeModule, totalHours, avgScore } = useReviewMember();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">Member Review</Text>

            <View className="w-8" />
          </View>
        </View>

        <ScrollView className="flex-1 bg-background pt-24 px-6 pb-24" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <Text className="text-3xl font-bold tracking-tight text-foreground">Member Progress</Text>
          </View>

          <View className="bg-primary rounded-3xl p-6 mb-6 shadow-lg shadow-primary/20">
            <Text className="text-white/80 font-bold uppercase tracking-wider text-xs">Team Member</Text>

            <View className="mt-3 flex-row items-center gap-3">
              <View className="w-14 h-14 rounded-full border-2 border-white/70 overflow-hidden">
                <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
              <Text className="text-white text-2xl font-black">{memberName ?? 'Unknown Member'}</Text>
            </View>

            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="briefcase-outline" size={16} color="white" />
                <Text className="text-white/90">{memberRole ?? 'Role not provided'}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="mail-outline" size={16} color="white" />
                <Text className="text-white/90">{memberEmail ?? 'Email not provided'}</Text>
              </View>
            </View>
          </View>

          <View className="bg-card border border-border/20 rounded-3xl p-5 mb-6">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-foreground/60 text-xs uppercase font-bold tracking-widest">Active Module</Text>
                <Text className="text-foreground text-xl font-black mt-1">{activeModule.title}</Text>

              </View>
              <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/25">
                <Text className="text-primary text-xs font-bold">In Progress</Text>
              </View>
            </View>

            <View className="mt-4">
              <View className="h-2 rounded-full bg-muted overflow-hidden">
                <View className="h-full bg-primary" style={{ width: `${activeModule.progress}%` }} />
              </View>
              <Text className="text-foreground/70 text-xs mt-2">{activeModule.progress}% completed</Text>
            </View>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-card border border-border/20 rounded-2xl p-4">
              <Text className="text-foreground/60 text-xs uppercase font-bold tracking-widest">Done Modules</Text>
              <Text className="text-foreground text-3xl font-black mt-1">{completedModules.length}</Text>
            </View>
            <View className="flex-1 bg-card border border-border/20 rounded-2xl p-4">
              <Text className="text-foreground/60 text-xs uppercase font-bold tracking-widest">Avg Score</Text>
              <Text className="text-foreground text-3xl font-black mt-1">{avgScore}%</Text>
            </View>
          </View>

          <View className="bg-card border border-border/20 rounded-3xl p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground">Completed Modules</Text>
              <Text className="text-sm text-foreground/70">{totalHours.toFixed(1)}h total</Text>
            </View>

            <View className="gap-3">
              {completedModules.map((module) => (
                <View
                  key={module.id}
                  className="bg-card border border-border/20 rounded-2xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-foreground font-bold">{module.name}</Text>
                    <Text className="text-foreground/70 text-sm mt-1">Score {module.score}%</Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-foreground/70 text-xs mt-2">{module.hours.toFixed(1)}h</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
