import { useColorScheme } from 'react-native';

export const palette = {
  dark: {
    bg: '#0b0f1a',
    surface: '#121829',
    surface2: '#182036',
    line: '#222b45',
    text: '#e7eaf3',
    muted: '#8f9bb8',
    accent: '#34d399',
    accentText: '#04241b',
    income: '#34d399',
    expense: '#fb7185',
    warning: '#f59e0b',
  },
  light: {
    bg: '#f6f7fb',
    surface: '#ffffff',
    surface2: '#f0f2f8',
    line: '#e6e8f0',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#059669',
    accentText: '#ffffff',
    income: '#059669',
    expense: '#e11d48',
    warning: '#d97706',
  },
} as const;

export type Colors = Record<keyof typeof palette.dark, string>;

export const radius = { sm: 10, md: 14, lg: 20 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Dark by default, like the website; follows the phone's light mode when it is set. */
export function useColors(): Colors {
  const scheme = useColorScheme();

  return scheme === 'light' ? palette.light : palette.dark;
}