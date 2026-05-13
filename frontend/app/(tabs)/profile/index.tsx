import React, { useState } from 'react';
import { Pressable, ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { NeonCard } from '@/components/dashboard/neon-card';
import { SkillCard } from '@/components/dashboard/skill-card';
import { useProfile } from '@/hooks/use-profile';
import { useReportHistory } from '@/hooks/use-report-history';
import { ContributionCalendar } from '@/components/dashboard/contribution-calendar';
import { useUserActivity } from '@/hooks/use-user-activity';
import { useThemePalette } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const { isTablet, tint, avatarSource, user } = useProfile();
  const { groupedHistory, loading: historyLoading, error, getSortedSkills, getSkillStats } = useReportHistory();
  const [expandedHistory, setExpandedHistory] = useState(false);
  const { completedDates, loading: activityLoading } = useUserActivity();

  const mockCompletedDates = [new Date()]; 

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Loading profile...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="px-6 py-4 border-b border-border/20 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <View className="flex-1 items-center justify-center">
              <Image
                source={avatarSource}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 999,
                }}
                resizeMode="cover"
              />
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
          <View className="w-8 h-8 items-center justify-center">
            <Image
              source={avatarSource}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 999,
              }}
              resizeMode="cover"
            />
          </View>
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-background px-6 pb-28" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="items-center mt-8 mb-10">
          <View className="relative mb-6">
            <View className="w-36 h-36 rounded-full p-1 bg-primary/20 items-center justify-center">
              <View className="w-full h-full rounded-full border-4 border-background items-center justify-center overflow-hidden">
                <Image
                  source={avatarSource}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 999,
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
            <View className="absolute bottom-1 right-1 bg-primary px-2 py-0.5 rounded-full items-center justify-center">
              <Ionicons name={'checkmark-circle' as any} size={16} color="#fff" />
            </View>
          </View>

          <Text className="text-2xl font-bold tracking-tight text-foreground text-center">
            {user.username} ({user.email})
          </Text>
          <Text className="text-primary font-bold tracking-widest uppercase text-xs mt-1">
            {user.role}
          </Text>

          <View className="mt-6 w-full px-4">
            <Button
              variant="outline"
              className="w-full rounded-xl border-primary/20"
              onPress={() => { router.navigate('/profile/modal') }}
            >
              <Text className="text-primary font-bold text-base">Profile Settings</Text>
            </Button>
          </View>
        </View>

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

        {user.role?.toLowerCase() === 'member' && (
          <>
            <View className="mb-12">
              <Pressable
                onPress={() => setExpandedHistory(!expandedHistory)}
                className="flex-row items-center justify-between p-5 bg-card rounded-2xl mb-2 border border-border/10"
              >
                <View className="flex-row items-center gap-4">
                  <Ionicons name={'time' as any} size={18} color={tint} />
                  <Text className="font-semibold">Learning History</Text>
                </View>
                <Ionicons
                  name={expandedHistory ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={tint}
                />
              </Pressable>

              {expandedHistory && (
                <View className="mt-4">
                  {historyLoading ? (
                    <ActivityIndicator size="small" color={tint} />
                  ) : (
                    getSortedSkills().map((skill) => {
                      const stats = getSkillStats(skill);
                      return (
                        <View key={skill} className="mb-6">
                          <View className="flex-row items-center gap-2 mb-3">
                            <View className="w-4 h-[2px] bg-primary" />
                            <Text className="font-bold text-foreground">{skill}</Text>
                          </View>
                          <View className="flex-row gap-3">
                             <View className="flex-1 bg-card/40 p-3 rounded-xl">
                                <Text className="text-[10px] text-foreground/50 uppercase">Tasks</Text>
                                <Text className="text-lg font-bold text-primary">{stats.totalTasks}</Text>
                             </View>
                             <View className="flex-1 bg-card/40 p-3 rounded-xl">
                                <Text className="text-[10px] text-foreground/50 uppercase">Hours</Text>
                                <Text className="text-lg font-bold text-primary">{stats.totalHours.toFixed(1)}h</Text>
                             </View>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              )}

              {/* TIKRAS KALENDORIUS */}
              {activityLoading ? (
                <View className="mt-4 h-24 items-center justify-center">
                   <ActivityIndicator size="small" color={tint} />
                </View>
              ) : (
                <ContributionCalendar 
                  completedDates={completedDates} 
                  tint={tint} 
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}