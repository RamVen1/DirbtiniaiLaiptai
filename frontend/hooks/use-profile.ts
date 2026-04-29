import { useWindowDimensions } from 'react-native';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export function useProfile() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const { tint } = useThemePalette();
  const { user } = useAuth();

  const avatars = [
    require('@/assets/images/avatars/avatar1.jpg'),
    require('@/assets/images/avatars/avatar2.jpg'),
    require('@/assets/images/avatars/avatar3.jpg')
  ];

  const avatarSource = user?.avatar_index !== undefined 
    ? avatars[user.avatar_index] 
    : avatars[0];

  return { width, isTablet, tint, avatarSource, user };
}