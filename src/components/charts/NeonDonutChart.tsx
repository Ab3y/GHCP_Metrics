import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useThemeStore } from '../../store/themeStore';

interface NeonDonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

function CenterLabel({
  viewBox,
  total,
  isDark,
}: {
  viewBox?: { cx?: number; cy?: number };
  total: number;
  isDark: boolean;
}) {
  const cx = viewBox?.cx ?? 0;
  const cy = viewBox?.cy ?? 0;
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fill={isDark ? '#fff' : '#111'}
      fontSize={18}
      fontWeight="bold"
    >
      {total.toLocaleString()}
    </text>
  );
}

export function NeonDonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 90,
}: NeonDonutChartProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const tooltipBg = isDark ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = isDark ? '#2a2a3e' : '#d1d5db';
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          nameKey="name"
          strokeWidth={0}
          label={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
          ))}
          <CenterLabel total={total} isDark={isDark} />
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: isDark ? '#fff' : '#111',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: isDark ? '#9ca3af' : '#6b7280' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
