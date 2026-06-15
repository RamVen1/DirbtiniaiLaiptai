import React from 'react';
import { View, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { useReviewMember } from '@/hooks/use-review-member';

export default function ReviewMemberScreen() {
  const { router, avatarSource, memberName, memberRole, memberEmail, tint, loading, completedModules, activeModule, totalHours, avgScore, reports, handleViewReport } = useReviewMember();

  if (loading) return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <ActivityIndicator color={tint} size="large" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2"><Ionicons name="chevron-back" size={22} color={tint} /></Pressable>
            <Text className="text-lg font-black text-primary tracking-tighter">Member Progress</Text>
            <View className="w-8" />
          </View>
        </View>

        <ScrollView className="flex-1 bg-background pt-24 px-6 pb-24" showsVerticalScrollIndicator={false}>
          <View className="bg-primary rounded-3xl p-6 mb-6">
            <View className="mt-3 flex-row items-center gap-3">
              <View className="w-14 h-14 rounded-full border-2 border-white/70 overflow-hidden">
                <Image source={avatarSource} style={{ width: '100%', height: '100%' }} />
              </View>
              <Text className="text-white text-2xl font-black">{memberName}</Text>
            </View>
            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="briefcase-outline" size={16} color="white" />
                <Text className="text-white/90">{memberRole}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="mail-outline" size={16} color="white" />
                <Text className="text-white/90">{memberEmail}</Text>
              </View>
            </View>
          </View>

          <View className="bg-card border border-border/20 rounded-3xl p-5 mb-6">
            <Text className="text-foreground/60 text-xs uppercase font-bold tracking-widest">Active Module</Text>
            <Text className="text-foreground text-xl font-black mt-1">{activeModule.title}</Text>
            <View className="mt-4">
              <View className="h-2 rounded-full bg-muted overflow-hidden">
                <View className="h-full bg-primary" style={{ width: `${activeModule.progress}%` }} />
              </View>
              <Text className="text-foreground/70 text-xs mt-2">{activeModule.progress}% completed</Text>
            </View>
          </View>

          <View className="bg-card border border-border/20 rounded-3xl p-5 mb-6">
            <Text className="text-foreground/60 text-xs uppercase font-bold tracking-widest mb-4">Weekly Reports</Text>
            {reports.length > 0 ? (
              <View className="gap-3">
                {reports.map((report: any) => (
                  <Pressable
                    key={report.id}
                    onPress={() => handleViewReport(report.id)}
                    className="bg-background border border-border/20 rounded-2xl p-4 active:opacity-80"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-foreground font-bold">Week of {report.week_start}</Text>
                      <Ionicons name="chevron-forward" size={18} color={tint} opacity={0.5} />
                    </View>
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-foreground/70 text-sm">{report.skill || 'General'}</Text>
                        <Text className="text-foreground/60 text-xs mt-1">{report.tasks_completed} tasks completed</Text>
                      </View>
                      <Text className="text-foreground/70 text-sm">{report.practice_hours}h</Text>
                    </View>
                    {report.completed_at && (
                      <Text className="text-green-500 text-xs font-semibold mt-2">✓ Completed</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text className="text-foreground/50 text-sm text-center py-4">No weekly reports yet</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}