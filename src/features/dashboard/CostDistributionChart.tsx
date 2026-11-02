import React from 'react';
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
import { Expense } from '../../types';
import { formatCurrencyShort } from '../../utils/formatters';

interface CostDistributionChartProps {
  expenses: Expense[];
}

export const CostDistributionChart: React.FC<CostDistributionChartProps> = ({ expenses }) => {
  // Nhóm chi phí theo tháng (T1 -> T11) và phân loại danh mục
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  const chartData = months.map((monthLabel, index) => {
    const monthNum = index + 1;
    const monthExpenses = expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getMonth() + 1 === monthNum;
    });

    const getCatSum = (categoryName: string) => {
      return monthExpenses
        .filter((e) => e.category === categoryName)
        .reduce((sum, e) => sum + e.amount, 0);
    };

    const getOtherSum = () => {
      return monthExpenses
        .filter(
          (e) =>
            !['Phân bón', 'Nhân công', 'Thuốc BVTV', 'Tưới tiêu', 'Vận chuyển', 'Giống'].includes(
              e.category
            )
        )
        .reduce((sum, e) => sum + e.amount, 0);
    };

    return {
      month: monthLabel,
      'Phân bón': getCatSum('Phân bón'),
      'Nhân công': getCatSum('Nhân công'),
      'Thuốc BVTV': getCatSum('Thuốc BVTV'),
      'Tưới tiêu': getCatSum('Tưới tiêu'),
      'Vận chuyển': getCatSum('Vận chuyển'),
      'Giống': getCatSum('Giống'),
      'Khác': getOtherSum(),
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-strace-text">Cơ cấu chi phí theo tháng</h3>
          <p className="text-xs text-strace-muted mt-0.5">
            Biểu đồ cột chồng phân loại danh mục chi phí canh tác (VNĐ)
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-strace-muted px-2.5 py-1 rounded-lg font-medium">
          Năm 2026
        </span>
      </div>

      <div className="h-72 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#69776F', fontSize: 11 }} tickLine={false} />
            <YAxis
              tick={{ fill: '#69776F', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrencyShort(v)}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ',
                name,
              ]}
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
            <Bar dataKey="Phân bón" stackId="a" fill="#208456" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Nhân công" stackId="a" fill="#3AA66B" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Thuốc BVTV" stackId="a" fill="#E6A23C" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Tưới tiêu" stackId="a" fill="#3478C0" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Vận chuyển" stackId="a" fill="#94A3B8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Giống" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Khác" stackId="a" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
