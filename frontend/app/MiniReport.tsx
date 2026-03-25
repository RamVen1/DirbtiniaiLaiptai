import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

import { router } from 'expo-router';
import { InteractiveBarChart } from '@/components/dashboard/InteractiveBarChart';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MiniReport() {
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  return (
    <SafeAreaView className="flex-1 bg-background">
  

        {/* Top bar */}
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
                <Image
                  source={avatarSource}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 999, // 🔑 important for web
                  }}
                  resizeMode="cover"
                />

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
              <Ionicons name="flame" size={22} className="text-primary"  />
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-background pt-24 px-6 pb-28"
          showsVerticalScrollIndicator={false}
        >

          {/* Header */}
          <View className="mb-6">
            <Text className="text-foreground/60 text-sm">
              March 16 - March 22
            </Text>

            <View className="flex-row justify-between items-end mt-1">
              <Text className="text-3xl font-bold text-foreground">
                Active Listening
              </Text>

              <View className="px-3 py-1 rounded-full bg-primary/20">
                <Text className="text-primary text-xs font-bold">
                  +12%
                </Text>
              </View>
            </View>
          </View>

          {/* Streak Card (Hero style like HomeScreen) */}
          <View className="bg-primary rounded-3xl p-6 mb-6 relative overflow-hidden">
            <View className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-secondary/30" />

            <Text className="text-white text-2xl font-bold">
              7 Day Streak!
            </Text>
            <Text className="text-white/80 text-sm mt-1">
              Top 5% this week
            </Text>
          </View>

          {/* Progress Card (Glass style) */}
          <View className="bg-card/40 border border-border/20 rounded-[2rem] p-6 mb-6">
            <Text className="text-foreground text-lg font-bold mb-4">
              Course Progress
            </Text>

            <InteractiveBarChart />
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-card border border-border/20 rounded-2xl p-4 items-center">
              <Text className="text-foreground/60 text-xs">
                Practice
              </Text>
              <Text className="text-foreground font-bold text-lg mt-1">
                4.2h
              </Text>
            </View>

            <View className="flex-1 bg-card border border-border/20 rounded-2xl p-4 items-center">
              <Text className="text-foreground/60 text-xs">
                Modules
              </Text>
              <Text className="text-foreground font-bold text-lg mt-1">
                3
              </Text>
            </View>
          </View>

          {/* Insights */}
          <View>
            <Text className="text-2xl font-bold text-foreground mb-4">
              Insights
            </Text>

            <View className="bg-card border border-border/20 rounded-2xl p-4 mb-3">
              <Text className="text-foreground font-bold">
                Consistency
              </Text>
              <Text className="text-foreground/70 text-sm">
                You practiced 5/7 days
              </Text>
            </View>

            <View className="bg-card border border-border/20 rounded-2xl p-4">
              <Text className="text-foreground font-bold">
                Next Goal
              </Text>
              <Text className="text-foreground/70 text-sm">
                Finish empathy module
              </Text>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
