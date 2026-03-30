import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useThemeStore } from '../../store/themeStore';

interface NeonLineChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  lines: { key: string; color: string; name: string; dashed?: boolean }[];
  height?: number;
}

export function NeonLineChart({
  data,
  xKey,
  lines,
  height = 300,
}: NeonLineChartProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#2a2a3e' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = isDark ? '#2a2a3e' : '#d1d5db';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
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
        <Legend wrapperStyle={{ color: textColor, fontSize: 12 }} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={2}
            strokeDasharray={l.dashed ? '5 5' : undefined}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
