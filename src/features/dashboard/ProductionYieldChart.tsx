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
import { HarvestRecord } from '../../types';
import { formatWeight } from '../../utils/formatters';

interface ProductionYieldChartProps {
  harvests: HarvestRecord[];
}

export const ProductionYieldChart: React.FC<ProductionYieldChartProps> = ({ harvests }) => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  const chartData = months.map((monthLabel, index) => {
    const monthNum = index + 1;
    const monthHarvests = harvests.filter((h) => {
      if (!h.date) return false;
      const d = new Date(h.date);
      return d.getMonth() + 1 === monthNum;
    });

    const totalYieldKg = monthHarvests.reduce((sum, h) => sum + h.yieldKg, 0);

    // Đếm số lô duy nhất có thu hoạch trong tháng này
    const uniqueLots = new Set(monthHarvests.map((h) => h.lotId));

    return {
      month: monthLabel,
      'Sản lượng thực thu (kg)': totalYieldKg,
      'Số lô thu hoạch': uniqueLots.size,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-strace-text">Tiến độ & Sản lượng thu hoạch</h3>
          <p className="text-xs text-strace-muted mt-0.5">
            Sản lượng thực tế (cột) và số lô đã xuất bán theo tháng (đường)
          </p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
          Thực thu
        </span>
      </div>

      <div className="h-72 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#69776F', fontSize: 11 }} tickLine={false} />
            {/* Trục trái: Sản lượng kg */}
            <YAxis
              yAxisId="left"
              tick={{ fill: '#69776F', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}t` : `${v}`)}
            />
            {/* Trục phải: Số lô */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#E6A23C', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, 4]}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name.includes('Sản lượng')) {
                  return [formatWeight(value), 'Sản lượng thực thu'];
                }
                return [`${value} lô`, 'Số lô có thu hoạch'];
              }}
              labelFormatter={(label) => `Tháng: ${label}`}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E9E5',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              yAxisId="left"
              dataKey="Sản lượng thực thu (kg)"
              fill="#208456"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Số lô thu hoạch"
              stroke="#E6A23C"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#E6A23C', strokeWidth: 1, stroke: '#FFFFFF' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
