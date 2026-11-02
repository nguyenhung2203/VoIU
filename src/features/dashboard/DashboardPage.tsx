import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Sprout,
  TrendingUp,
  Scale,
  Calendar,
  Filter,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { StatCard } from '../../components/common/StatCard';
import { CostDistributionChart } from './CostDistributionChart';
import { ProductionYieldChart } from './ProductionYieldChart';
import { RecentLotsTable } from './RecentLotsTable';
import { RecentActivitiesTimeline } from './RecentActivitiesTimeline';
import {
  formatCurrency,
  formatWeight,
  formatUnitPrice,
} from '../../utils/formatters';
import { calculateAverageCostPerKg } from '../../utils/calculations';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<'all' | '2026' | 'q1' | 'q2' | 'q3' | 'q4'>('all');

  const lots = useAppStore((state) => state.lots);
  const expenses = useAppStore((state) => state.expenses);
  const harvests = useAppStore((state) => state.harvests);
  const activities = useAppStore((state) => state.activities);

  // Lọc dữ liệu theo kỳ được chọn
  const filteredExpenses = useMemo(() => {
    if (periodFilter === 'all' || periodFilter === '2026') return expenses;
    return expenses.filter((e) => {
      const month = new Date(e.date).getMonth() + 1;
      if (periodFilter === 'q1') return month >= 1 && month <= 3;
      if (periodFilter === 'q2') return month >= 4 && month <= 6;
      if (periodFilter === 'q3') return month >= 7 && month <= 9;
      if (periodFilter === 'q4') return month >= 10 && month <= 12;
      return true;
    });
  }, [expenses, periodFilter]);

  const filteredHarvests = useMemo(() => {
    if (periodFilter === 'all' || periodFilter === '2026') return harvests;
    return harvests.filter((h) => {
      const month = new Date(h.date).getMonth() + 1;
      if (periodFilter === 'q1') return month >= 1 && month <= 3;
      if (periodFilter === 'q2') return month >= 4 && month <= 6;
      if (periodFilter === 'q3') return month >= 7 && month <= 9;
      if (periodFilter === 'q4') return month >= 10 && month <= 12;
      return true;
    });
  }, [harvests, periodFilter]);

  // Tính 4 KPI chính
  const totalCost = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalLotsCount = lots.length;
  const inProgressLotsCount = lots.filter((l) => l.status === 'in_progress').length;
  const harvestedLotsCount = lots.filter(
    (l) => l.status === 'harvested' || l.status === 'completed'
  ).length;

  const totalHarvestYieldKg = useMemo(() => {
    return filteredHarvests.reduce((sum, h) => sum + h.yieldKg, 0);
  }, [filteredHarvests]);

  // Giá thành bình quân = Tổng chi phí các lô đã thu hoạch / Tổng sản lượng thực thu
  const avgCostPerKg = useMemo(() => {
    return calculateAverageCostPerKg(lots, filteredExpenses, filteredHarvests);
  }, [lots, filteredExpenses, filteredHarvests]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-strace-text">Tổng quan HTX Nông nghiệp</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Ea H'leo
            </span>
          </div>
          <p className="text-xs text-strace-muted mt-1">
            Bảng điều hành số liệu kế toán chi phí, sản lượng thực thu và giá thành bình quân
          </p>
        </div>

        {/* Period Selector & Action */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-strace-muted overflow-x-auto max-w-full">
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodFilter === 'all'
                  ? 'bg-white text-strace-dark font-bold shadow-xs'
                  : 'hover:text-strace-text'
              }`}
            >
              Cả năm 2026
            </button>
            <button
              onClick={() => setPeriodFilter('q1')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                periodFilter === 'q1'
                  ? 'bg-white text-strace-dark font-bold shadow-xs'
                  : 'hover:text-strace-text'
              }`}
            >
              Quý 1
            </button>
            <button
              onClick={() => setPeriodFilter('q2')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                periodFilter === 'q2'
                  ? 'bg-white text-strace-dark font-bold shadow-xs'
                  : 'hover:text-strace-text'
              }`}
            >
              Quý 2
            </button>
            <button
              onClick={() => setPeriodFilter('q3')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                periodFilter === 'q3'
                  ? 'bg-white text-strace-dark font-bold shadow-xs'
                  : 'hover:text-strace-text'
              }`}
            >
              Quý 3
            </button>
            <button
              onClick={() => setPeriodFilter('q4')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                periodFilter === 'q4'
                  ? 'bg-white text-strace-dark font-bold shadow-xs'
                  : 'hover:text-strace-text'
              }`}
            >
              Quý 4
            </button>
          </div>

          <Link
            to="/expenses"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm chi phí</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng chi phí */}
        <StatCard
          title="Tổng chi phí sản xuất"
          value={formatCurrency(totalCost)}
          subValue={`${filteredExpenses.length} khoản chi phí đã phát sinh`}
          trend={{ value: 8.4, label: 'so với kỳ trước', isPositive: false }}
          icon={<Wallet className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-700"
          sparklineData={[35, 42, 60, 48, 85, 70, 95]}
          tooltipText="Tổng hợp toàn bộ các khoản chi phân bón, nhân công, giống, tưới tiêu, BVTV..."
        />

        {/* KPI 2: Số lô sản xuất */}
        <StatCard
          title="Quy mô lô sản xuất"
          value={`${totalLotsCount} Lô`}
          subValue={`${inProgressLotsCount} đang canh tác • ${harvestedLotsCount} đã thu hoạch`}
          trend={{ value: 12.0, label: 'tăng trưởng vùng trồng', isPositive: true }}
          icon={<Sprout className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          sparklineData={[8, 9, 10, 11, 12, 12, 12]}
          tooltipText="Tổng số lô vùng trồng đang áp dụng quản lý số hoá và liên kết hộ nông dân"
        />

        {/* KPI 3: Sản lượng thực tế */}
        <StatCard
          title="Sản lượng thực thu"
          value={formatWeight(totalHarvestYieldKg)}
          subValue={`${filteredHarvests.length} đợt thu hoạch đã hoàn tất`}
          trend={{ value: 15.2, label: 'vượt chỉ tiêu kế hoạch', isPositive: true }}
          icon={<Scale className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
          sparklineData={[0, 0, 15, 30, 45, 65, 87]}
          tooltipText="Tổng sản lượng thực tế đã thu hoạch và đóng gói xuất bán (không tính sản lượng dự kiến)"
        />

        {/* KPI 4: Giá thành bình quân */}
        <StatCard
          title="Giá thành bình quân"
          value={avgCostPerKg !== null ? formatUnitPrice(avgCostPerKg) : 'Chưa đủ dữ liệu'}
          subValue="Tính trên các lô đã hoàn tất thu hoạch"
          trend={{ value: -4.2, label: 'tối ưu hơn niên vụ trước', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-teal-50 text-teal-700"
          sparklineData={[22, 21, 19, 18, 17, 16.5, 16.2]}
          tooltipText="Công thức chuẩn: Tổng chi phí phân bổ cho các lô đã thu hoạch chia cho Tổng sản lượng thực thu"
        />
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostDistributionChart expenses={filteredExpenses} />
        <ProductionYieldChart harvests={filteredHarvests} />
      </div>

      {/* Recent Lots Table & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLotsTable lots={lots} expenses={filteredExpenses} harvests={filteredHarvests} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivitiesTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
};
