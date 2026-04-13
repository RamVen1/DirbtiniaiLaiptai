/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resolveAppTheme } from '@/lib/resolve-app-theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { theme, colors } = resolveAppTheme(useColorScheme());
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return colors[colorName];
}
