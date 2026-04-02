import { Colors } from '@/constants/theme';

export type AppTheme = 'light' | 'dark';

export type AppThemeColors = typeof Colors.light;

export function resolveAppTheme(colorScheme: string | null | undefined) {
  const isDark = colorScheme === 'dark';
  const theme: AppTheme = isDark ? 'dark' : 'light';

  const colors: AppThemeColors = Colors[theme];

  return {
    theme,
    colors,
    tint: colors.tint,
    text: colors.text,
    background: colors.background,
  };
}
