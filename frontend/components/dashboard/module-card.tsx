import React from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { Progress } from '@/components/ui/progress';

export function ModuleCard({
  index,
  title,
  completionLabel,
  completionValue,
  barColor,
  icon,
  iconColor,
}: {
  index?: string;
  title: string;
  completionLabel: string;
  completionValue: number;
  barColor: 'primary' | 'secondary' | 'accent';
  icon: any;
  iconColor: string;
}) {
  const rootBg =
    barColor === 'primary'
      ? 'bg-primary/20'
      : barColor === 'secondary'
        ? 'bg-secondary/20'
        : 'bg-accent/20';
  const indicatorBg =
    barColor === 'primary' ? 'bg-primary' : barColor === 'secondary' ? 'bg-secondary' : 'bg-accent';

  const borderColor =
    barColor === 'primary'
      ? 'border-primary'
      : barColor === 'secondary'
        ? 'border-secondary'
        : 'border-accent';

  return (
    <View className={`bg-card p-6 rounded-2xl shadow-sm border-b-4 ${borderColor}`}>
      <View className="flex-row items-start justify-between mb-6">
        <View className={`p-3 ${rootBg} rounded-xl`}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <Text className="font-black text-2xl text-foreground/20">{index}</Text>
      </View>

      <Text className="text-foreground font-bold text-lg mb-4">{title}</Text>

      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-bold text-foreground/70">{completionLabel}</Text>
        <Text
          className={`text-xs font-bold ${
            barColor === 'primary'
              ? 'text-primary'
              : barColor === 'secondary'
                ? 'text-secondary'
                : 'text-accent'
          }`}
        >
          {completionValue}%
        </Text>
      </View>

      <Progress
        value={completionValue}
        className={`${rootBg} h-1.5`}
        indicatorClassName={indicatorBg}
      />
    </View>
  );
}
