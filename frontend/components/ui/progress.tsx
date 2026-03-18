import type React from 'react';
import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@rn-primitives/progress';
import { Platform, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: ProgressPrimitive.RootProps &
  React.RefAttributes<ProgressPrimitive.RootRef> & {
    indicatorClassName?: string;
  }) {
  return (
    <ProgressPrimitive.Root
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };

const Indicator = Platform.OS === 'web' ? WebIndicator : NativeIndicator;

type IndicatorProps = {
  value: number | undefined | null;
  className?: string;
};

function WebIndicator({ value, className }: IndicatorProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View
      className={cn('bg-foreground h-full w-full flex-1 transition-all', className)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    >
      <ProgressPrimitive.Indicator className={cn('h-full w-full', className)} />
    </View>
  );
}

function NativeIndicator({ value, className }: IndicatorProps) {
  const progress = useDerivedValue(() => value ?? 0, [value]);
  const containerWidth = useSharedValue(0);

  const indicator = useAnimatedStyle(() => {
    const pct = interpolate(progress.value, [0, 100], [0, 100], Extrapolation.CLAMP);
    const springWidth = withSpring((pct / 100) * containerWidth.value, { overshootClamping: true });
    return {
      width: springWidth,
    };
  });

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View
      className="h-full w-full"
      onLayout={(e) => {
        containerWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        style={[{ position: 'absolute', left: 0, top: 0, bottom: 0 }, indicator]}
        className={cn('bg-primary', className)}
      />
    </View>
  );
}

function NullIndicator(_props: IndicatorProps) {
  return null;
}
