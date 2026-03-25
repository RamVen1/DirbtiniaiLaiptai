import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
export function InteractiveBarChart() {
  const data = [3, 5, 2, 6, 6, 7];
  const labels = ["week 1 ", "week 2", "week 3", "week 4", "week 5", "week 6"];
  const avgHours = [1.2, 1.8, 0.8, 2.5, 2.8, 3.1];
  const maxTasks = 7;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;
  const popupAnim = useRef(new Animated.Value(0)).current;

  // Animate bars
  useEffect(() => {
    Animated.stagger(
      80,
      animatedValues.map((val, i) =>
        Animated.timing(val, {
          toValue: (data[i] / maxTasks) * 70,
          duration: 500,
          useNativeDriver: false,
        })
      )
    ).start();
  }, []);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      handleClose();
      return;
    }

    popupAnim.setValue(0);
    setSelectedIndex(index);

    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedIndex(null));
  };

  return (
    <Pressable onPress={handleClose}>
      <View className="mt-200">

        {/* Bars */}
        <View className="flex-row justify-between items-end h-[140px]">
          {data.map((v, i) => {
            const isSelected = selectedIndex === i;

            return (
              <Pressable
                key={i}
                onPress={(e) => {
                  e.stopPropagation();
                  handleSelect(i);
                }}
                className="flex-1 items-center"
              >
                {isSelected && (
                  <Text className="text-primary text-xs font-bold mb-1">
                    {v} / {maxTasks}
                  </Text>
                )}

                <View className="h-[100px] w-5 rounded-md bg-primary/20 justify-end overflow-hidden">
                  <Animated.View
                    style={{
                      height: (v / maxTasks) * 70,
                    }}
                    className={`w-full rounded-md ${
                      isSelected ? 'bg-primary' : 'bg-primary/70'
                    }`}
                  />
                </View>

                <Text
                  className={`text-[10px] mt-2 ${
                    isSelected
                      ? 'text-primary font-bold'
                      : 'text-foreground/60'
                  }`}
                >
                  {labels[i]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Popup */}
        {selectedIndex !== null && (
          <Animated.View
            style={{
              opacity: popupAnim,
              transform: [
                {
                  translateY: popupAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
            className="mt-8 bg-card border border-border/20 rounded-2xl pt-6 pb-4 px-4"
          >
            <Text className="text-center font-bold text-foreground mb-4 ">
              Details {labels[selectedIndex]} 
            </Text>

            <View className="flex-row gap-3">

              {/* Tasks */}
              <View className="flex-1 bg-primary/10 p-3 rounded-xl items-center">
                <MaterialIcons name="task-alt" size={22} className="text-primary" />
                <Text className="text-xs text-foreground mt-2">Tasks</Text>
                <Text className="text-primary font-bold mt-1">
                  {data[selectedIndex]} / {maxTasks}
                </Text>
              </View>

              {/* Time */}
              <View className="flex-1 bg-primary/10 p-3 rounded-xl items-center">
                <AntDesign name="clock-circle" size={22} className='text-primary' />
                <Text className="text-xs text-foreground mt-2">Avg Time</Text>
                <Text className="text-primary font-bold mt-1">
                  {avgHours[selectedIndex]}h
                </Text>
              </View>

              {/* Growth */}
              <View className="flex-1 bg-primary/10 p-3 rounded-xl items-center">
                <SimpleLineIcons name="graph" size={22} className="text-primary" />
                <Text className="text-xs text-foreground mt-2">Growth</Text>

                <Text
                  className={`font-bold mt-1 ${
                    selectedIndex === 0
                      ? 'text-foreground'
                      : data[selectedIndex] - data[selectedIndex - 1] >= 0
                      ? 'text-primary'
                      : 'text-red-500'
                  }`}
                >
                  {selectedIndex === 0
                    ? '--'
                    : `${data[selectedIndex] - data[selectedIndex - 1] >= 0 ? '+' : ''}${
                        data[selectedIndex] - data[selectedIndex - 1]
                      }`}
                </Text>
              </View>

            </View>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
}