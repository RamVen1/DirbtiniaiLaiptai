import { router } from 'expo-router';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { getItem } from '@/utils/storage';

export function TaskActive() {
  const { tint } = useThemePalette();

  const handleDifficultyUpdate = async (adjustment: number) => {
    try {
      const token = await getItem('userToken');
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/update-difficulty?adjustment=${adjustment}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const count = data.total_tasks;

        if (count > 0 && count % 7 === 0) {
          router.push('/MiniReport');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
      router.replace('/(tabs)');
    }
  };

  return { tint, handleDifficultyUpdate}
}