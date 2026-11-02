import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Expense } from '../../types';
import { formatCurrency, formatCurrencyShort } from '../../utils/formatters';

interface ExpenseCategoryChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Phân bón': '#208456',
  'Nhân công': '#3AA66B',
  'Thuốc BVTV': '#E6A23C',
  'Tưới tiêu': '#3478C0',
  'Giống': '#8B5CF6',
  'Vận chuyển': '#06B6D4',
  'Máy móc': '#F97316',
  'Dịch vụ thuê ngoài': '#EC4899',
  'Khác': '#94A3B8',
};

export const ExpenseCategoryChart: React.FC<ExpenseCategoryChartProps> = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-strace-text">Cơ cấu chi phí</h3>
        <span className="text-xs text-strace-muted">
          Tổng: <strong className="text-strace-dark font-bold">{formatCurrencyShort(totalAmount)}</strong>
        </span>
      </div>
      <p className="text-xs text-strace-muted mb-4">
        Tỷ trọng các nhóm chi phí sản xuất trong dữ liệu lọc
      </p>

      {totalAmount === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-strace-muted">
          Không có dữ liệu chi phí
        </div>
      ) : (
        <>
          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CATEGORY_COLORS[entry.name] || '#94A3B8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Số tiền',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E9E5',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng chi</span>
              <span className="text-sm font-extrabold text-strace-text">
                {formatCurrencyShort(totalAmount)}
              </span>
            </div>
          </div>

          {/* Legend items list */}
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#94A3B8' }}
                  />
                  <span className="text-strace-text font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-strace-dark">
                    {formatCurrencyShort(item.value)}
                  </span>
                  <span className="text-[11px] text-strace-muted bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
