import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWindowDimensions } from 'react-native';


export function useProfile(){
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  return { width, isTablet, colorScheme, tint, avatarSource }

}