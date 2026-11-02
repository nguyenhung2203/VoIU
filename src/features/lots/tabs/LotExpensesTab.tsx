import React from 'react';
import { DollarSign, Wallet, Plus, ArrowUpRight } from 'lucide-react';
import { ProductionLot, Expense, HarvestRecord } from '../../../types';
import {
  formatCurrency,
  formatDate,
  formatUnitPrice,
  formatCurrencyShort,
} from '../../../utils/formatters';
import {
  calculateLotCostPerKg,
  calculateLotTotalCost,
  calculateCostPerHectare,
} from '../../../utils/calculations';
import { ExpenseCategoryChart } from '../../expenses/ExpenseCategoryChart';
import { Link } from 'react-router-dom';

interface LotExpensesTabProps {
  lot: ProductionLot;
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const LotExpensesTab: React.FC<LotExpensesTabProps> = ({
  lot,
  expenses,
  harvests,
}) => {
  // Lọc chi phí của riêng lô
  const lotExpenses = expenses
    .filter((e) => e.lotId === lot.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCost = calculateLotTotalCost(lot.id, expenses);
  const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);
  const costPerHa = calculateCostPerHectare(totalCost, lot.area);

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng chi phí lô</span>
          <p className="text-2xl font-bold text-strace-primary mt-1">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-strace-muted mt-1">{lotExpenses.length} khoản chi đã ghi nhận</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Chi phí / Hecta</span>
          <p className="text-2xl font-bold text-strace-text mt-1">
            {costPerHa ? formatCurrency(costPerHa) : '-'}
          </p>
          <p className="text-xs text-strace-muted mt-1">Diện tích vùng trồng: {lot.area} ha</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Đơn giá thành / kg</span>
          <p className="text-2xl font-extrabold text-strace-dark mt-1">
            {costPerKg !== null ? formatUnitPrice(costPerKg) : 'Chưa đủ dữ liệu'}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            {costPerKg !== null ? `Đã thu hoạch ${lot.actualYield.toLocaleString('vi-VN')} kg` : 'Chờ thu hoạch hoàn tất'}
          </p>
        </div>
      </div>

      {/* Grid: Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of expenses */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-strace-border flex items-center justify-between">
            <h4 className="text-sm font-bold text-strace-text">Bảng kê chi phí canh tác</h4>
            <Link
              to="/expenses"
              className="text-xs text-strace-primary hover:text-strace-deep font-semibold flex items-center gap-1"
            >
              <span>Quản lý ở sổ chi phí</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                  <th className="py-2.5 px-4 whitespace-nowrap">Ngày</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">Khoản mục</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">Nội dung</th>
                  <th className="py-2.5 px-4 text-right whitespace-nowrap">Số tiền</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">Người chi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-strace-border text-xs">
                {lotExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-strace-muted">
                      Chưa phát sinh khoản chi phí nào cho lô này
                    </td>
                  </tr>
                ) : (
                  lotExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-strace-muted whitespace-nowrap">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-strace-text">
                        {exp.name}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-strace-dark whitespace-nowrap">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3 px-4 text-strace-muted whitespace-nowrap">
                        {exp.executor}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut chart for this lot */}
        <div className="lg:col-span-1">
          <ExpenseCategoryChart expenses={lotExpenses} />
        </div>
      </div>
    </div>
  );
};
