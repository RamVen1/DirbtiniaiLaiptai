import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getItem } from '@/utils/storage';
import { useMiniReport } from '@/hooks/use-mini-report';

export default function MiniReport() {
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    chart_data: [0, 0, 0, 0, 0, 0, 0],
    day_labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    total_practice_hours: 0,
    tasks_completed: 0,
    tasks_by_day: {},
    daily_tasks: {
      Mon: { completed: 0, task: "" },
      Tue: { completed: 0, task: "" },
      Wed: { completed: 0, task: "" },
      Thu: { completed: 0, task: "" },
      Fri: { completed: 0, task: "" },
      Sat: { completed: 0, task: "" },
      Sun: { completed: 0, task: "" }
    },
    week_start: '',
    week_end: ''
  });
  const [isPreviousWeek, setIsPreviousWeek] = useState(false);
  const params = useLocalSearchParams();
  const reportId = params.reportId ? parseInt(params.reportId as string) : null;

  const completedDaysCount = reportData.chart_data.filter(val => val > 0).length;

  useEffect(() => {
    fetchReportData();
  }, [reportId]);

  const fetchReportData = async () => {
    try {
      const token = await getItem('userToken');

      let queryString = '';
      if (reportId) {
        queryString = `?report_id=${reportId}`;
        setIsPreviousWeek(true);
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mini-report-data${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const token = await getItem('userToken');

      let queryString = '';
      if (reportId) {
        queryString = `?report_id=${reportId}`;
      }

      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/complete-weekly-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      router.replace('/(tabs)');
    }
  };

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
            <Text className="text-3xl font-bold text-foreground mt-1">
              {isPreviousWeek ? 'Previous Week Report' : 'Activity Report'}
            </Text>
            {isPreviousWeek && reportData.week_start && (
              <Text className="text-foreground/50 text-xs mt-2">
                {reportData.week_start} to {reportData.week_end}
              </Text>
            )}
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

          <View className="bg-card border border-border/20 rounded-2xl p-6 mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-foreground/60 text-xs uppercase tracking-widest font-bold">Tasks Completed</Text>
              <Text className="text-foreground font-black text-3xl mt-2">{reportData.tasks_completed}</Text>
            </View>
            <View className="bg-primary/20 p-3 rounded-2xl">
              <Ionicons name="checkmark-circle" size={32} color="#E11D48" />
            </View>
          </View>

          <View className="bg-card/40 border border-border/20 rounded-[2rem] p-6 mb-6">
            <Text className="text-foreground text-lg font-bold mb-4">Daily Progress</Text>

            <View className="gap-3">
              {reportData.day_labels.map((day, index) => {
                const dayData = reportData.daily_tasks[day as keyof typeof reportData.daily_tasks];
                const isCompleted = dayData.completed === 1;

                return (
                  <View key={index} className="flex-row items-start gap-3 p-3 bg-card rounded-lg border border-border/10">

                    <View className={`w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-primary' : 'bg-card border border-border/30'
                      }`}>
                      <Text className={`text-lg font-black ${isCompleted ? 'text-white' : 'text-foreground/30'
                        }`}>
                        {isCompleted ? '✓' : '○'}
                      </Text>
                    </View>


                    <View className="flex-1 min-w-0">
                      <Text className="text-foreground/60 font-bold text-xs uppercase tracking-wide mb-1">
                        {day}
                      </Text>
                      <Text className={`${isCompleted
                        ? 'text-foreground font-semibold'
                        : 'text-foreground/50 italic'
                        }`}>
                        {dayData.task || 'No task'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>


          <View className="bg-card border border-border/20 rounded-2xl p-6 items-center mb-8">
            <Text className="text-foreground/60 text-xs uppercase tracking-widest font-bold">Total Practice</Text>
            <Text className="text-foreground font-black text-4xl mt-1">
              {reportData.total_practice_hours}h
            </Text>
          </View>
        </ScrollView>


        <View className="absolute bottom-6 left-0 right-0 px-6">
          <Pressable
            onPress={handleComplete}
            className="bg-primary w-full py-5 rounded-2xl items-center active:scale-[0.98]"
          >
            <Text className="text-white text-lg font-bold">Continue to Dashboard</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
