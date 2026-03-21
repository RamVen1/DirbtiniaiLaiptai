import React from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export function LessonTopBar({
  title,
  tintColor,
  onFlamePress,
  onAvatarPress,
  containerClassName,
  avatarClassName,
  flameButtonClassName,
  avatarIconName = 'person' as IoniconName,
  flameIconName = 'flame' as IoniconName,
}: {
  title: string;
  tintColor: string;
  onFlamePress: () => void;
  onAvatarPress?: () => void;
  containerClassName?: string;
  avatarClassName?: string;
  flameButtonClassName?: string;
  avatarIconName?: IoniconName;
  flameIconName?: IoniconName;
}) {
  return (
    <View
      className={cn('bg-background/80 border-b border-border/20 px-6 py-4', containerClassName)}
    >
      <View className="flex-row items-center justify-between">
        <View className={cn('flex-row items-center gap-3', flameButtonClassName)}>
          {onAvatarPress ? (
            <Pressable
              onPress={onAvatarPress}
              className={cn(
                'w-10 h-10 rounded-full bg-primary/20 border-2 border-primary items-center justify-center overflow-hidden active:scale-95',
                avatarClassName,
              )}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <Ionicons name={avatarIconName} size={18} color={tintColor} />
            </Pressable>
          ) : (
            <View
              className={cn(
                'w-10 h-10 rounded-full bg-primary/20 border-2 border-primary items-center justify-center overflow-hidden',
                avatarClassName,
              )}
            >
              <Ionicons name={avatarIconName} size={18} color={tintColor} />
            </View>
          )}
          <Text className="text-lg font-black text-primary tracking-tighter">{title}</Text>
        </View>

        <Pressable
          onPress={onFlamePress}
          className={cn('p-2 active:scale-95', flameButtonClassName)}
          accessibilityRole="button"
          accessibilityLabel="Active lesson action"
        >
          <Ionicons name={flameIconName} size={22} color={tintColor} />
        </Pressable>
      </View>
    </View>
  );
}
