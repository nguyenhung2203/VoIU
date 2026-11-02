import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ProductionLot, Expense, HarvestRecord } from '../../types';
import {
  formatCurrency,
  formatWeight,
  formatUnitPrice,
  formatCurrencyShort,
} from '../../utils/formatters';
import {
  calculateLotCostPerKg,
  calculateLotTotalCost,
  calculateAverageCostPerKg,
} from '../../utils/calculations';

interface CostPerKgReportSectionProps {
  lots: ProductionLot[];
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const CostPerKgReportSection: React.FC<CostPerKgReportSectionProps> = ({
  lots,
  expenses,
  harvests,
}) => {
  // Lọc các lô đã có sản lượng thực thu > 0
  const harvestedLots = lots
    .map((lot) => {
      const totalCost = calculateLotTotalCost(lot.id, expenses);
      const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);
      return {
        lot,
        totalCost,
        actualYield: lot.actualYield,
        costPerKg,
      };
    })
    .filter((item) => item.actualYield > 0 && item.costPerKg !== null);

  const avgCostOverall = calculateAverageCostPerKg(lots, expenses, harvests);

  const chartData = harvestedLots.map((item) => ({
    name: item.lot.code,
    product: item.lot.cropType,
    'Giá thành (VNĐ/kg)': item.costPerKg,
  }));

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">
            Giá thành bình quân toàn HTX
          </span>
          <p className="text-2xl font-extrabold text-strace-dark mt-1">
            {avgCostOverall !== null ? formatUnitPrice(avgCostOverall) : 'Chưa đủ dữ liệu'}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            Tính trên {harvestedLots.length} lô đã hoàn tất thu hoạch thực tế
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng chi phí các lô thu hoạch</span>
          <p className="text-2xl font-bold text-strace-primary mt-1">
            {formatCurrency(harvestedLots.reduce((sum, i) => sum + i.totalCost, 0))}
          </p>
          <p className="text-xs text-strace-muted mt-1">Chi phí phân bổ trực tiếp</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng sản lượng thực thu</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {formatWeight(harvestedLots.reduce((sum, i) => sum + i.actualYield, 0))}
          </p>
          <p className="text-xs text-strace-muted mt-1">Đã đóng gói và cung ứng thị trường</p>
        </div>
      </div>

      {/* Chart: So sánh giá thành theo lô */}
      <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-strace-text">Biểu đồ so sánh giá thành sản xuất (VNĐ/kg)</h3>
            <p className="text-xs text-strace-muted mt-0.5">
              Giá thành/kg = Tổng chi phí phân bổ cho lô / Tổng sản lượng thực tế thu được
            </p>
          </div>
          <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-strace-muted font-medium">
            {harvestedLots.length} lô đủ điều kiện
          </span>
        </div>

        <div className="h-72 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#69776F', fontSize: 11 }} tickLine={false} />
              <YAxis
                tick={{ fill: '#69776F', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrencyShort(v)}
              />
              <Tooltip
                formatter={(val: number) => [formatUnitPrice(val), 'Giá thành sản xuất']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E9E5',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="Giá thành (VNĐ/kg)" fill="#115740" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-strace-border">
          <h4 className="text-sm font-bold text-strace-text">Bảng tổng hợp chi tiết tính giá thành các lô</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                <th className="py-3 px-4">Mã lô</th>
                <th className="py-3 px-4">Tên lô sản xuất</th>
                <th className="py-3 px-4">Nông sản</th>
                <th className="py-3 px-4 text-right">Tổng chi phí (A)</th>
                <th className="py-3 px-4 text-right">Sản lượng thực thu (B)</th>
                <th className="py-3 px-4 text-right">Giá thành (A / B)</th>
                <th className="py-3 px-4 text-center">Đánh giá hiệu quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {harvestedLots.map((item) => (
                <tr key={item.lot.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-strace-primary">
                    {item.lot.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-strace-text">
                    {item.lot.name}
                  </td>
                  <td className="py-3 px-4 text-strace-muted">
                    {item.lot.cropType} • {item.lot.variety}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-strace-text">
                    {formatCurrency(item.totalCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
                    {formatWeight(item.actualYield)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-extrabold text-strace-dark bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {formatUnitPrice(item.costPerKg)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Tối ưu chi phí vụ 2026
                    </span>
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
