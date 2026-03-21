import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { NeonCard } from '@/components/dashboard/neon-card';

import { SkillRing } from './skill-ring';

export function SkillCard({
  value,
  label,
  subtitle,
  color,
}: {
  value: number;
  label: string;
  subtitle: string;
  color: string;
}) {
  return (
    <NeonCard className="p-8">
      <View className="relative items-center">
        <View className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full" />
        <View className="items-center">
          <SkillRing value={value} color={color} />
          <Text className="mt-4 font-bold text-foreground">{label}</Text>
          <Text className="text-[12px] mt-1 text-muted-foreground font-medium">{subtitle}</Text>
        </View>
      </View>
    </NeonCard>
  );
}
