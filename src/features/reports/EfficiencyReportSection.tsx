import React from 'react';
import { ProductionLot, Expense, HarvestRecord } from '../../types';
import {
  formatArea,
  formatCurrency,
  formatWeight,
  formatUnitPrice,
  formatCurrencyShort,
} from '../../utils/formatters';
import {
  calculateLotCostPerKg,
  calculateLotTotalCost,
  calculateCostPerHectare,
  calculateYieldPerHectare,
} from '../../utils/calculations';

interface EfficiencyReportSectionProps {
  lots: ProductionLot[];
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const EfficiencyReportSection: React.FC<EfficiencyReportSectionProps> = ({
  lots,
  expenses,
  harvests,
}) => {
  const lotEfficiencies = lots.map((lot) => {
    const totalCost = calculateLotTotalCost(lot.id, expenses);
    const costPerHa = calculateCostPerHectare(totalCost, lot.area);
    const actualOrExpYield = lot.actualYield > 0 ? lot.actualYield : lot.expectedYield;
    const yieldPerHa = calculateYieldPerHectare(actualOrExpYield, lot.area);
    const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);
    const planRate = lot.expectedYield > 0 ? ((lot.actualYield / lot.expectedYield) * 100).toFixed(1) : '0';

    return {
      lot,
      totalCost,
      costPerHa,
      yieldPerHa,
      costPerKg,
      planRate,
      isHarvested: lot.actualYield > 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-strace-border flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-strace-text">Chỉ số hiệu quả kinh tế trên mỗi Hecta (ha)</h4>
            <p className="text-xs text-strace-muted mt-0.5">
              So sánh suất vốn đầu tư, năng suất thu hoạch và giá thành giữa các vùng trồng
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-strace-muted px-2.5 py-1 rounded-lg font-medium">
            12 lô canh tác
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
                <th className="py-3 px-4 text-right whitespace-nowrap">Chi phí / Hecta</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Năng suất / Hecta</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Giá thành / kg</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Thực hiện KH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {lotEfficiencies.map((item) => (
                <tr key={item.lot.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-strace-primary whitespace-nowrap">
                    {item.lot.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-strace-text whitespace-nowrap">
                    {item.lot.name}
                  </td>
                  <td className="py-3.5 px-4 text-strace-muted whitespace-nowrap">
                    {item.lot.cropType}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-strace-text whitespace-nowrap">
                    {formatArea(item.lot.area)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-strace-text whitespace-nowrap">
                    {item.costPerHa ? formatCurrencyShort(item.costPerHa) + '/ha' : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                    {item.yieldPerHa ? formatWeight(item.yieldPerHa) + '/ha' : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {item.costPerKg !== null ? (
                      <span className="font-bold text-strace-dark bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {formatUnitPrice(item.costPerKg)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-strace-subtle italic">Chưa thu hoạch</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                    {item.isHarvested ? (
                      <span className="text-emerald-700">{item.planRate}%</span>
                    ) : (
                      <span className="text-strace-subtle">0%</span>
                    )}
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
