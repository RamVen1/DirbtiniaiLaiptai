import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

type ConfettiBurstProps = {
  visible: boolean;
  pieces?: number;
};

const COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export function ConfettiBurst({ visible, pieces = 26 }: ConfettiBurstProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  const particles = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, index) => {
        const startX = Math.random() * Math.max(width - 20, 1);
        const drift = -200 + Math.random() * 300;
        return {
          id: index,
          color: COLORS[index % COLORS.length],
          size: 6 + (index % 5),
          rotateStart: Math.random() * 180,
          rotateEnd: 300 + Math.random() * 200,
          xStart: startX,
          xEnd: startX + drift,
          yStart: -40 - Math.random() * 180,
          yEnd: height + 80 + Math.random() * 100,
        };
      }),
    [height, pieces, width],
  );

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }

    Animated.timing(progress, {
      toValue: 1,
      duration: 1900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {particles.map((particle) => {
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [particle.xStart, particle.xEnd],
        });
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [particle.yStart, particle.yEnd],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [`${particle.rotateStart}deg`, `${particle.rotateEnd}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.piece,
              {
                width: particle.size,
                height: particle.size * 1.8,
                backgroundColor: particle.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  piece: {
    position: 'absolute',
    borderRadius: 2,
  },
});
