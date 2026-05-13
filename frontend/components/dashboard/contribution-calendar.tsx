import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { subDays, format, isSameDay } from 'date-fns';

interface ContributionCalendarProps {
  completedDates: Date[];
  tint: string;
}

export function ContributionCalendar({ completedDates, tint }: ContributionCalendarProps) {
  const last90Days = Array.from({ length: 90 }, (_, i) => subDays(new Date(), 89 - i));

  const weeks: Date[][] = [];
  for (let i = 0; i < last90Days.length; i += 7) {
    weeks.push(last90Days.slice(i, i + 7));
  }

  return (
    <View className="mt-4 mb-8">
      <View className="flex-row items-center gap-2 mb-4">
        <View className="w-4 h-[2px] bg-primary" />
        <Text className="font-bold text-foreground">Activity (Last 90 Days)</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="flex-row"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View className="flex-row gap-1.5">
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} className="gap-1.5">
              {week.map((day) => {
                const isCompleted = completedDates.some(d => isSameDay(d, day));
                
                return (
                  <View
                    key={day.toISOString()}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: isCompleted ? tint : '#27272a',
                      opacity: isCompleted ? 1 : 0.3
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View className="flex-row justify-between mt-2">
        <Text className="text-[10px] text-foreground/40 uppercase tracking-tighter">
          {format(subDays(new Date(), 90), 'MMM d')}
        </Text>
        <Text className="text-[10px] text-foreground/40 uppercase tracking-tighter">
          Today
        </Text>
      </View>
    </View>
  );
}