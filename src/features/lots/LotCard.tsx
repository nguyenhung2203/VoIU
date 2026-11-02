import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Calendar,
  Scale,
  DollarSign,
  QrCode,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
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

interface LotCardProps {
  lot: ProductionLot;
  expenses: Expense[];
  harvests: HarvestRecord[];
  onOpenQuickLog?: (lot: ProductionLot) => void;
  onOpenQuickQR?: (lot: ProductionLot) => void;
}

export const LotCard: React.FC<LotCardProps> = ({
  lot,
  expenses,
  harvests,
  onOpenQuickLog,
  onOpenQuickQR,
}) => {
  const navigate = useNavigate();
  const totalCost = calculateLotTotalCost(lot.id, expenses);
  const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);

  return (
    <div className="bg-white rounded-2xl border border-strace-border shadow-card hover:shadow-cardHover transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image & Badges Banner */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={lot.imageUrl}
          alt={lot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-xs font-black bg-strace-dark/80 backdrop-blur text-white px-2.5 py-1 rounded-lg border border-white/20 shadow-xs">
            {lot.code}
          </span>
          <StatusBadge status={lot.status} size="sm" />
        </div>

        {/* Crop info at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 backdrop-blur px-2 py-0.5 rounded">
            {lot.cropType} • {lot.variety}
          </span>
          <h3 className="text-base font-bold text-white mt-1 leading-snug drop-shadow-sm truncate">
            {lot.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Meta details */}
        <div className="space-y-1.5 text-xs text-strace-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-strace-primary shrink-0" />
            <span className="truncate">{lot.location}, {lot.region}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-strace-muted" />
              <span>{lot.associatedHouseholds} hộ liên kết</span>
            </div>
            <div className="font-semibold text-strace-text">
              Diện tích: <span className="text-strace-primary font-bold">{formatArea(lot.area)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-strace-subtle">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Mùa vụ: {formatDate(lot.seasonStartDate)} – {formatDate(lot.expectedHarvestDate)}</span>
          </div>
        </div>

        {/* Stats Grid: Sản lượng & Chi phí & Giá thành */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-strace-muted flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-600" /> Sản lượng thực
            </span>
            <p className="font-bold text-emerald-700 mt-0.5">
              {lot.actualYield > 0 ? formatWeight(lot.actualYield) : 'Đang nuôi trái'}
            </p>
            <p className="text-[10px] text-strace-subtle">
              Dự kiến: {formatWeight(lot.expectedYield)}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-strace-muted flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-blue-600" /> Giá thành/kg
            </span>
            <p className="font-bold text-strace-dark mt-0.5">
              {costPerKg !== null ? formatUnitPrice(costPerKg) : 'Chưa đủ dữ liệu'}
            </p>
            <p className="text-[10px] text-strace-subtle">
              Tổng chi: {formatCurrencyShort(totalCost)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {onOpenQuickLog && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickLog(lot);
                }}
                className="p-2 rounded-xl text-strace-muted hover:text-strace-primary hover:bg-emerald-50 transition-colors border border-strace-border"
                title="Ghi nhanh nhật ký"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}
            {onOpenQuickQR && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickQR(lot);
                }}
                className="p-2 rounded-xl text-strace-muted hover:text-purple-600 hover:bg-purple-50 transition-colors border border-strace-border"
                title="Xem mã QR truy xuất"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate(`/production-lots/${lot.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-strace-primary hover:bg-strace-deep rounded-xl shadow-xs transition-colors"
          >
            <span>Chi tiết lô</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
