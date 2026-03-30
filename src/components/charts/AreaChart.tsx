import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useChartTheme, tooltipStyle, axisProps, NEON_PALETTE } from './chartUtils';

export interface AreaChartProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKeys,
  colors = NEON_PALETTE,
  xAxisKey = 'date',
  height = 300,
  showGrid = true,
  showLegend = false,
}) => {
  const { tokens } = useChartTheme();
  const tt = tooltipStyle(tokens);
  const axis = axisProps(tokens);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea
        data={data}
        margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
      >
        <defs>
          {dataKeys.map((key, i) => {
            const color = colors[i % colors.length];
            return (
              <linearGradient key={key} id={`area-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            );
          })}
        </defs>

        {showGrid && (
          <CartesianGrid stroke={tokens.gridStroke} strokeDasharray="3 3" vertical={false} />
        )}

        <XAxis dataKey={xAxisKey} {...axis} />
        <YAxis {...axis} />

        <Tooltip
          contentStyle={tt.contentStyle}
          itemStyle={tt.itemStyle}
          labelStyle={tt.labelStyle}
          cursor={tt.cursor}
        />

        {showLegend && (
          <Legend
            wrapperStyle={{ color: tokens.text, fontSize: 12, paddingTop: 8 }}
          />
        )}

        {dataKeys.map((key, i) => {
          const color = colors[i % colors.length];
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={`url(#area-grad-${key})`}
              animationDuration={800}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
          );
        })}
      </RechartsArea>
    </ResponsiveContainer>
  );
};

export default AreaChart;
