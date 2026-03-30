import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useThemeStore } from '../../store/themeStore';

interface NeonBarChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  bars: { key: string; color: string; name: string; stackId?: string }[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

export function NeonBarChart({
  data,
  xKey,
  bars,
  height = 300,
  layout = 'horizontal',
}: NeonBarChartProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#2a2a3e' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = isDark ? '#2a2a3e' : '#d1d5db';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        {layout === 'horizontal' ? (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fill: textColor, fontSize: 12 }}
              stroke={gridColor}
            />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} stroke={gridColor} />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fill: textColor, fontSize: 12 }}
              stroke={gridColor}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              tick={{ fill: textColor, fontSize: 12 }}
              stroke={gridColor}
              width={100}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: isDark ? '#fff' : '#111',
          }}
        />
        <Legend wrapperStyle={{ color: textColor, fontSize: 12 }} />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name}
            fill={b.color}
            stackId={b.stackId}
            radius={[4, 4, 0, 0]}
            opacity={0.85}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
