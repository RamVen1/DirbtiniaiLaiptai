import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuarterlyReport } from '@/hooks/use-quarterly-report';

const screenWidth = Dimensions.get('window').width;

export default function QuarterlyReport() {
  const { quarterlyData, loading, error, fetchQuarterlyData, fetchQuartersSummary, quarters } = useQuarterlyReport();
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);

  useEffect(() => {
    fetchQuarterlyData();
    fetchQuartersSummary();
  }, []);

  useEffect(() => {
    if (selectedQuarter) {
      fetchQuarterlyData(selectedQuarter);
    }
  }, [selectedQuarter]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (error || !quarterlyData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 border-b border-border/20 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </Pressable>
          <Text className="text-xl font-bold text-foreground">Quarterly Report</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-text-outline" size={48} color="#6366f1" className="mb-4" />
          <Text className="text-lg font-semibold text-foreground text-center mb-2">
            No quarterly data yet
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            Complete 13 weeks to see your quarterly report and insights.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const data = quarterlyData;
  const skillsList = Object.entries(data.skills).map(([skill, stats]) => ({
    skill,
    ...stats,
  }));

  /*
  const getTrendIcon = () => {
    switch (data.progression_trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'maintaining':
        return '➡️';
      default:
        return '🌟';
    }
  };
  */
  const getTrendColor = () => {
    switch (data.progression_trend) {
      case 'improving':
        return 'text-green-500';
      case 'declining':
        return 'text-red-500';
      case 'maintaining':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 border-b border-border/20 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </Pressable>
          <Text className="text-xl font-bold text-foreground">Quarterly Report</Text>
        </View>
        <Text className="text-sm font-semibold text-primary">
          Q{data.quarter_number}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Quarter Selector */}
          {quarters.length > 1 && (
            <View className="mb-6">
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Select Quarter
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2"
              >
                {quarters.map((q) => (
                  <Pressable
                    key={q.quarter_number}
                    onPress={() => setSelectedQuarter(q.quarter_number)}
                    className={`px-4 py-2 rounded-lg border-2 ${(selectedQuarter || data.quarter_number) === q.quarter_number
                      ? 'bg-primary border-primary'
                      : 'border-border/30 bg-secondary/20'
                      }`}
                  >
                    <Text
                      className={`font-semibold ${(selectedQuarter || data.quarter_number) === q.quarter_number
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                        }`}
                    >
                      Q{q.quarter_number}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Key Metrics */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Quarter Overview
            </Text>
            <View className="gap-3">
              {/* Row 1 */}
              <View className="flex-row gap-3">
                {/* Total Tasks */}
                <View className="flex-1 bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-muted-foreground font-medium">Total Tasks</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#6366f1" />
                  </View>
                  <Text className="text-2xl font-bold text-primary">{data.total_tasks}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {data.avg_tasks_per_week}/week avg
                  </Text>
                </View>

                {/* Total Hours */}
                <View className="flex-1 bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-muted-foreground font-medium">Practice Hours</Text>
                    <Ionicons name="time" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-2xl font-bold text-accent">{data.total_hours}h</Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {(data.total_hours / data.total_weeks).toFixed(1)}h/week
                  </Text>
                </View>
              </View>

              {/* Row 2 */}
              <View className="flex-row gap-3">
                {/* Consistency */}
                <View className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-muted-foreground font-medium">Consistency</Text>
                    <Ionicons name="flame" size={20} color="#22c55e" />
                  </View>
                  <Text className="text-2xl font-bold text-green-500">{data.consistency_score}%</Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {data.total_weeks}/13 weeks active
                  </Text>
                </View>

                {/* Progression */}
                <View className={`flex-1 rounded-xl p-4 border ${data.progression_trend === 'improving'
                  ? 'bg-green-500/10 border-green-500/20'
                  : data.progression_trend === 'declining'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-muted-foreground font-medium">Progression</Text>
                  </View>
                  <Text className={`text-2xl font-bold capitalize ${getTrendColor()}`}>
                    {data.progression_trend === 'improving' ? `+${data.improvement_percent}%` : `${data.improvement_percent}%`}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1 capitalize">
                    {data.progression_trend}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Weekly Progress Chart */}
          {data.weekly_data.length > 0 && (
            <View className="mb-6 bg-secondary/30 rounded-xl p-4 border border-border/20">
              <Text className="text-sm font-semibold text-foreground mb-4">Weekly Task Completion</Text>

              <View className="bg-white/5 rounded-lg p-4">
                {/* Chart bars */}
                <View className="flex-row items-flex-end justify-between gap-1 h-40 mb-4">
                  {data.weekly_data.slice(0, 13).map((week, idx) => {
                    const maxTasks = Math.max(...data.weekly_data.map(w => w.tasks), 1);
                    const height = (week.tasks / maxTasks) * 120;
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => {
                          router.push({
                            pathname: '/MiniReport',
                            params: { reportId: week.report_id }
                          });
                        }}
                        className="flex-1 items-center gap-1 active:opacity-70"
                      >
                        <View
                          className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t hover:opacity-80"
                          style={{ height: Math.max(height, 4) }}
                        />
                        <Text className="text-xs font-bold text-primary">{week.tasks}</Text>
                        <Text className="text-xs text-muted-foreground">W{week.week}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Y-axis reference */}
                <View className="flex-row items-center justify-between text-xs text-muted-foreground px-1">
                  <Text className="text-xs text-muted-foreground">0</Text>
                  <Text className="text-xs text-muted-foreground">Tasks</Text>
                </View>
              </View>

              <View className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <Text className="text-xs text-foreground font-medium">
                  📊 Peak week: {Math.max(...data.weekly_data.map(w => w.tasks))} tasks
                </Text>
              </View>
            </View>
          )}

          {/* Skills Learned */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Skills Developed
            </Text>
            {skillsList.map((skill, index) => (
              <View
                key={index}
                className="bg-secondary/30 border border-border/20 rounded-lg p-4 mb-3"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-foreground">
                    {skill.skill}
                  </Text>
                  <View className="bg-primary/20 px-2 py-1 rounded">
                    <Text className="text-xs font-bold text-primary">
                      {skill.weeks} weeks
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground mb-1">Tasks Completed</Text>
                    <Text className="text-lg font-bold text-primary">{skill.tasks}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground mb-1">Practice Hours</Text>
                    <Text className="text-lg font-bold text-accent">
                      {skill.hours.toFixed(1)}h
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground mb-1">Avg/Week</Text>
                    <Text className="text-lg font-bold text-green-500">
                      {(skill.tasks / skill.weeks).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Insights */}
          <View className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="bulb" size={20} color="#6366f1" />
              <Text className="text-base font-semibold text-foreground">Quarter Insights</Text>
            </View>

            <View className="space-y-2">
              {data.progression_trend === 'improving' && (
                <Text className="text-sm text-foreground leading-relaxed">
                  Great momentum! You're improving by {data.improvement_percent}%. Keep up the consistent effort.
                </Text>
              )}

              {data.consistency_score >= 90 && (
                <Text className="text-sm text-foreground leading-relaxed">
                  Exceptional consistency! You maintained {data.total_weeks}/13 weeks of active work.
                </Text>
              )}

              {data.consistency_score < 50 && (
                <Text className="text-sm text-foreground leading-relaxed">
                  Consider building a stronger routine. Aim for at least 10 weeks per quarter.
                </Text>
              )}

              <Text className="text-sm text-foreground leading-relaxed">
                You focused on {skillsList.length} skill{skillsList.length !== 1 ? 's' : ''} this quarter.
              </Text>

              {data.avg_tasks_per_week > 5 && (
                <Text className="text-sm text-foreground leading-relaxed">
                  You averaged {data.avg_tasks_per_week.toFixed(1)} tasks per week - excellent pace!
                </Text>
              )}
            </View>
          </View>

          {/* Date Range */}
          <View className="bg-secondary/20 rounded-lg p-3 mb-8 border border-border/20">
            <Text className="text-xs text-muted-foreground font-medium">
              Quarter Period: {data.quarter_start} to {data.quarter_end}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
