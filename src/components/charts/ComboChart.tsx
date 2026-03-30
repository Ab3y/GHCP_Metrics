import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useChartTheme, tooltipStyle, axisProps, NEON_COLORS } from './chartUtils';

export interface ComboChartProps {
  data: Record<string, unknown>[];
  barKeys: string[];
  lineKeys: string[];
  barColors?: string[];
  lineColors?: string[];
  xAxisKey?: string;
  height?: number;
}

export const ComboChart: React.FC<ComboChartProps> = ({
  data,
  barKeys,
  lineKeys,
  barColors = [NEON_COLORS.cyan, NEON_COLORS.blue],
  lineColors = [NEON_COLORS.magenta, NEON_COLORS.lime],
  xAxisKey = 'date',
  height = 300,
}) => {
  const { tokens } = useChartTheme();
  const tt = tooltipStyle(tokens);
  const axis = axisProps(tokens);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
      >
        <CartesianGrid stroke={tokens.gridStroke} strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey={xAxisKey} {...axis} />
        {/* Left axis for bars */}
        <YAxis yAxisId="left" {...axis} />
        {/* Right axis for lines */}
        <YAxis yAxisId="right" orientation="right" {...axis} />

        <Tooltip
          contentStyle={tt.contentStyle}
          itemStyle={tt.itemStyle}
          labelStyle={tt.labelStyle}
          cursor={{ fill: tokens.gridStroke }}
        />

        <Legend
          wrapperStyle={{ color: tokens.text, fontSize: 12, paddingTop: 8 }}
        />

        {barKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            yAxisId="left"
            fill={barColors[i % barColors.length]}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            maxBarSize={32}
          />
        ))}

        {lineKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            yAxisId="right"
            stroke={lineColors[i % lineColors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: lineColors[i % lineColors.length] }}
            animationDuration={800}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ComboChart;
