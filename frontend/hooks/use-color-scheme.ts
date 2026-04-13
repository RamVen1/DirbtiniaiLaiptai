import { useColorScheme } from 'react-native';

import { resolveAppTheme } from '@/lib/resolve-app-theme';

export { useColorScheme };

export function useThemePalette() {
  return resolveAppTheme(useColorScheme());
}
