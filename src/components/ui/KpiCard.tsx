import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  neonColor?: string;
}

export function KpiCard({ label, value, change, icon, neonColor = 'neon-cyan' }: KpiCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const accentColor = `var(--color-${neonColor})`;

  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-200 ${
        isDark
          ? 'bg-dark-card border-dark-border hover:border-dark-hover'
          : 'bg-light-card border-light-border hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
        {icon && <span style={{ color: accentColor }}>{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
        {change !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-sm font-medium mb-1 ${
              change >= 0 ? 'text-neon-lime' : 'text-neon-magenta'
            }`}
          >
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}
