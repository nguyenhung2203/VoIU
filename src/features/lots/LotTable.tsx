import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, QrCode } from 'lucide-react';
import { ProductionLot, Expense, HarvestRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  formatArea,
  formatDate,
  formatWeight,
  formatUnitPrice,
  formatCurrencyShort,
} from '../../utils/formatters';
import {
  calculateLotCostPerKg,
  calculateLotTotalCost,
} from '../../utils/calculations';

interface LotTableProps {
  lots: ProductionLot[];
  expenses: Expense[];
  harvests: HarvestRecord[];
  onOpenQuickQR?: (lot: ProductionLot) => void;
}

export const LotTable: React.FC<LotTableProps> = ({
  lots,
  expenses,
  harvests,
  onOpenQuickQR,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
              <th className="py-3.5 px-4 whitespace-nowrap">Mã lô</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Lô sản xuất & Vùng trồng</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Loại nông sản</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Diện tích</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Tổng chi phí</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Sản lượng thực</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Giá thành/kg</th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">Trạng thái</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-strace-border text-xs">
            {lots.map((lot) => {
              const totalCost = calculateLotTotalCost(lot.id, expenses);
              const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);

              return (
                <tr
                  key={lot.id}
                  onClick={() => navigate(`/production-lots/${lot.id}`)}
                  className="hover:bg-slate-50/75 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-strace-primary whitespace-nowrap">
                    {lot.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={lot.imageUrl}
                        alt={lot.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-strace-text group-hover:text-strace-primary transition-colors">
                          {lot.name}
                        </p>
                        <p className="text-[11px] text-strace-muted">
                          {lot.location}, {lot.region}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-strace-text">{lot.cropType}</span>
                    <p className="text-[11px] text-strace-muted">{lot.variety}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-strace-text whitespace-nowrap">
                    {formatArea(lot.area)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-strace-text whitespace-nowrap">
                    {formatCurrencyShort(totalCost)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {lot.actualYield > 0 ? (
                      <span className="font-bold text-emerald-700">
                        {formatWeight(lot.actualYield)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-strace-subtle italic">Chưa thu hoạch</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {costPerKg !== null ? (
                      <span className="font-bold text-strace-dark bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {formatUnitPrice(costPerKg)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-strace-subtle italic">Chưa đủ dữ liệu</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <StatusBadge status={lot.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onOpenQuickQR && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickQR(lot);
                          }}
                          className="p-1.5 text-strace-muted hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Xem mã QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/production-lots/${lot.id}`);
                        }}
                        className="p-1.5 text-strace-muted hover:text-strace-primary hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
