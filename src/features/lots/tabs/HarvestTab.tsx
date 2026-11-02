import React, { useState } from 'react';
import { Plus, Trash2, Scale, Calendar, User, Award, X, ShoppingBag } from 'lucide-react';
import { ProductionLot, HarvestRecord } from '../../../types';
import { useAppStore } from '../../../store/useStore';
import { formatDate, formatWeight } from '../../../utils/formatters';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { EmptyState } from '../../../components/common/EmptyState';
import { toast } from 'sonner';

interface HarvestTabProps {
  lot: ProductionLot;
}

const QUALITY_GRADES: HarvestRecord['qualityGrade'][] = [
  'Đạt chuẩn xuất khẩu',
  'Loại 1',
  'Loại 2',
  'Loại 3',
];

export const HarvestTab: React.FC<HarvestTabProps> = ({ lot }) => {
  const allHarvests = useAppStore((state) => state.harvests);
  const addHarvest = useAppStore((state) => state.addHarvest);
  const deleteHarvest = useAppStore((state) => state.deleteHarvest);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [yieldKg, setYieldKg] = useState<number | ''>('');
  const [qualityGrade, setQualityGrade] = useState<HarvestRecord['qualityGrade']>('Đạt chuẩn xuất khẩu');
  const [recordedBy, setRecordedBy] = useState(lot.manager || 'Tổ trưởng thu hoạch');
  const [note, setNote] = useState('');

  // Lọc các đợt thu hoạch của riêng lô
  const lotHarvests = allHarvests
    .filter((h) => h.lotId === lot.id)
    .sort((a, b) => a.batchNumber - b.batchNumber);

  const totalActualYield = lotHarvests.reduce((sum, h) => sum + h.yieldKg, 0);
  const nextBatchNumber = lotHarvests.length + 1;

  const handleOpenAdd = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setYieldKg('');
    setQualityGrade('Đạt chuẩn xuất khẩu');
    setRecordedBy(lot.manager || 'Tổ trưởng thu hoạch');
    setNote('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yieldKg || Number(yieldKg) <= 0) {
      toast.error('Sản lượng thu hoạch phải lớn hơn 0 kg');
      return;
    }

    addHarvest({
      lotId: lot.id,
      batchNumber: nextBatchNumber,
      date,
      yieldKg: Number(yieldKg),
      qualityGrade,
      recordedBy: recordedBy.trim() || 'Tổ trưởng thu hoạch',
      note: note.trim() || undefined,
    });

    toast.success(`Đã ghi nhận thu hoạch đợt ${nextBatchNumber}: ${Number(yieldKg).toLocaleString('vi-VN')} kg`);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteHarvest(deleteTargetId);
      setDeleteTargetId(null);
      toast.success('Đã xóa bản ghi đợt thu hoạch');
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Tổng thực thu</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {formatWeight(totalActualYield)}
          </p>
          <p className="text-xs text-strace-muted mt-1">{lotHarvests.length} đợt đã ghi nhận</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Chỉ tiêu kế hoạch</span>
          <p className="text-2xl font-bold text-strace-text mt-1">
            {formatWeight(lot.expectedYield)}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            Đạt {lot.expectedYield > 0 ? ((totalActualYield / lot.expectedYield) * 100).toFixed(1) : 0}% kế hoạch
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Chênh lệch sản lượng</span>
          <p
            className={`text-2xl font-bold mt-1 ${
              totalActualYield >= lot.expectedYield ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {totalActualYield >= lot.expectedYield ? '+' : ''}
            {formatWeight(totalActualYield - lot.expectedYield)}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            {totalActualYield >= lot.expectedYield ? 'Vượt chỉ tiêu ban đầu' : 'Chưa đạt hoặc đang thu tiếp'}
          </p>
        </div>
      </div>

      {/* Table & Actions */}
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-strace-border flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-strace-text">Lịch sử các đợt thu hoạch</h4>
            <p className="text-xs text-strace-muted mt-0.5">
              Tất cả các đợt cân thu mua từ nhà vườn về kho đóng gói
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhận đợt thu hoạch</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                <th className="py-3 px-4">Đợt</th>
                <th className="py-3 px-4">Ngày thu hoạch</th>
                <th className="py-3 px-4 text-right">Sản lượng (kg)</th>
                <th className="py-3 px-4">Phẩm cấp chất lượng</th>
                <th className="py-3 px-4">Người ghi nhận</th>
                <th className="py-3 px-4">Ghi chú</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {lotHarvests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-strace-muted">
                    Lô này chưa ghi nhận đợt thu hoạch nào. Nhấn nút bên trên để tạo đợt thu hoạch đầu tiên.
                  </td>
                </tr>
              ) : (
                lotHarvests.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-4 font-bold text-strace-dark">
                      Đợt {h.batchNumber}
                    </td>
                    <td className="py-3 px-4 text-strace-muted font-medium">
                      {formatDate(h.date)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-700 text-sm">
                      {formatWeight(h.yieldKg)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {h.qualityGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-strace-text">
                      {h.recordedBy}
                    </td>
                    <td className="py-3 px-4 text-strace-muted max-w-xs truncate">
                      {h.note || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setDeleteTargetId(h.id)}
                        className="p-1.5 text-strace-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa đợt thu hoạch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ghi nhận đợt thu hoạch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-strace-border relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-strace-subtle hover:text-strace-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-strace-accentGreen text-strace-deep">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-strace-text">Ghi nhận đợt thu hoạch</h3>
                <p className="text-xs text-strace-muted">
                  Đợt {nextBatchNumber} — Lô {lot.code}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-strace-text mb-1.5">
                  Ngày thu hoạch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
                />
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">
                  Sản lượng thu hoạch (kg) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="VD: 5000"
                    value={yieldKg}
                    onChange={(e) => setYieldKg(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 pr-12 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-emerald-800 font-bold text-base"
                  />
                  <span className="absolute right-3 top-3 text-strace-muted font-bold">kg</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">Phẩm cấp chất lượng</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as HarvestRecord['qualityGrade'])}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
                >
                  {QUALITY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">Người phụ trách ghi nhận</label>
                <input
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
                />
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">Ghi chú đợt thu hoạch</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú độ chín, tỷ lệ trái xuất khẩu, độ brix, đơn vị thu mua..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-strace-muted hover:text-strace-text hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-strace-primary hover:bg-strace-deep rounded-xl shadow-xs transition-colors"
                >
                  Lưu đợt thu hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Xóa đợt thu hoạch này?"
        message="Hệ thống sẽ cập nhật lại tổng sản lượng thực tế của lô và tính toán lại giá thành sản xuất."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
