import React from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';
import { GroupedReportHistory, Report } from '@/hooks/use-report-history';

interface GroupedReportHistoryProps {
    groupedHistory: GroupedReportHistory;
    loading: boolean;
    error: string | null;
    getSortedSkills: () => string[];
    getSkillStats: (skill: string) => {
        totalReports: number;
        totalHours: number;
        totalTasks: number;
        averageTasksPerWeek: number;
    };
    onReportPress?: (report: Report) => void;
    tint?: string;
    isTablet?: boolean;
}

export function GroupedReportHistory({
    groupedHistory,
    loading,
    error,
    getSortedSkills,
    getSkillStats,
    onReportPress,
    tint = '#7C3AED',
    isTablet = false,
}: GroupedReportHistoryProps) {
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator size="large" color={tint} />
                <Text className="mt-4 text-foreground">Loading your report history...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center py-8 px-6">
                <Ionicons name="alert-circle" size={48} color={tint} />
                <Text className="mt-4 text-foreground font-semibold">Unable to load history</Text>
                <Text className="mt-2 text-sm text-foreground/60 text-center">{error}</Text>
            </View>
        );
    }

    const sortedSkills = getSortedSkills();

    if (sortedSkills.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-8 px-6">
                <Ionicons name="document-outline" size={48} color={tint} />
                <Text className="mt-4 text-foreground font-semibold">No completed reports yet</Text>
                <Text className="mt-2 text-sm text-foreground/60 text-center">
                    Complete your first weekly report to see your learning history here.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background px-4" showsVerticalScrollIndicator={false}>
            {sortedSkills.map((skill) => {
                const reports = groupedHistory[skill] || [];
                const stats = getSkillStats(skill);

                return (
                    <View key={skill} className="mb-8">
                        <View className="mb-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="w-6 h-[2px] bg-primary" />
                                <Text className="text-lg font-bold text-foreground">{skill}</Text>
                            </View>

                            <View className={isTablet ? 'flex-row gap-3 mb-4' : 'flex-col gap-2 mb-4'}>
                                <View className={isTablet ? 'flex-1' : 'w-full'}>
                                    <Text className="text-xs text-foreground/60 uppercase tracking-widest">Weeks Completed</Text>
                                    <Text className="text-xl font-bold text-primary">{stats.totalReports}</Text>
                                </View>
                                <View className={isTablet ? 'flex-1' : 'w-full'}>
                                    <Text className="text-xs text-foreground/60 uppercase tracking-widest">Total Tasks</Text>
                                    <Text className="text-xl font-bold text-primary">{stats.totalTasks}</Text>
                                </View>
                                <View className={isTablet ? 'flex-1' : 'w-full'}>
                                    <Text className="text-xs text-foreground/60 uppercase tracking-widest">Avg Tasks/Week</Text>
                                    <Text className="text-xl font-bold text-primary">{stats.averageTasksPerWeek}</Text>
                                </View>
                                <View className={isTablet ? 'flex-1' : 'w-full'}>
                                    <Text className="text-xs text-foreground/60 uppercase tracking-widest">Total Hours</Text>
                                    <Text className="text-xl font-bold text-primary">{stats.totalHours.toFixed(1)}h</Text>
                                </View>
                            </View>
                        </View>

                        <View className="gap-3">
                            {reports.map((report, index) => {
                                const startDate = new Date(report.week_start);
                                const endDate = new Date(report.week_end);
                                const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                const completionDate = new Date(report.completed_at);

                                return (
                                    <Pressable
                                        key={`${skill}-${index}`}
                                        onPress={() => onReportPress?.(report)}
                                        className="active:opacity-70"
                                    >
                                        <View className="p-4 bg-card rounded-xl border border-border/10 flex-row items-center justify-between">
                                            <View className="flex-1">
                                                <Text className="text-sm font-semibold text-foreground">
                                                    Week of {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </Text>
                                                <Text className="text-xs text-foreground/60 mt-1">
                                                    {report.tasks_completed} tasks · {report.practice_hours.toFixed(1)}h of practice
                                                </Text>
                                                <Text className="text-xs text-primary/60 mt-1">
                                                    Completed {completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                </Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color={tint} />
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            })}

            <View className="h-8" />
        </ScrollView>
    );
}
