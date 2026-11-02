import React from 'react';
import {
  MapPin,
  Users,
  Calendar,
  Scale,
  Award,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';
import { ProductionLot, Expense, HarvestRecord } from '../../../types';
import {
  formatArea,
  formatDate,
  formatWeight,
  formatCurrency,
  formatUnitPrice,
} from '../../../utils/formatters';
import {
  calculateLotCostPerKg,
  calculateLotTotalCost,
  calculateCostPerHectare,
  calculateYieldPerHectare,
} from '../../../utils/calculations';

interface GeneralInfoTabProps {
  lot: ProductionLot;
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  lot,
  expenses,
  harvests,
}) => {
  const lotTotalCost = calculateLotTotalCost(lot.id, expenses);
  const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);
  const costPerHa = calculateCostPerHectare(lotTotalCost, lot.area);
  const yieldPerHa = calculateYieldPerHectare(
    lot.actualYield > 0 ? lot.actualYield : lot.expectedYield,
    lot.area
  );

  // Tính phần trăm tiến độ sản lượng thực thu vs dự kiến
  const yieldProgressPct =
    lot.expectedYield > 0
      ? Math.min(100, Math.round((lot.actualYield / lot.expectedYield) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Diện tích canh tác</span>
          <p className="text-xl font-bold text-strace-text mt-1">{formatArea(lot.area)}</p>
          <p className="text-xs text-strace-muted mt-1">{lot.associatedHouseholds} hộ nông dân liên kết</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng chi phí đầu tư</span>
          <p className="text-xl font-bold text-strace-primary mt-1">{formatCurrency(lotTotalCost)}</p>
          <p className="text-xs text-strace-muted mt-1">
            Bình quân: {costPerHa ? formatCurrency(costPerHa) + '/ha' : '-'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Sản lượng thực thu</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {lot.actualYield > 0 ? formatWeight(lot.actualYield) : 'Chưa thu hoạch'}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            Kế hoạch: {formatWeight(lot.expectedYield)} ({yieldProgressPct}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Giá thành bình quân/kg</span>
          <p className="text-xl font-extrabold text-strace-dark mt-1">
            {costPerKg !== null ? formatUnitPrice(costPerKg) : 'Chưa đủ dữ liệu'}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            {costPerKg !== null ? 'Dựa trên chi phí & thực thu' : 'Cần có đợt thu hoạch thực tế'}
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General & Agricultural Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-strace-border shadow-card">
            <h3 className="text-base font-bold text-strace-text mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-strace-primary" />
              <span>Hồ sơ kỹ thuật vùng trồng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-strace-muted">Mã số lô:</span>
                <p className="font-mono font-bold text-strace-primary text-sm mt-0.5">{lot.code}</p>
              </div>
              <div>
                <span className="text-strace-muted">Tên lô sản xuất:</span>
                <p className="font-bold text-strace-text text-sm mt-0.5">{lot.name}</p>
              </div>
              <div>
                <span className="text-strace-muted">Loại nông sản & Giống:</span>
                <p className="font-semibold text-strace-text mt-0.5">
                  {lot.cropType} — <span className="text-strace-primary font-bold">{lot.variety}</span>
                </p>
              </div>
              <div>
                <span className="text-strace-muted">Địa chỉ & Tọa độ vùng trồng:</span>
                <p className="font-medium text-strace-text mt-0.5">
                  {lot.location}, {lot.region}
                </p>
              </div>
              <div>
                <span className="text-strace-muted">Ngày bắt đầu mùa vụ:</span>
                <p className="font-semibold text-strace-text mt-0.5">{formatDate(lot.seasonStartDate)}</p>
              </div>
              <div>
                <span className="text-strace-muted">Ngày dự kiến thu hoạch:</span>
                <p className="font-semibold text-strace-text mt-0.5">{formatDate(lot.expectedHarvestDate)}</p>
              </div>
              {lot.actualHarvestDate && (
                <div>
                  <span className="text-strace-muted">Ngày kết thúc thu hoạch thực tế:</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{formatDate(lot.actualHarvestDate)}</p>
                </div>
              )}
              <div>
                <span className="text-strace-muted">Cán bộ kỹ thuật phụ trách:</span>
                <p className="font-semibold text-strace-text mt-0.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-strace-primary" />
                  <span>{lot.manager}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs text-strace-muted block mb-1 font-semibold">
                Quy trình & Mô tả canh tác:
              </span>
              <p className="text-xs text-strace-text leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {lot.description || 'Chưa có ghi chú quy trình đặc thù cho lô này.'}
              </p>
            </div>
          </div>

          {/* Tiến độ sản lượng & Năng suất */}
          <div className="bg-white p-6 rounded-2xl border border-strace-border shadow-card">
            <h3 className="text-base font-bold text-strace-text mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Chỉ tiêu & Hiệu quả năng suất</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-strace-muted">Tiến độ thực hiện sản lượng kế hoạch:</span>
                  <span className="font-bold text-strace-primary">{yieldProgressPct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-strace-fresh to-strace-primary rounded-full transition-all duration-500"
                    style={{ width: `${yieldProgressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-strace-subtle mt-1 font-mono">
                  <span>Thực tế: {formatWeight(lot.actualYield)}</span>
                  <span>Chỉ tiêu: {formatWeight(lot.expectedYield)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <span className="text-emerald-800 font-semibold text-[11px]">Năng suất thực tế/ha:</span>
                  <p className="text-base font-bold text-emerald-900 mt-0.5">
                    {yieldPerHa ? formatWeight(yieldPerHa) + '/ha' : 'Đang tính toán'}
                  </p>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <span className="text-blue-800 font-semibold text-[11px]">Suất đầu tư/ha:</span>
                  <p className="text-base font-bold text-blue-900 mt-0.5">
                    {costPerHa ? formatCurrency(costPerHa) + '/ha' : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Banner Image & Standards */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
            <img
              src={lot.imageUrl}
              alt={lot.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-strace-text">Tiêu chuẩn canh tác</span>
              </div>
              <p className="text-xs text-strace-muted leading-relaxed">
                Áp dụng quy trình kiểm soát dịch hại tổng hợp (IPM), ghi chép nhật ký điện tử S-TRACE, sử dụng phân bón hữu cơ vi sinh và hệ thống tưới tiết kiệm.
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  VietGAP Chuẩn
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                  Mã vùng trồng
                </span>
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-bold border border-teal-200">
                  Hữu cơ tuần hoàn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
