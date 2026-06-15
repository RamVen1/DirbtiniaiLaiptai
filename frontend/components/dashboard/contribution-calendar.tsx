import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { subDays, format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface ContributionCalendarProps {
  completedDates: Date[];
  tint: string;
}

export function ContributionCalendar({ completedDates, tint }: ContributionCalendarProps) {
  const today = new Date();
  const start = subDays(today, 90);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get all days from start to today
  const allDays = eachDayOfInterval({ start, end: today });

  // Group into weeks (Monday to Sunday)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach(day => {
    const dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // If Monday (1) and we have days, start new week
    if (dayOfWeek === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);
  });

  // Add remaining days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <View className="mt-4 mb-8">
      <Text className="font-bold text-foreground mb-4">Activity (Last 90 Days)</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-col"
      >
        {/* Day labels */}
        <View className="flex-row mb-3">
          <View className="w-12" />
          <View className="flex-row gap-2">
            {dayLabels.map((label) => (
              <View key={label} className="w-10 h-10 items-center justify-center">
                <Text className="text-[9px] font-bold text-foreground/60 uppercase">{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} className="flex-row mb-3 items-start gap-2">
            {/* Week number */}
            <View className="w-12 h-10 items-center justify-center">
              <Text className="text-[9px] font-bold text-foreground/40">W{weekIndex + 1}</Text>
            </View>

            {/* Days of week */}
            <View className="flex-row gap-2">
              {dayLabels.map((_, dayIndex) => {
                const day = week[dayIndex];
                const isCompleted = day ? completedDates.some(d => isSameDay(d, day)) : false;
                const isToday = day ? isSameDay(day, today) : false;

                return (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-10 h-10 rounded-lg items-center justify-center ${isToday ? 'border-2 border-primary' : 'border border-border/20'
                      }`}
                    style={{
                      backgroundColor: day ? (isCompleted ? tint : '#27272a') : '#1a1a1a',
                      opacity: day ? (isCompleted ? 1 : 0.3) : 0
                    }}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row gap-3 mt-4 pt-3 border-t border-border/20">
        <View className="flex-row items-center gap-2">
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: tint,
            }}
          />
          <Text className="text-xs text-foreground/60">Completed</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: '#27272a',
              opacity: 0.3
            }}
          />
          <Text className="text-xs text-foreground/60">Not Done</Text>
        </View>
      </View>
    </View>
  );
}