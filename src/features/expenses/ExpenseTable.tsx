import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Sorting
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === 'date') {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / pageSize) || 1;
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy khoản chi phí nào"
        description="Thử thay đổi bộ lọc danh mục hoặc từ khóa tìm kiếm để xem các chi phí khác"
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
              <th
                className="py-3 px-4 cursor-pointer hover:text-strace-text select-none whitespace-nowrap"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Ngày</span>
                  {sortField === 'date' ? (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Mã CP</th>
              <th className="py-3 px-4 whitespace-nowrap">Khoản mục</th>
              <th className="py-3 px-4 whitespace-nowrap">Lô sản xuất</th>
              <th className="py-3 px-4 whitespace-nowrap">Nội dung chi</th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-strace-text select-none whitespace-nowrap"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Số tiền</span>
                  {sortField === 'amount' ? (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Người chi</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-strace-border text-xs">
            {paginatedExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="py-3 px-4 text-strace-muted font-medium whitespace-nowrap">
                  {formatDate(exp.date)}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-strace-muted text-[11px]">
                  {exp.code}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                    {exp.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-strace-primary whitespace-nowrap">
                  {exp.lotCode}
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <p className="font-semibold text-strace-text truncate">{exp.name}</p>
                  {exp.note && (
                    <p className="text-[11px] text-strace-subtle truncate mt-0.5">{exp.note}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-bold text-strace-text whitespace-nowrap">
                  {formatCurrency(exp.amount)}
                </td>
                <td className="py-3 px-4 text-strace-muted whitespace-nowrap">
                  {exp.executor}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(exp)}
                      className="p-1.5 text-strace-muted hover:text-strace-primary hover:bg-slate-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(exp.id)}
                      className="p-1.5 text-strace-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa khoản chi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={expenses.length}
        pageSize={pageSize}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Xóa khoản chi phí này?"
        message="Hành động này sẽ xóa khoản chi phí khỏi hệ thống. Tổng chi phí của lô tương ứng và biểu đồ sẽ tự động được tính toán lại."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy bỏ"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
