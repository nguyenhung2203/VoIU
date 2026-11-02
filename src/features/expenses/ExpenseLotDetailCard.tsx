import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Sprout, MapPin, Scale, Wallet } from 'lucide-react';
import { ProductionLot, Expense, HarvestRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  formatArea,
  formatCurrency,
  formatWeight,
  formatUnitPrice,
} from '../../utils/formatters';
import { calculateLotCostPerKg, calculateLotTotalCost } from '../../utils/calculations';

interface ExpenseLotDetailCardProps {
  selectedLot: ProductionLot | null;
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const ExpenseLotDetailCard: React.FC<ExpenseLotDetailCardProps> = ({
  selectedLot,
  expenses,
  harvests,
}) => {
  const navigate = useNavigate();

  if (!selectedLot) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card text-center flex flex-col items-center justify-center min-h-[260px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-strace-muted mb-3 border border-slate-100">
          <Sprout className="w-6 h-6 text-strace-muted" />
        </div>
        <h4 className="text-sm font-bold text-strace-text">Chưa chọn lô cụ thể</h4>
        <p className="text-xs text-strace-muted mt-1 max-w-xs leading-relaxed">
          Chọn một lô sản xuất ở bộ lọc phía trên để xem chi tiết chi phí và giá thành riêng biệt của lô đó
        </p>
      </div>
    );
  }

  const lotTotalCost = calculateLotTotalCost(selectedLot.id, expenses);
  const costPerKg = calculateLotCostPerKg(selectedLot.id, expenses, harvests);

  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-strace-primary bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {selectedLot.code}
          </span>
          <StatusBadge status={selectedLot.status} size="sm" />
        </div>
        <button
          onClick={() => navigate(`/production-lots/${selectedLot.id}`)}
          className="text-xs text-strace-primary hover:text-strace-deep font-semibold flex items-center gap-1 hover:underline"
        >
          <span>Xem chi tiết lô</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <img
          src={selectedLot.imageUrl}
          alt={selectedLot.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-strace-text truncate">{selectedLot.name}</h4>
          <p className="text-xs text-strace-muted mt-0.5">
            {selectedLot.cropType} — {selectedLot.variety}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-strace-subtle mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{selectedLot.location}, {selectedLot.region}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-strace-muted uppercase font-bold flex items-center gap-1">
            <Wallet className="w-3 h-3 text-strace-primary" /> Tổng chi phí
          </span>
          <p className="text-sm font-bold text-strace-text mt-0.5">
            {formatCurrency(lotTotalCost)}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-strace-muted uppercase font-bold flex items-center gap-1">
            <Scale className="w-3 h-3 text-amber-600" /> Thực thu hoạch
          </span>
          <p className="text-sm font-bold text-emerald-700 mt-0.5">
            {selectedLot.actualYield > 0 ? formatWeight(selectedLot.actualYield) : '0 kg'}
          </p>
        </div>
      </div>

      <div className="mt-auto p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-800">
            Giá thành sản xuất / kg
          </span>
          <p className="text-base font-extrabold text-strace-dark">
            {costPerKg !== null ? formatUnitPrice(costPerKg) : 'Chưa đủ dữ liệu'}
          </p>
        </div>
        <div className="text-right text-[11px] text-strace-muted">
          <span>Diện tích: {formatArea(selectedLot.area)}</span>
          <br />
          <span>{selectedLot.associatedHouseholds} hộ liên kết</span>
        </div>
      </div>
    </div>
  );
};
