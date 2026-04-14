import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type UseEntranceAnimationOptions = {
  initialTranslateY?: number;
  duration?: number;
};

export function useEntranceAnimation(options: UseEntranceAnimationOptions = {}) {
  const { initialTranslateY = 200, duration = 360 } = options;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(initialTranslateY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [duration, opacity, translateY]);

  return {
    opacity,
    translateY,
  };
}
