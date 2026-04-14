import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type UsePulseAnimationOptions = {
  from?: number;
  to?: number;
  duration?: number;
};

export function usePulseAnimation(options: UsePulseAnimationOptions = {}) {
  const { from = 1, to = 1.08, duration = 800 } = options;
  const scale = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: to,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(scale, {
          toValue: from,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [duration, from, scale, to]);

  return scale;
}
