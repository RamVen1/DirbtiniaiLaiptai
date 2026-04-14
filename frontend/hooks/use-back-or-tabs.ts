import { useCallback } from 'react';
import { router } from 'expo-router';

export function useBackOrTabs() {
  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }, []);
}

