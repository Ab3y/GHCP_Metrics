import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';
import { useChartTheme, tooltipStyle, NEON_PALETTE } from './chartUtils';

export interface DonutDatum {
  name: string;
  value: number;
}

export interface DonutChartProps {
  data: DonutDatum[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors = NEON_PALETTE,
  height = 300,
  innerRadius = 60,
  showLabels = false,
  showLegend = true,
  centerLabel,
}) => {
  const { tokens } = useChartTheme();
  const tt = tooltipStyle(tokens);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);
  const displayLabel = centerLabel ?? total.toLocaleString();

  const renderLabel = showLabels
    ? ({ name, percent }: { name?: string; percent?: number }) =>
        `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
    : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 28}
          paddingAngle={2}
          animationDuration={800}
          label={renderLabel}
          labelLine={showLabels}
          stroke="none"
        >
          {data.map((_entry, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>

        {/* Center text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={tokens.text}
          fontSize={20}
          fontWeight={700}
        >
          {displayLabel}
        </text>

        <Tooltip
          contentStyle={tt.contentStyle}
          itemStyle={tt.itemStyle}
          labelStyle={tt.labelStyle}
        />

        {showLegend && (
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ color: tokens.text, fontSize: 12, paddingTop: 12 }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
