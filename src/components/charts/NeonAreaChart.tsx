import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useThemeStore } from '../../store/themeStore';

interface NeonAreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKeys: { key: string; color: string; name: string }[];
  height?: number;
}

export function NeonAreaChart({
  data,
  xKey,
  yKeys,
  height = 300,
}: NeonAreaChartProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#2a2a3e' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = isDark ? '#2a2a3e' : '#d1d5db';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          {yKeys.map((yk) => (
            <linearGradient
              key={yk.key}
              id={`gradient-${yk.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={yk.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={yk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: textColor, fontSize: 12 }}
          stroke={gridColor}
        />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} stroke={gridColor} />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: isDark ? '#fff' : '#111',
          }}
        />
        <Legend
          wrapperStyle={{ color: textColor, fontSize: 12 }}
        />
        {yKeys.map((yk) => (
          <Area
            key={yk.key}
            type="monotone"
            dataKey={yk.key}
            name={yk.name}
            stroke={yk.color}
            strokeWidth={2}
            fill={`url(#gradient-${yk.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
