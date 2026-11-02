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
import { ProductionLot, Expense } from '../../types';
import {
  formatCurrency,
  formatCurrencyShort,
  formatArea,
} from '../../utils/formatters';
import { ExpenseCategoryChart } from '../expenses/ExpenseCategoryChart';

interface CostReportSectionProps {
  lots: ProductionLot[];
  expenses: Expense[];
}

export const CostReportSection: React.FC<CostReportSectionProps> = ({
  lots,
  expenses,
}) => {
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Tổng hợp chi phí theo từng lô
  const lotCostSummary = lots.map((lot) => {
    const lotExpenses = expenses.filter((e) => e.lotId === lot.id);
    const lotTotal = lotExpenses.reduce((sum, e) => sum + e.amount, 0);
    const costPerHa = lot.area > 0 ? Math.round(lotTotal / lot.area) : 0;
    return {
      lot,
      totalCost: lotTotal,
      costPerHa,
      expenseCount: lotExpenses.length,
      percentage: totalCost > 0 ? ((lotTotal / totalCost) * 100).toFixed(1) : '0',
    };
  }).sort((a, b) => b.totalCost - a.totalCost);

  // Dữ liệu biểu đồ cột so sánh chi phí theo lô
  const chartData = lotCostSummary.slice(0, 8).map((item) => ({
    name: item.lot.code,
    'Chi phí (VNĐ)': item.totalCost,
  }));

  return (
    <div className="space-y-6">
      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-strace-text">So sánh chi phí giữa các lô</h3>
              <p className="text-xs text-strace-muted mt-0.5">
                Các lô sản xuất có quy mô vốn đầu tư lớn nhất vụ 2026
              </p>
            </div>
            <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-strace-muted font-medium">
              Top 8 lô
            </span>
          </div>

          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#69776F', fontSize: 11 }} tickLine={false} />
                <YAxis
                  tick={{ fill: '#69776F', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCurrencyShort(v)}
                />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Chi phí đầu tư']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E9E5',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="Chi phí (VNĐ)" fill="#208456" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ExpenseCategoryChart expenses={expenses} />
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-strace-border flex items-center justify-between">
          <h4 className="text-sm font-bold text-strace-text">Bảng tổng hợp phân bổ chi phí theo lô</h4>
          <span className="text-xs text-strace-muted">
            Tổng cộng: <strong className="text-strace-dark font-bold">{formatCurrency(totalCost)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                <th className="py-3 px-4 whitespace-nowrap">Mã lô</th>
                <th className="py-3 px-4 whitespace-nowrap">Tên lô sản xuất</th>
                <th className="py-3 px-4 whitespace-nowrap">Nông sản</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Diện tích</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Số khoản chi</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Chi phí/ha</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Tổng chi phí (VNĐ)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {lotCostSummary.map((item) => (
                <tr key={item.lot.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-strace-primary whitespace-nowrap">
                    {item.lot.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-strace-text whitespace-nowrap">
                    {item.lot.name}
                  </td>
                  <td className="py-3 px-4 text-strace-muted whitespace-nowrap">
                    {item.lot.cropType}
                  </td>
                  <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                    {formatArea(item.lot.area)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono whitespace-nowrap">
                    {item.expenseCount}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-strace-muted whitespace-nowrap">
                    {item.costPerHa > 0 ? formatCurrency(item.costPerHa) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-strace-dark whitespace-nowrap">
                    {formatCurrency(item.totalCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-strace-primary whitespace-nowrap">
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
