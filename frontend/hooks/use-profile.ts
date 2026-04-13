import { useWindowDimensions } from 'react-native';

import { useThemePalette } from '@/hooks/use-color-scheme';

export function useProfile() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const { tint } = useThemePalette();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  return { width, isTablet, tint, avatarSource };
}