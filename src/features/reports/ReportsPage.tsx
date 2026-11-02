import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Filter,
  Wallet,
  Scale,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { CropType } from '../../types';
import { CostReportSection } from './CostReportSection';
import { YieldReportSection } from './YieldReportSection';
import { CostPerKgReportSection } from './CostPerKgReportSection';
import { EfficiencyReportSection } from './EfficiencyReportSection';
import { exportToExcel } from '../../utils/exportExcel';
import { toast } from 'sonner';

type ReportType = 'cost' | 'yield' | 'cost_per_kg' | 'efficiency';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('cost');
  const [periodFilter, setPeriodFilter] = useState<'all' | '2026' | 'q1' | 'q2' | 'q3' | 'q4'>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [lotFilter, setLotFilter] = useState<string>('all');

  const lots = useAppStore((state) => state.lots);
  const expenses = useAppStore((state) => state.expenses);
  const harvests = useAppStore((state) => state.harvests);

  // Lọc danh sách lô theo crop và lot
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchCrop = cropFilter === 'all' || lot.cropType === cropFilter;
      const matchLot = lotFilter === 'all' || lot.id === lotFilter;
      return matchCrop && matchLot;
    });
  }, [lots, cropFilter, lotFilter]);

  const targetLotIds = useMemo(() => new Set(filteredLots.map((l) => l.id)), [filteredLots]);

  // Lọc chi phí theo kỳ và lô
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!targetLotIds.has(e.lotId)) return false;
      if (periodFilter === 'all' || periodFilter === '2026') return true;
      const m = new Date(e.date).getMonth() + 1;
      if (periodFilter === 'q1') return m >= 1 && m <= 3;
      if (periodFilter === 'q2') return m >= 4 && m <= 6;
      if (periodFilter === 'q3') return m >= 7 && m <= 9;
      if (periodFilter === 'q4') return m >= 10 && m <= 12;
      return true;
    });
  }, [expenses, targetLotIds, periodFilter]);

  // Lọc thu hoạch theo kỳ và lô
  const filteredHarvests = useMemo(() => {
    return harvests.filter((h) => {
      if (!targetLotIds.has(h.lotId)) return false;
      if (periodFilter === 'all' || periodFilter === '2026') return true;
      const m = new Date(h.date).getMonth() + 1;
      if (periodFilter === 'q1') return m >= 1 && m <= 3;
      if (periodFilter === 'q2') return m >= 4 && m <= 6;
      if (periodFilter === 'q3') return m >= 7 && m <= 9;
      if (periodFilter === 'q4') return m >= 10 && m <= 12;
      return true;
    });
  }, [harvests, targetLotIds, periodFilter]);

  // Xuất file Excel tổng hợp
  const handleExportExcel = () => {
    let exportData: Record<string, any>[] = [];
    let fileName = `S_TRACE_Bao_Cao_${reportType}_${new Date().toISOString().split('T')[0]}`;

    if (reportType === 'cost') {
      exportData = filteredExpenses.map((e) => ({
        'Mã Chi Phí': e.code,
        'Ngày': e.date,
        'Lô': e.lotCode,
        'Khoản Mục': e.category,
        'Tên Khoản Chi': e.name,
        'Số Tiền (VNĐ)': e.amount,
        'Người Thực Hiện': e.executor,
      }));
    } else if (reportType === 'yield') {
      exportData = filteredLots.map((l) => ({
        'Mã Lô': l.code,
        'Tên Lô': l.name,
        'Nông Sản': l.cropType,
        'Kế Hoạch (kg)': l.expectedYield,
        'Thực Thu (kg)': l.actualYield,
        'Tỷ Lệ (%)': l.expectedYield > 0 ? ((l.actualYield / l.expectedYield) * 100).toFixed(1) : 0,
      }));
    } else if (reportType === 'cost_per_kg') {
      exportData = filteredLots
        .filter((l) => l.actualYield > 0)
        .map((l) => {
          const cost = filteredExpenses.filter((e) => e.lotId === l.id).reduce((s, e) => s + e.amount, 0);
          return {
            'Mã Lô': l.code,
            'Tên Lô': l.name,
            'Tổng Chi Phí (VNĐ)': cost,
            'Sản Lượng Thực Thu (kg)': l.actualYield,
            'Giá Thành (VNĐ/kg)': l.actualYield > 0 ? Math.round(cost / l.actualYield) : 0,
          };
        });
    } else {
      exportData = filteredLots.map((l) => {
        const cost = filteredExpenses.filter((e) => e.lotId === l.id).reduce((s, e) => s + e.amount, 0);
        return {
          'Mã Lô': l.code,
          'Diện Tích (ha)': l.area,
          'Tổng Chi Phí (VNĐ)': cost,
          'Chi Phí/ha (VNĐ)': l.area > 0 ? Math.round(cost / l.area) : 0,
          'Sản Lượng Thực Thu (kg)': l.actualYield,
          'Năng Suất/ha (kg)': l.area > 0 ? Math.round(l.actualYield / l.area) : 0,
        };
      });
    }

    if (exportData.length === 0) {
      toast.error('Không có dữ liệu phù hợp với bộ lọc để xuất');
      return;
    }

    exportToExcel(exportData, fileName);
    toast.success('Đã xuất báo cáo Excel thành công');
  };

  const handlePrint = () => {
    window.print();
  };

  const reportTabs = [
    { id: 'cost', label: '1. Báo cáo chi phí', icon: Wallet },
    { id: 'yield', label: '2. Báo cáo sản lượng', icon: Scale },
    { id: 'cost_per_kg', label: '3. Báo cáo giá thành (VNĐ/kg)', icon: TrendingUp },
    { id: 'efficiency', label: '4. Báo cáo hiệu quả kinh tế', icon: Percent },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs no-print">
        <div>
          <h1 className="text-xl font-bold text-strace-text">Báo cáo & Thống kê tài chính nông nghiệp</h1>
          <p className="text-xs text-strace-muted mt-1">
            Hệ thống phân tích chi phí, sản lượng thực thu và giá thành sản phẩm HTX Ea H'leo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-strace-text text-xs font-semibold rounded-xl border border-strace-border shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-strace-primary" />
            <span>In báo cáo</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as ReportType)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                isActive
                  ? 'bg-white border-strace-primary shadow-sm text-strace-primary'
                  : 'bg-white/60 border-strace-border text-strace-muted hover:bg-white hover:text-strace-text'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isActive ? 'bg-strace-accentGreen text-strace-deep' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Filter Bar for Reports */}
      <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-strace-text">
          <Filter className="w-4 h-4 text-strace-primary" />
          <span>Bộ lọc báo cáo:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Lọc Kỳ */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as any)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium"
          >
            <option value="all">Toàn bộ niên vụ 2026</option>
            <option value="q1">Quý 1 (T1 – T3)</option>
            <option value="q2">Quý 2 (T4 – T6)</option>
            <option value="q3">Quý 3 (T7 – T9)</option>
            <option value="q4">Quý 4 (T10 – T12)</option>
          </select>

          {/* Lọc Nông sản */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium"
          >
            <option value="all">Tất cả nông sản</option>
            <option value="Sầu riêng">Sầu riêng</option>
            <option value="Cà phê">Cà phê</option>
            <option value="Hồ tiêu">Hồ tiêu</option>
            <option value="Bơ">Bơ</option>
            <option value="Mắc ca">Mắc ca</option>
          </select>

          {/* Lọc Lô */}
          <select
            value={lotFilter}
            onChange={(e) => setLotFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium"
          >
            <option value="all">Tất cả lô sản xuất</option>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.code} — {l.name}
              </option>
            ))}
          </select>

          {(periodFilter !== 'all' || cropFilter !== 'all' || lotFilter !== 'all') && (
            <button
              onClick={() => {
                setPeriodFilter('all');
                setCropFilter('all');
                setLotFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline px-2"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Main Report Body */}
      <div className="print-area">
        {/* Printable Header only visible on print */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">HỢP TÁC XÃ NÔNG NGHIỆP & DỊCH VỤ EA H'LEO</h2>
          <p className="text-xs text-gray-500">Km 72, Quốc lộ 14, Thị trấn Ea Drăng, Huyện Ea H'leo, Đắk Lắk</p>
          <h3 className="text-lg font-bold mt-4 uppercase">
            BÁO CÁO PHÂN TÍCH KẾ TOÁN SỐ VÀ GIÁ THÀNH NÔNG SẢN
          </h3>
          <p className="text-xs">Ngày lập báo cáo: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        {reportType === 'cost' && (
          <CostReportSection lots={filteredLots} expenses={filteredExpenses} />
        )}
        {reportType === 'yield' && (
          <YieldReportSection lots={filteredLots} harvests={filteredHarvests} />
        )}
        {reportType === 'cost_per_kg' && (
          <CostPerKgReportSection
            lots={filteredLots}
            expenses={filteredExpenses}
            harvests={filteredHarvests}
          />
        )}
        {reportType === 'efficiency' && (
          <EfficiencyReportSection
            lots={filteredLots}
            expenses={filteredExpenses}
            harvests={filteredHarvests}
          />
        )}
      </div>
    </div>
  );
};
