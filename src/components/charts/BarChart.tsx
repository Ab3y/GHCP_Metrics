import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useChartTheme, tooltipStyle, axisProps, NEON_PALETTE } from './chartUtils';

export interface BarChartProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
  showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKeys,
  colors = NEON_PALETTE,
  xAxisKey = 'name',
  height = 300,
  stacked = false,
  horizontal = false,
  showLegend = false,
}) => {
  const { tokens } = useChartTheme();
  const tt = tooltipStyle(tokens);
  const axis = axisProps(tokens);

  const layout = horizontal ? 'vertical' : 'horizontal';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, left: horizontal ? 60 : -8, bottom: 0 }}
      >
        <CartesianGrid stroke={tokens.gridStroke} strokeDasharray="3 3" vertical={!horizontal} horizontal={horizontal || undefined} />

        {horizontal ? (
          <>
            <XAxis type="number" {...axis} />
            <YAxis type="category" dataKey={xAxisKey} {...axis} width={56} />
          </>
        ) : (
          <>
            <XAxis dataKey={xAxisKey} {...axis} />
            <YAxis {...axis} />
          </>
        )}

        <Tooltip
          contentStyle={tt.contentStyle}
          itemStyle={tt.itemStyle}
          labelStyle={tt.labelStyle}
          cursor={{ fill: tokens.gridStroke }}
        />

        {showLegend && (
          <Legend
            wrapperStyle={{ color: tokens.text, fontSize: 12, paddingTop: 8 }}
          />
        )}

        {dataKeys.map((key, i) => {
          const color = colors[i % colors.length];
          return (
            <Bar
              key={key}
              dataKey={key}
              fill={color}
              stackId={stacked ? 'stack' : undefined}
              radius={stacked ? undefined : [4, 4, 0, 0]}
              animationDuration={800}
              maxBarSize={40}
            />
          );
        })}
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChart;
