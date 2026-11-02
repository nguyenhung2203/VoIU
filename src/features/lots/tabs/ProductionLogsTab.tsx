import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Package,
  FileText,
  X,
  BookOpen,
} from 'lucide-react';
import { ProductionLot, ProductionLog, LogActivityType } from '../../../types';
import { useAppStore } from '../../../store/useStore';
import { formatDate } from '../../../utils/formatters';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { EmptyState } from '../../../components/common/EmptyState';
import { toast } from 'sonner';

interface ProductionLogsTabProps {
  lot: ProductionLot;
}

const ACTIVITY_TYPES: LogActivityType[] = [
  'Chuẩn bị đất',
  'Chăm sóc',
  'Bón phân',
  'Tưới nước',
  'Phun thuốc',
  'Kiểm tra sâu bệnh',
  'Thu hoạch',
  'Hoạt động khác',
];

export const ProductionLogsTab: React.FC<ProductionLogsTabProps> = ({ lot }) => {
  const allLogs = useAppStore((state) => state.logs);
  const addLog = useAppStore((state) => state.addLog);
  const updateLog = useAppStore((state) => state.updateLog);
  const deleteLog = useAppStore((state) => state.deleteLog);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ProductionLog | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityType, setActivityType] = useState<LogActivityType>('Chăm sóc');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [executor, setExecutor] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Lọc nhật ký của riêng lô này
  const lotLogs = allLogs
    .filter((l) => l.lotId === lot.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenAdd = () => {
    setEditingLog(null);
    setDate(new Date().toISOString().split('T')[0]);
    setActivityType('Chăm sóc');
    setTitle('');
    setContent('');
    setExecutor(lot.manager || 'Cán bộ kỹ thuật');
    setMaterialsUsed('');
    setImageUrl('');
    setIsPublic(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log: ProductionLog) => {
    setEditingLog(log);
    setDate(log.date);
    setActivityType(log.activityType);
    setTitle(log.title);
    setContent(log.content);
    setExecutor(log.executor);
    setMaterialsUsed(log.materialsUsed || '');
    setImageUrl(log.imageUrl || '');
    setIsPublic(log.isPublic);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng điền tiêu đề và nội dung nhật ký');
      return;
    }

    const payload = {
      lotId: lot.id,
      date,
      activityType,
      title: title.trim(),
      content: content.trim(),
      executor: executor.trim() || 'Cán bộ kỹ thuật',
      materialsUsed: materialsUsed.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      isPublic,
    };

    if (editingLog) {
      updateLog(editingLog.id, payload);
      toast.success('Đã cập nhật nhật ký canh tác');
    } else {
      addLog(payload);
      toast.success('Đã thêm nhật ký sản xuất mới');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteLog(deleteTargetId);
      setDeleteTargetId(null);
      toast.success('Đã xóa nhật ký canh tác');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-strace-text">Nhật ký canh tác điện tử</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {lotLogs.length} hoạt động
            </span>
          </div>
          <p className="text-xs text-strace-muted mt-1">
            Ghi chép minh bạch các công đoạn chăm sóc, bón phân, tưới nước và phòng trừ sâu bệnh
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhật ký</span>
        </button>
      </div>

      {/* Timeline of Logs */}
      {lotLogs.length === 0 ? (
        <EmptyState
          title="Chưa có nhật ký canh tác nào"
          description="Bắt đầu ghi nhận công việc làm đất, chăm sóc hoặc bón phân đầu tiên cho lô này"
          action={
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-strace-primary text-white text-xs font-semibold rounded-xl hover:bg-strace-deep transition-colors"
            >
              + Thêm nhật ký ngay
            </button>
          }
        />
      ) : (
        <div className="relative pl-6 space-y-6">
          {/* Central vertical line */}
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-emerald-200" />

          {lotLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Dot Icon */}
              <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-strace-primary flex items-center justify-center shrink-0 z-10 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-strace-primary" />
              </div>

              {/* Card Content */}
              <div className="bg-white rounded-2xl border border-strace-border p-5 shadow-card hover:shadow-cardHover transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-strace-accentGreen text-strace-deep border border-emerald-200">
                        {log.activityType}
                      </span>
                      <span className="text-xs text-strace-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(log.date)}
                      </span>
                      {log.isPublic ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Eye className="w-3 h-3" /> Công khai QR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <EyeOff className="w-3 h-3" /> Nội bộ
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-strace-text mt-1.5">{log.title}</h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(log)}
                      className="p-1.5 text-strace-muted hover:text-strace-primary hover:bg-slate-100 rounded-lg transition-colors"
                      title="Sửa nhật ký"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(log.id)}
                      className="p-1.5 text-strace-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa nhật ký"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-strace-text leading-relaxed whitespace-pre-line">
                  {log.content}
                </p>

                {/* Materials & Image if any */}
                {(log.materialsUsed || log.imageUrl) && (
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 items-start">
                    {log.materialsUsed && (
                      <div className="flex items-center gap-1.5 text-xs text-strace-muted bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <Package className="w-4 h-4 text-strace-primary shrink-0" />
                        <span>Vật tư: <strong className="text-strace-text font-medium">{log.materialsUsed}</strong></span>
                      </div>
                    )}
                    {log.imageUrl && (
                      <img
                        src={log.imageUrl}
                        alt={log.title}
                        className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-strace-subtle border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-strace-muted" />
                    Người thực hiện: <strong className="text-strace-muted font-medium">{log.executor}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa Nhật Ký */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-strace-border relative max-h-[90vh] overflow-y-auto my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-strace-subtle hover:text-strace-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-strace-accentGreen text-strace-deep">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-strace-text">
                  {editingLog ? 'Chỉnh sửa nhật ký canh tác' : 'Ghi nhận nhật ký mới'}
                </h3>
                <p className="text-xs text-strace-muted">Lô: {lot.code} — {lot.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-strace-text mb-1.5">Loại hoạt động</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as LogActivityType)}
                    className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-strace-text mb-1.5">Ngày thực hiện</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">
                  Tiêu đề hoạt động <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Bón phân thúc đợt 1, Xịt nano bạc phòng rầy..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">
                  Nội dung chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả cụ thể phương pháp, liều lượng, tình trạng thời tiết và cây trồng..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-strace-text mb-1.5">Người thực hiện</label>
                  <input
                    type="text"
                    value={executor}
                    onChange={(e) => setExecutor(e.target.value)}
                    className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-strace-text mb-1.5">Vật tư sử dụng (nếu có)</label>
                  <input
                    type="text"
                    placeholder="VD: Phân hữu cơ 50kg, Chế phẩm Trichoderma..."
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-strace-text mb-1.5">URL ảnh thực tế</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-strace-primary focus:ring-strace-primary/20"
                />
                <label htmlFor="isPublic" className="font-medium text-strace-text cursor-pointer select-none">
                  Cho phép công khai hoạt động này lên trang quét QR truy xuất nguồn gốc
                </label>
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
                  {editingLog ? 'Lưu cập nhật' : 'Ghi nhận nhật ký'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Xóa mục nhật ký này?"
        message="Mục nhật ký sẽ bị xóa khỏi lịch sử canh tác của lô sản xuất này."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
