import React, { useState, useMemo } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
  Sprout,
  Download,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { CropType, LotStatus, ProductionLot } from '../../types';
import { SearchInput } from '../../components/common/SearchInput';
import { EmptyState } from '../../components/common/EmptyState';
import { LotCard } from './LotCard';
import { LotTable } from './LotTable';
import { LotFormModal } from './LotFormModal';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import { exportToExcel } from '../../utils/exportExcel';
import { toast } from 'sonner';

export const LotsListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLotForQR, setSelectedLotForQR] = useState<ProductionLot | null>(null);

  const lots = useAppStore((state) => state.lots);
  const expenses = useAppStore((state) => state.expenses);
  const harvests = useAppStore((state) => state.harvests);
  const traces = useAppStore((state) => state.traces);
  const addLot = useAppStore((state) => state.addLot);

  // Danh sách các vùng trồng duy nhất
  const uniqueLocations = useMemo(() => {
    const locs = lots.map((l) => l.location.split(',')[1]?.trim() || l.location);
    return Array.from(new Set(locs));
  }, [lots]);

  // Lọc danh sách lô
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchSearch =
        searchTerm === '' ||
        lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.manager.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCrop = cropFilter === 'all' || lot.cropType === cropFilter;
      const matchStatus = statusFilter === 'all' || lot.status === statusFilter;
      const matchRegion =
        regionFilter === 'all' || lot.location.includes(regionFilter);

      return matchSearch && matchCrop && matchStatus && matchRegion;
    });
  }, [lots, searchTerm, cropFilter, statusFilter, regionFilter]);

  // Tìm trace item tương ứng với selectedLotForQR
  const currentTraceItem = useMemo(() => {
    if (!selectedLotForQR) return null;
    return traces.find((t) => t.lotId === selectedLotForQR.id) || null;
  }, [traces, selectedLotForQR]);

  // Xuất Excel danh sách lô
  const handleExportExcel = () => {
    if (filteredLots.length === 0) {
      toast.error('Không có dữ liệu lô sản xuất để xuất Excel');
      return;
    }

    const data = filteredLots.map((l) => ({
      'Mã Lô': l.code,
      'Tên Lô Sản Xuất': l.name,
      'Loại Nông Sản': l.cropType,
      'Giống': l.variety,
      'Diện Tích (ha)': l.area,
      'Địa Điểm': `${l.location}, ${l.region}`,
      'Số Hộ Liên Kết': l.associatedHouseholds,
      'Ngày Bắt Đầu': l.seasonStartDate,
      'Dự Kiến Thu Hoạch': l.expectedHarvestDate,
      'Sản Lượng Dự Kiến (kg)': l.expectedYield,
      'Sản Lượng Thực Tế (kg)': l.actualYield,
      'Trạng Thái': l.status,
      'Người Quản Lý': l.manager,
    }));

    exportToExcel(data, `S_TRACE_Danh_Sach_Lo_${new Date().toISOString().split('T')[0]}`);
    toast.success('Đã xuất file Excel danh sách lô sản xuất');
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-strace-text">Quản lý lô sản xuất</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {lots.length} lô
            </span>
          </div>
          <p className="text-xs text-strace-muted mt-1">
            Theo dõi diện tích vùng trồng, quy trình canh tác và hành trình thu hoạch nông sản
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-strace-text text-xs font-semibold rounded-xl border border-strace-border shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-strace-primary" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-strace-primary shadow-xs font-bold'
                  : 'text-strace-muted hover:text-strace-text'
              }`}
              title="Xem dạng thẻ (Card View)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-strace-primary shadow-xs font-bold'
                  : 'text-strace-muted hover:text-strace-text'
              }`}
              title="Xem dạng bảng (Table View)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lô sản xuất</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm mã lô, tên vườn, giống cây, địa điểm..."
          className="w-full sm:w-80"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          {/* Lọc loại nông sản */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả nông sản</option>
            <option value="Sầu riêng">Sầu riêng</option>
            <option value="Cà phê">Cà phê</option>
            <option value="Hồ tiêu">Hồ tiêu</option>
            <option value="Bơ">Bơ</option>
            <option value="Mắc ca">Mắc ca</option>
          </select>

          {/* Lọc trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="in_progress">Đang sản xuất</option>
            <option value="harvested">Đã thu hoạch</option>
            <option value="completed">Hoàn thành vụ</option>
            <option value="planning">Lên kế hoạch</option>
            <option value="paused">Tạm dừng</option>
          </select>

          {/* Lọc khu vực */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả xã / vùng trồng</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {(searchTerm || cropFilter !== 'all' || statusFilter !== 'all' || regionFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCropFilter('all');
                setStatusFilter('all');
                setRegionFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline px-2"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredLots.length === 0 ? (
        <EmptyState
          title="Không tìm thấy lô sản xuất phù hợp"
          description="Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để hiển thị danh sách đầy đủ 12 lô"
          action={
            <button
              onClick={() => {
                setSearchTerm('');
                setCropFilter('all');
                setStatusFilter('all');
                setRegionFilter('all');
              }}
              className="px-4 py-2 bg-strace-primary text-white text-xs font-semibold rounded-xl hover:bg-strace-deep transition-colors"
            >
              Xóa bộ lọc
            </button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              expenses={expenses}
              harvests={harvests}
              onOpenQuickQR={(l) => setSelectedLotForQR(l)}
            />
          ))}
        </div>
      ) : (
        <LotTable
          lots={filteredLots}
          expenses={expenses}
          harvests={harvests}
          onOpenQuickQR={(l) => setSelectedLotForQR(l)}
        />
      )}

      {/* Form Dialog Modal */}
      <LotFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addLot}
        existingLots={lots}
      />

      {/* QR Code Quick Modal */}
      <QRCodeModal
        isOpen={Boolean(selectedLotForQR && currentTraceItem)}
        onClose={() => setSelectedLotForQR(null)}
        traceItem={currentTraceItem}
      />
    </div>
  );
};
