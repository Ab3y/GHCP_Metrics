import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useChartTheme, NEON_COLORS } from './chartUtils';

export interface GaugeChartProps {
  value: number;
  label?: string;
  color?: string;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label = '',
  color = NEON_COLORS.cyan,
  size = 180,
}) => {
  const { tokens } = useChartTheme();
  const clamped = Math.max(0, Math.min(100, value));

  const gaugeData = [
    { name: 'filled', value: clamped },
    { name: 'empty', value: 100 - clamped },
  ];

  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={gaugeData}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="80%"
          innerRadius="60%"
          outerRadius="90%"
          paddingAngle={0}
          stroke="none"
          animationDuration={800}
        >
          <Cell fill={color} />
          <Cell fill={tokens.gridStroke} />
        </Pie>

        {/* Percentage text */}
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={tokens.text}
          fontSize={24}
          fontWeight={700}
        >
          {clamped}%
        </text>

        {/* Label below percentage */}
        {label && (
          <text
            x="50%"
            y="88%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={tokens.textSecondary}
            fontSize={12}
          >
            {label}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GaugeChart;
