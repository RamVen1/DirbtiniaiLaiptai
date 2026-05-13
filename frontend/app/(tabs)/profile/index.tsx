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

export default function ProfileScreen() {
  const { isTablet, tint, avatarSource, user } = useProfile();
  const { groupedHistory, loading, error, getSortedSkills, getSkillStats } = useReportHistory();
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const toggleSkillExpanded = (skill: string) => {
    const newExpanded = new Set(expandedSkills);
    if (newExpanded.has(skill)) {
      newExpanded.delete(skill);
    } else {
      newExpanded.add(skill);
    }
    setExpandedSkills(newExpanded);
  };

  const getAllReports = () => {
    const allReports: any[] = [];
    Object.keys(groupedHistory).forEach(skill => {
      allReports.push(...groupedHistory[skill]);
    });
    return allReports;
  };
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
          <View className="mb-12">
            <Pressable
              onPress={() => router.push('QuarterlyReport' as any)}
              className="flex-row items-center justify-between p-5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mb-4 border border-primary/30 active:opacity-70"
            >
              <View className="flex-row items-center gap-4">
                <Ionicons name={'bar-chart' as any} size={18} color={tint} />
                <View className="flex-1">
                  <Text className="font-semibold">Quarterly Report</Text>
                  <Text className="text-xs text-foreground/60 mt-0.5">View your quarterly progress</Text>
                </View>
              </View>
              <Ionicons name={'chevron-forward'} size={18} color={tint} />
            </Pressable>

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
                {loading && (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="large" color={tint} />
                    <Text className="mt-4 text-foreground">Loading history...</Text>
                  </View>
                )}

                {error && (
                  <View className="items-center justify-center py-8 px-6">
                    <Ionicons name="alert-circle" size={48} color={tint} />
                    <Text className="mt-4 text-foreground font-semibold">Unable to load history</Text>
                    <Text className="mt-2 text-sm text-foreground/60 text-center">{error}</Text>
                  </View>
                )}

                {!loading && !error && getSortedSkills().length === 0 && (
                  <View className="items-center justify-center py-8 px-6">
                    <Ionicons name="document-outline" size={48} color={tint} />
                    <Text className="mt-4 text-foreground font-semibold">No completed reports yet</Text>
                    <Text className="mt-2 text-sm text-foreground/60 text-center">
                      Complete your first weekly report to see your learning history here.
                    </Text>
                  </View>
                )}

                {!loading && !error && getSortedSkills().length > 0 && (
                  <>
                    {/* Recent Section */}
                    <View className="mb-8">
                      <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        Recent
                      </Text>
                      <View className="gap-2">
                        {getAllReports()
                          .sort((a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime())
                          .slice(0, 3)
                          .map((report, index) => {
                            const startDate = new Date(report.week_start);
                            const skill = Object.keys(groupedHistory).find(key =>
                              groupedHistory[key].some(r => r.id === report.id)
                            );

                            return (
                              <Pressable
                                key={`recent-${index}`}
                                onPress={() => router.push({
                                  pathname: '/MiniReport',
                                  params: { reportId: report.id }
                                })}
                                className="active:opacity-70"
                              >
                                <View className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                                  <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                      <Text className="text-sm font-semibold text-foreground">
                                        {skill}
                                      </Text>
                                      <Text className="text-xs text-foreground/60 mt-1">
                                        Week of {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </Text>
                                      <Text className="text-xs text-foreground/60">
                                        {report.tasks_completed} tasks · {report.practice_hours.toFixed(1)}h
                                      </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={tint} />
                                  </View>
                                </View>
                              </Pressable>
                            );
                          })}
                      </View>
                    </View>

                    {/* Skills Section */}
                    <View>
                      <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        By Skill
                      </Text>
                      {getSortedSkills().map((skill) => {
                        const reports = groupedHistory[skill] || [];
                        const stats = getSkillStats(skill);
                        const isSkillExpanded = expandedSkills.has(skill);
                        const displayedReports = isSkillExpanded ? reports : [];

                        return (
                          <View key={skill} className="mb-6">
                            <Pressable
                              onPress={() => toggleSkillExpanded(skill)}
                              className="active:opacity-70"
                            >
                              <View className="p-4 bg-secondary/30 border border-border/20 rounded-lg">
                                <View className="flex-row items-center justify-between">
                                  <View className="flex-1">
                                    <Text className="font-bold text-foreground text-base mb-3">{skill}</Text>

                                    <View className={isTablet ? 'flex-row gap-3' : 'flex-col gap-2'}>
                                      <View className={isTablet ? 'flex-1' : 'w-full'}>
                                        <Text className="text-xs text-foreground/60 uppercase tracking-widest">Weeks</Text>
                                        <Text className="text-lg font-bold text-primary">{stats.totalReports}</Text>
                                      </View>
                                      <View className={isTablet ? 'flex-1' : 'w-full'}>
                                        <Text className="text-xs text-foreground/60 uppercase tracking-widest">Tasks</Text>
                                        <Text className="text-lg font-bold text-primary">{stats.totalTasks}</Text>
                                      </View>
                                      <View className={isTablet ? 'flex-1' : 'w-full'}>
                                        <Text className="text-xs text-foreground/60 uppercase tracking-widest">Avg/Week</Text>
                                        <Text className="text-lg font-bold text-primary">{stats.averageTasksPerWeek}</Text>
                                      </View>
                                      <View className={isTablet ? 'flex-1' : 'w-full'}>
                                        <Text className="text-xs text-foreground/60 uppercase tracking-widest">Hours</Text>
                                        <Text className="text-lg font-bold text-primary">{stats.totalHours.toFixed(1)}h</Text>
                                      </View>
                                    </View>
                                  </View>
                                  <Ionicons
                                    name={isSkillExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={tint}
                                  />
                                </View>
                              </View>
                            </Pressable>

                            {isSkillExpanded && (
                              <View className="gap-2 mt-3">
                                {reports.map((report, index) => {
                                  const startDate = new Date(report.week_start);

                                  return (
                                    <Pressable
                                      key={`${skill}-${index}`}
                                      onPress={() => router.push({
                                        pathname: '/MiniReport',
                                        params: { reportId: report.id }
                                      })}
                                      className="active:opacity-70"
                                    >
                                      <View className="p-3 bg-card/50 rounded-lg border border-border/10">
                                        <View className="flex-row items-center justify-between">
                                          <View className="flex-1">
                                            <Text className="text-sm font-semibold text-foreground">
                                              Week of {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </Text>
                                            <Text className="text-xs text-foreground/60 mt-1">
                                              {report.tasks_completed} tasks · {report.practice_hours.toFixed(1)}h
                                            </Text>
                                          </View>
                                        </View>
                                      </View>
                                    </Pressable>
                                  );
                                })}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}