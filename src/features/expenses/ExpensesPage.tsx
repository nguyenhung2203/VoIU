import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Download,
  Filter,
  DollarSign,
  Package,
  Users,
  Layers,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { Expense, ExpenseCategory } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { SearchInput } from '../../components/common/SearchInput';
import { ExpenseTable } from './ExpenseTable';
import { ExpenseCategoryChart } from './ExpenseCategoryChart';
import { ExpenseLotDetailCard } from './ExpenseLotDetailCard';
import { ExpenseFormModal } from './ExpenseFormModal';
import { formatCurrency } from '../../utils/formatters';
import { exportToExcel } from '../../utils/exportExcel';
import { toast } from 'sonner';

export const ExpensesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lotFilter, setLotFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const lots = useAppStore((state) => state.lots);
  const expenses = useAppStore((state) => state.expenses);
  const harvests = useAppStore((state) => state.harvests);
  const addExpense = useAppStore((state) => state.addExpense);
  const updateExpense = useAppStore((state) => state.updateExpense);
  const deleteExpense = useAppStore((state) => state.deleteExpense);

  // Lọc chi phí
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // Tìm kiếm từ khóa
      const matchSearch =
        searchTerm === '' ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.executor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.supplier && e.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

      // Lọc danh mục
      const matchCategory = categoryFilter === 'all' || e.category === categoryFilter;

      // Lọc lô
      const matchLot = lotFilter === 'all' || e.lotId === lotFilter;

      // Lọc tháng
      const matchMonth =
        monthFilter === 'all' ||
        new Date(e.date).getMonth() + 1 === Number(monthFilter);

      return matchSearch && matchCategory && matchLot && matchMonth;
    });
  }, [expenses, searchTerm, categoryFilter, lotFilter, monthFilter]);

  // 4 KPI Chi phí
  const totalCost = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const fertilizerCost = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.category === 'Phân bón')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const laborCost = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.category === 'Nhân công')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const otherCost = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.category !== 'Phân bón' && e.category !== 'Nhân công')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Selected Lot object for Detail Card
  const selectedLot = useMemo(() => {
    if (lotFilter === 'all') return null;
    return lots.find((l) => l.id === lotFilter) || null;
  }, [lots, lotFilter]);

  // Export Excel
  const handleExportExcel = () => {
    if (filteredExpenses.length === 0) {
      toast.error('Không có dữ liệu chi phí để xuất Excel');
      return;
    }

    const excelData = filteredExpenses.map((e) => ({
      'Mã Chi Phí': e.code,
      'Ngày Phát Sinh': e.date,
      'Lô Sản Xuất': e.lotCode,
      'Khoản Mục': e.category,
      'Nội Dung Chi': e.name,
      'Số Tiền (VNĐ)': e.amount,
      'Người Thực Hiện': e.executor,
      'Nhà Cung Cấp': e.supplier || '',
      'Ghi Chú': e.note || '',
    }));

    const success = exportToExcel(excelData, `S_TRACE_Chi_Phi_${new Date().toISOString().split('T')[0]}`);
    if (success) {
      toast.success('Đã xuất file Excel chi phí thành công');
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast.success('Đã xóa khoản chi phí thành công');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-strace-text">Quản lý chi phí sản xuất</h1>
          <p className="text-xs text-strace-muted mt-1">
            Theo dõi, phân loại và phân tích chi phí canh tác nông nghiệp theo từng lô
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-strace-text text-xs font-semibold rounded-xl border border-strace-border shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-strace-primary" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm chi phí</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng chi phí"
          value={formatCurrency(totalCost)}
          subValue={`${filteredExpenses.length} khoản chi trong kỳ`}
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          trend={{ value: 5.8, label: 'toàn vụ' }}
        />
        <StatCard
          title="Chi phí phân bón"
          value={formatCurrency(fertilizerCost)}
          subValue={totalCost > 0 ? `${((fertilizerCost / totalCost) * 100).toFixed(1)}% tổng chi phí` : '0%'}
          icon={<Package className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Chi phí nhân công"
          value={formatCurrency(laborCost)}
          subValue={totalCost > 0 ? `${((laborCost / totalCost) * 100).toFixed(1)}% tổng chi phí` : '0%'}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Chi phí khác"
          value={formatCurrency(otherCost)}
          subValue="BVTV, tưới tiêu, giống, máy móc..."
          icon={<Layers className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm theo nội dung, mã CP, người chi, nhà cung cấp..."
          className="w-full sm:w-72"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          {/* Lọc danh mục */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Phân bón">Phân bón</option>
            <option value="Nhân công">Nhân công</option>
            <option value="Thuốc BVTV">Thuốc BVTV</option>
            <option value="Tưới tiêu">Tưới tiêu</option>
            <option value="Giống">Giống</option>
            <option value="Vận chuyển">Vận chuyển</option>
            <option value="Máy móc">Máy móc</option>
            <option value="Dịch vụ thuê ngoài">Dịch vụ thuê ngoài</option>
            <option value="Khác">Khác</option>
          </select>

          {/* Lọc Lô */}
          <select
            value={lotFilter}
            onChange={(e) => setLotFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả lô sản xuất</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.code} ({lot.cropType})
              </option>
            ))}
          </select>

          {/* Lọc Tháng */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>

          {(searchTerm || categoryFilter !== 'all' || lotFilter !== 'all' || monthFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setLotFilter('all');
                setMonthFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline px-2"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Table & Right Sidebar (Category Chart + Lot Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteExpense}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <ExpenseLotDetailCard
            selectedLot={selectedLot}
            expenses={expenses}
            harvests={harvests}
          />
          <ExpenseCategoryChart expenses={filteredExpenses} />
        </div>
      </div>

      {/* Form Dialog Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addExpense}
        onUpdate={updateExpense}
        editingExpense={editingExpense}
        lots={lots}
      />
    </div>
  );
};
