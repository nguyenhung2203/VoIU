import React, { useState, useMemo } from 'react';
import {
  QrCode,
  Search,
  ExternalLink,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Layers,
  ScanLine,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { TraceabilityItem } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { SearchInput } from '../../components/common/SearchInput';
import { Pagination } from '../../components/common/Pagination';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const TraceabilityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [selectedTrace, setSelectedTrace] = useState<TraceabilityItem | null>(null);

  const traces = useAppStore((state) => state.traces);
  const lots = useAppStore((state) => state.lots);
  const togglePublishTrace = useAppStore((state) => state.togglePublishTrace);

  // Lọc
  const filteredTraces = useMemo(() => {
    return traces.filter((t) => {
      const matchSearch =
        searchTerm === '' ||
        t.traceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && t.isPublished) ||
        (statusFilter === 'draft' && !t.isPublished);

      return matchSearch && matchStatus;
    });
  }, [traces, searchTerm, statusFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredTraces.length / pageSize) || 1;
  const paginatedTraces = filteredTraces.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // KPI
  const totalTracesCount = traces.length;
  const publishedCount = traces.filter((t) => t.isPublished).length;
  const draftCount = traces.filter((t) => !t.isPublished).length;
  const totalScans = traces.reduce((sum, t) => sum + t.scanCount, 0);

  const handleTogglePublish = (trace: TraceabilityItem) => {
    togglePublishTrace(trace.id);
    toast.success(
      trace.isPublished
        ? `Đã ngừng công bố mã QR ${trace.traceCode}`
        : `Đã công bố công khai mã QR ${trace.traceCode}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-strace-text">Quản lý truy xuất nguồn gốc</h1>
          <p className="text-xs text-strace-muted mt-1">
            Minh bạch hành trình sản xuất nông sản từ vùng trồng đến người tiêu dùng
          </p>
        </div>

        <a
          href="/trace/TRACE-SR-001"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Xem trang công khai mẫu</span>
        </a>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng mã truy xuất"
          value={`${totalTracesCount} Mã`}
          subValue="Liên kết trực tiếp 12 lô nông nghiệp"
          icon={<QrCode className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Đã công bố công khai"
          value={`${publishedCount} Mã`}
          subValue="Sẵn sàng quét QR trên bao bì"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-teal-50 text-teal-700"
        />
        <StatCard
          title="Chưa công bố (Dự thảo)"
          value={`${draftCount} Mã`}
          subValue="Đang cập nhật thêm nhật ký vụ"
          icon={<XCircle className="w-5 h-5" />}
          iconBgColor="bg-slate-100 text-slate-700"
        />
        <StatCard
          title="Lượt quét mô phỏng"
          value={`${totalScans.toLocaleString('vi-VN')} lượt`}
          subValue="Tra cứu nhật ký từ người tiêu dùng"
          icon={<ScanLine className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-strace-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm theo mã QR, mã lô, tên nông sản..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 bg-slate-50 border border-strace-border rounded-xl text-strace-text font-medium focus:ring-1 focus:ring-strace-primary"
          >
            <option value="all">Tất cả trạng thái công bố</option>
            <option value="published">Đang công bố công khai</option>
            <option value="draft">Chưa công bố (Nội bộ)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                <th className="py-3.5 px-4">Mã truy xuất</th>
                <th className="py-3.5 px-4">Lô sản xuất</th>
                <th className="py-3.5 px-4">Sản phẩm & Khu vực</th>
                <th className="py-3.5 px-4">Ngày tạo</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Lượt quét</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {paginatedTraces.map((trace) => {
                const linkedLot = lots.find((l) => l.id === trace.lotId);

                return (
                  <tr key={trace.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-strace-primary whitespace-nowrap">
                      {trace.traceCode}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {trace.lotCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-strace-text">{trace.productName}</p>
                      <p className="text-[11px] text-strace-muted">
                        {linkedLot ? `${linkedLot.location}, ${linkedLot.region}` : "Ea H'leo, Đắk Lắk"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-strace-muted whitespace-nowrap">
                      {formatDate(trace.publishedDate)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {trace.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã công bố
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 text-slate-400" /> Chưa công bố
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-strace-text">
                      {trace.scanCount.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Xem QR Modal */}
                        <button
                          onClick={() => setSelectedTrace(trace)}
                          className="p-1.5 text-strace-muted hover:text-strace-primary hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Xem mã QR & In tem"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Mở trang công khai */}
                        <a
                          href={`/trace/${trace.traceCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-strace-muted hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Mở trang công khai cho người tiêu dùng"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        {/* Toggle Publish button */}
                        <button
                          onClick={() => handleTogglePublish(trace)}
                          className={`px-2 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                            trace.isPublished
                              ? 'text-slate-600 border-slate-200 hover:bg-slate-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {trace.isPublished ? 'Ngừng công bố' : 'Công bố'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTraces.length}
          pageSize={pageSize}
        />
      </div>

      {/* QR Code Modal (with Print Label support) */}
      <QRCodeModal
        isOpen={Boolean(selectedTrace)}
        onClose={() => setSelectedTrace(null)}
        traceItem={selectedTrace}
      />
    </div>
  );
};
