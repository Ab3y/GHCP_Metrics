import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useChartTheme, tooltipStyle, axisProps, NEON_PALETTE } from './chartUtils';

export interface LineChartProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKeys,
  colors = NEON_PALETTE,
  xAxisKey = 'date',
  height = 300,
  showDots = false,
  showGrid = true,
  showLegend = false,
}) => {
  const { tokens } = useChartTheme();
  const tt = tooltipStyle(tokens);
  const axis = axisProps(tokens);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine
        data={data}
        margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
      >
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
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={showDots ? { r: 3, fill: color, strokeWidth: 0 } : false}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
              animationDuration={800}
            />
          );
        })}
      </RechartsLine>
    </ResponsiveContainer>
  );
};

export default LineChart;
