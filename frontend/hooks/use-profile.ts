import { useWindowDimensions } from 'react-native';

import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export function useProfile() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const { tint } = useThemePalette();
  const { user } = useAuth();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  return { width, isTablet, tint, avatarSource, user };
}