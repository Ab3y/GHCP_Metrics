import { useThemeStore } from '../../store/themeStore';

/** Neon accent palette — matches CSS custom properties in index.css */
export const NEON_COLORS = {
  cyan: '#00fff7',
  magenta: '#ff00ff',
  lime: '#39ff14',
  orange: '#ff6600',
  purple: '#bf00ff',
  blue: '#0080ff',
} as const;

export const NEON_PALETTE = [
  NEON_COLORS.cyan,
  NEON_COLORS.magenta,
  NEON_COLORS.lime,
  NEON_COLORS.orange,
  NEON_COLORS.purple,
  NEON_COLORS.blue,
];

interface ThemeTokens {
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
  gridStroke: string;
}

const DARK_TOKENS: ThemeTokens = {
  cardBg: '#1a1a2e',
  border: '#2a2a3e',
  text: '#e4e4e7',
  textSecondary: '#a1a1aa',
  gridStroke: 'rgba(255,255,255,0.06)',
};

const LIGHT_TOKENS: ThemeTokens = {
  cardBg: '#ffffff',
  border: '#e2e4ea',
  text: '#1a1a2e',
  textSecondary: '#71717a',
  gridStroke: 'rgba(0,0,0,0.08)',
};

export function useChartTheme() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const tokens = isDark ? DARK_TOKENS : LIGHT_TOKENS;
  return { isDark, tokens };
}

export function tooltipStyle(tokens: ThemeTokens) {
  return {
    contentStyle: {
      backgroundColor: tokens.cardBg,
      border: `1px solid ${tokens.border}`,
      borderRadius: 8,
      fontSize: 12,
      color: tokens.text,
    },
    itemStyle: { color: tokens.text, fontSize: 12 },
    labelStyle: { color: tokens.textSecondary, fontWeight: 600, marginBottom: 4 },
    cursor: { stroke: tokens.textSecondary, strokeWidth: 1, strokeDasharray: '4 4' },
  };
}

export function axisProps(tokens: ThemeTokens) {
  return {
    tick: { fill: tokens.textSecondary, fontSize: 11 },
    axisLine: { stroke: tokens.border },
    tickLine: { stroke: tokens.border },
  };
}
