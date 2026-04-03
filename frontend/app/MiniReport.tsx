import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { InteractiveBarChart } from '@/components/dashboard/InteractiveBarChart';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMiniReport } from '@/hooks/use-mini-report';

export default function MiniReport() {
  const { avatarSource, loading, completedDaysCount, reportData } = useMiniReport();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#E11D48" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => router.navigate('/profile')} className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </Pressable>
              <Text className="text-lg font-black text-primary tracking-tighter">The Next Step</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 bg-background pt-24 px-6 pb-28" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <Text className="text-foreground/60 text-sm">Weekly Summary</Text>
            <Text className="text-3xl font-bold text-foreground mt-1">Activity Report</Text>
          </View>

          <View className="bg-primary rounded-3xl p-6 mb-6 flex-row justify-between items-center shadow-lg shadow-primary/20">
            <View>
              <Text className="text-white/80 font-bold uppercase tracking-wider text-xs">Weekly Consistency</Text>
              <Text className="text-white text-3xl font-black mt-1">{completedDaysCount}/7 Days</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-2xl">
              <Ionicons name="calendar" size={32} color="white" />
            </View>
          </View>

          <View className="bg-card/40 border border-border/20 rounded-[2rem] p-6 mb-6">
            <Text className="text-foreground text-lg font-bold mb-4">Course Progress</Text>
            <InteractiveBarChart data={reportData.chart_data} />
          </View>

          <View className="bg-card border border-border/20 rounded-2xl p-6 items-center">
            <Text className="text-foreground/60 text-xs uppercase tracking-widest font-bold">Total Practice</Text>
            <Text className="text-foreground font-black text-4xl mt-1">
              {reportData.total_practice_hours}h
            </Text>
          </View>

          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="mt-8 bg-primary w-full py-5 rounded-2xl items-center active:scale-[0.98]"
          >
            <Text className="text-white font-extrabold text-lg">Continue to Home</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}