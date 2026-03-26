import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  data: number[];
}

export function InteractiveBarChart({ data }: Props) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const chartData = data && data.length === 7 ? data : [0, 0, 0, 0, 0, 0, 0];

  return (
    <View className="flex-row items-end justify-between h-32 w-full px-2">
      {chartData.map((val, index) => (
        <View key={index} className="items-center flex-1">
          <View
            className={`w-6 rounded-t-lg ${val > 0 ? 'bg-primary' : 'bg-muted/30'}`}
            style={{ height: val > 0 ? '80%' : '15%' }}
          />
          <View className="mt-2">
            <Text className="text-[10px] font-bold text-muted-foreground">
              {days[index]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}