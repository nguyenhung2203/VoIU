import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Receipt, AlertCircle } from 'lucide-react';
import { Expense, ExpenseCategory, ProductionLot } from '../../types';
import { toast } from 'sonner';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'code' | 'createdAt'>) => void;
  onUpdate?: (id: string, data: Partial<Expense>) => void;
  editingExpense?: Expense | null;
  lots: ProductionLot[];
}

const CATEGORIES: ExpenseCategory[] = [
  'Phân bón',
  'Nhân công',
  'Thuốc BVTV',
  'Tưới tiêu',
  'Giống',
  'Vận chuyển',
  'Máy móc',
  'Dịch vụ thuê ngoài',
  'Khác',
];

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingExpense,
  lots,
}) => {
  const [lotId, setLotId] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Phân bón');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [executor, setExecutor] = useState('');
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingExpense) {
      setLotId(editingExpense.lotId);
      setCategory(editingExpense.category);
      setName(editingExpense.name);
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
      setExecutor(editingExpense.executor);
      setSupplier(editingExpense.supplier || '');
      setNote(editingExpense.note || '');
    } else {
      setLotId(lots[0]?.id || '');
      setCategory('Phân bón');
      setName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setExecutor('Kế toán HTX');
      setSupplier('');
      setNote('');
    }
    setErrors({});
  }, [editingExpense, isOpen, lots]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!lotId) err.lotId = 'Vui lòng chọn lô sản xuất';
    if (!name.trim()) err.name = 'Vui lòng nhập tên khoản chi';
    if (!amount || Number(amount) <= 0) err.amount = 'Số tiền phải lớn hơn 0 VNĐ';
    if (!date) err.date = 'Vui lòng chọn ngày phát sinh';
    if (!executor.trim()) err.executor = 'Vui lòng nhập người thực hiện';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }

    const selectedLot = lots.find((l) => l.id === lotId);
    const lotCode = selectedLot?.code || '';

    const payload = {
      lotId,
      lotCode,
      category,
      name: name.trim(),
      amount: Number(amount),
      date,
      executor: executor.trim(),
      supplier: supplier.trim() || undefined,
      note: note.trim() || undefined,
    };

    if (editingExpense && onUpdate) {
      onUpdate(editingExpense.id, payload);
      toast.success('Cập nhật khoản chi phí thành công');
    } else {
      onSubmit(payload);
      toast.success('Thêm mới khoản chi phí thành công');
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-strace-border relative max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-strace-subtle hover:text-strace-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-strace-accentGreen text-strace-deep">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-strace-text">
              {editingExpense ? 'Chỉnh sửa khoản chi phí' : 'Thêm mới chi phí sản xuất'}
            </h3>
            <p className="text-xs text-strace-muted">
              {editingExpense ? `Mã phiếu: ${editingExpense.code}` : 'Nhập chứng từ chi tiêu canh tác nông nghiệp'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Lô sản xuất */}
          <div>
            <label className="block font-semibold text-strace-text mb-1.5">
              Lô sản xuất liên kết <span className="text-rose-500">*</span>
            </label>
            <select
              value={lotId}
              onChange={(e) => setLotId(e.target.value)}
              className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
            >
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code} — {l.name} ({l.cropType})
                </option>
              ))}
            </select>
            {errors.lotId && <p className="text-rose-600 mt-1">{errors.lotId}</p>}
          </div>

          {/* Danh mục & Ngày phát sinh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Khoản mục chi phí <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Ngày phát sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
              />
              {errors.date && <p className="text-rose-600 mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Tên khoản chi */}
          <div>
            <label className="block font-semibold text-strace-text mb-1.5">
              Nội dung khoản chi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Mua phân hữu cơ vi sinh bón đón hoa, Thuê nhân công hái..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
            />
            {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Số tiền VNĐ */}
          <div>
            <label className="block font-semibold text-strace-text mb-1.5">
              Số tiền (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="1000"
                placeholder="Nhập số tiền VNĐ (lớn hơn 0)..."
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2.5 pr-14 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-bold text-sm"
              />
              <span className="absolute right-3 top-3 text-strace-muted font-bold">VNĐ</span>
            </div>
            {errors.amount && <p className="text-rose-600 mt-1">{errors.amount}</p>}
          </div>

          {/* Người thực hiện & Nhà cung cấp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Người phụ trách / Người chi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Trần Văn Mạnh"
                value={executor}
                onChange={(e) => setExecutor(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
              {errors.executor && <p className="text-rose-600 mt-1">{errors.executor}</p>}
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Nhà cung cấp / Đối tác
              </label>
              <input
                type="text"
                placeholder="VD: Phân Bón Bình Điền, Đại lý VTNN..."
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block font-semibold text-strace-text mb-1.5">Ghi chú chi tiết</label>
            <textarea
              rows={2}
              placeholder="Ghi chú số lượng vật tư, hóa đơn chứng từ kèm theo..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-medium text-strace-muted hover:text-strace-text hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-strace-primary hover:bg-strace-deep rounded-xl shadow-xs transition-colors"
            >
              {editingExpense ? 'Lưu thay đổi' : 'Lưu khoản chi'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
