import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sprout } from 'lucide-react';
import { ProductionLot, CropType, LotStatus } from '../../types';
import { toast } from 'sonner';

interface LotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProductionLot, 'id' | 'actualYield' | 'createdAt'>) => void;
  onUpdate?: (id: string, data: Partial<ProductionLot>) => void;
  editingLot?: ProductionLot | null;
  existingLots: ProductionLot[];
}

const CROPS: CropType[] = ['Sầu riêng', 'Cà phê', 'Hồ tiêu', 'Bơ', 'Mắc ca'];

const STATUSES: { value: LotStatus; label: string }[] = [
  { value: 'planning', label: 'Lên kế hoạch' },
  { value: 'in_progress', label: 'Đang sản xuất' },
  { value: 'harvested', label: 'Đã thu hoạch' },
  { value: 'completed', label: 'Hoàn thành vụ' },
  { value: 'paused', label: 'Tạm dừng' },
];

export const LotFormModal: React.FC<LotFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingLot,
  existingLots,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState<CropType>('Sầu riêng');
  const [variety, setVariety] = useState('');
  const [area, setArea] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState("Ea H'leo, Đắk Lắk");
  const [seasonStartDate, setSeasonStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [expectedYield, setExpectedYield] = useState<number | ''>('');
  const [associatedHouseholds, setAssociatedHouseholds] = useState<number>(3);
  const [manager, setManager] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<LotStatus>('in_progress');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingLot) {
      setCode(editingLot.code);
      setName(editingLot.name);
      setCropType(editingLot.cropType);
      setVariety(editingLot.variety);
      setArea(editingLot.area);
      setLocation(editingLot.location);
      setRegion(editingLot.region);
      setSeasonStartDate(editingLot.seasonStartDate);
      setExpectedHarvestDate(editingLot.expectedHarvestDate);
      setExpectedYield(editingLot.expectedYield);
      setAssociatedHouseholds(editingLot.associatedHouseholds);
      setManager(editingLot.manager);
      setDescription(editingLot.description);
      setStatus(editingLot.status);
      setImageUrl(editingLot.imageUrl);
    } else {
      // Tự động sinh mã gợi ý
      const nextNum = existingLots.length + 1;
      setCode(`SR-DL-${String(nextNum).padStart(3, '0')}`);
      setName('');
      setCropType('Sầu riêng');
      setVariety('Ri6 cơm vàng hạt lép');
      setArea(2.0);
      setLocation('Xã Ea Sol');
      setRegion("Ea H'leo, Đắk Lắk");
      setSeasonStartDate(new Date().toISOString().split('T')[0]);
      setExpectedHarvestDate('');
      setExpectedYield(20000);
      setAssociatedHouseholds(4);
      setManager('Nguyễn Văn Định');
      setDescription('');
      setStatus('in_progress');
      setImageUrl('https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80');
    }
    setErrors({});
  }, [editingLot, isOpen, existingLots]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!code.trim()) err.code = 'Mã lô không được để trống';
    else {
      // Check duplicate code
      const isDuplicate = existingLots.some(
        (l) => l.code.toUpperCase() === code.trim().toUpperCase() && l.id !== editingLot?.id
      );
      if (isDuplicate) err.code = 'Mã lô đã tồn tại trong hệ thống';
    }

    if (!name.trim()) err.name = 'Vui lòng nhập tên lô';
    if (!area || Number(area) <= 0) err.area = 'Diện tích phải lớn hơn 0 ha';
    if (!seasonStartDate) err.seasonStartDate = 'Vui lòng chọn ngày bắt đầu';
    if (!expectedHarvestDate) err.expectedHarvestDate = 'Vui lòng chọn ngày dự kiến thu hoạch';
    else if (new Date(expectedHarvestDate) < new Date(seasonStartDate)) {
      err.expectedHarvestDate = 'Ngày dự kiến thu hoạch không được trước ngày bắt đầu mùa vụ';
    }
    if (!expectedYield || Number(expectedYield) <= 0) {
      err.expectedYield = 'Sản lượng dự kiến phải lớn hơn 0 kg';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại các trường thông tin');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      cropType,
      variety: variety.trim() || cropType,
      area: Number(area),
      location: location.trim() || 'Huyện Ea H\'leo',
      region: region.trim() || 'Đắk Lắk',
      seasonStartDate,
      expectedHarvestDate,
      expectedYield: Number(expectedYield),
      associatedHouseholds: Number(associatedHouseholds) || 1,
      manager: manager.trim() || 'Ban kỹ thuật HTX',
      description: description.trim(),
      status,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80',
    };

    if (editingLot && onUpdate) {
      onUpdate(editingLot.id, payload);
      toast.success(`Đã cập nhật lô sản xuất ${payload.code}`);
    } else {
      onSubmit(payload);
      toast.success(`Đã tạo mới lô sản xuất ${payload.code}`);
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-strace-border relative max-h-[92vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-strace-subtle hover:text-strace-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-strace-accentGreen text-strace-deep">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-strace-text">
              {editingLot ? `Chỉnh sửa lô: ${editingLot.code}` : 'Thêm mới lô sản xuất nông nghiệp'}
            </h3>
            <p className="text-xs text-strace-muted">
              Quản lý quy chuẩn vùng trồng, diện tích canh tác và dự kiến sản lượng
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Mã lô & Tên lô */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Mã lô sản xuất <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: SR-DL-001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-primary font-mono font-bold uppercase"
              />
              {errors.code && <p className="text-rose-600 mt-1">{errors.code}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-strace-text mb-1.5">
                Tên lô sản xuất <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Vườn sầu riêng Ri6 - Đồi 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
              />
              {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Loại cây & Giống & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Loại nông sản <span className="text-rose-500">*</span>
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">Giống cây trồng</label>
              <input
                type="text"
                placeholder="VD: Ri6 hạt lép, Monthong, Robusta TRS1..."
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">Trạng thái canh tác</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LotStatus)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-medium"
              >
                {STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Diện tích & Sản lượng dự kiến & Hộ liên kết */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Diện tích (ha) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="VD: 2.5"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-bold"
              />
              {errors.area && <p className="text-rose-600 mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Sản lượng dự kiến (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="100"
                min="100"
                placeholder="VD: 25000"
                value={expectedYield}
                onChange={(e) => setExpectedYield(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-bold text-emerald-700"
              />
              {errors.expectedYield && <p className="text-rose-600 mt-1">{errors.expectedYield}</p>}
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">Số hộ liên kết</label>
              <input
                type="number"
                min="1"
                value={associatedHouseholds}
                onChange={(e) => setAssociatedHouseholds(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
            </div>
          </div>

          {/* Ngày bắt đầu & Ngày dự kiến thu hoạch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Ngày bắt đầu mùa vụ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={seasonStartDate}
                onChange={(e) => setSeasonStartDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
              {errors.seasonStartDate && <p className="text-rose-600 mt-1">{errors.seasonStartDate}</p>}
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">
                Ngày dự kiến thu hoạch <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={expectedHarvestDate}
                onChange={(e) => setExpectedHarvestDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
              {errors.expectedHarvestDate && (
                <p className="text-rose-600 mt-1">{errors.expectedHarvestDate}</p>
              )}
            </div>
          </div>

          {/* Địa điểm & Người quản lý */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-strace-text mb-1.5">Địa điểm vùng trồng</label>
              <input
                type="text"
                placeholder="VD: Thôn 4, Xã Ea Sol"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
            </div>

            <div>
              <label className="block font-semibold text-strace-text mb-1.5">Cán bộ phụ trách</label>
              <input
                type="text"
                placeholder="VD: Trần Văn Mạnh"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text"
              />
            </div>
          </div>

          {/* Image URL & Description */}
          <div>
            <label className="block font-semibold text-strace-text mb-1.5">URL ảnh minh họa</label>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-strace-text mb-1.5">Mô tả quy trình canh tác</label>
            <textarea
              rows={2}
              placeholder="Mô tả chất đất, hệ thống tưới, quy trình tiêu chuẩn VietGAP..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-strace-border rounded-xl focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary text-strace-text resize-none"
            />
          </div>

          {/* Actions */}
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
              {editingLot ? 'Lưu thay đổi' : 'Tạo lô sản xuất'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
