import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Leaf,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Award,
  ChevronRight,
  AlertTriangle,
  QrCode,
  Package,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { formatDate, formatArea, formatWeight } from '../../utils/formatters';

export const PublicTracePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  const traces = useAppStore((state) => state.traces);
  const lots = useAppStore((state) => state.lots);
  const logs = useAppStore((state) => state.logs);
  const cooperative = useAppStore((state) => state.cooperative);

  // Tìm bản ghi truy xuất
  const trace = traces.find(
    (t) => t.traceCode.toUpperCase() === code?.toUpperCase()
  );

  const lot = trace ? lots.find((l) => l.id === trace.lotId) : null;

  // Lấy các nhật ký công khai của lô này
  const publicLogs = useMemo(() => {
    if (!lot) return [];
    return logs
      .filter((l) => l.lotId === lot.id && l.isPublic)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs, lot]);

  if (!trace || !lot) {
    return (
      <div className="min-h-screen bg-[#F6F8F7] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-strace-text">Không tìm thấy mã truy xuất</h2>
        <p className="text-xs text-strace-muted mt-2 max-w-sm">
          Mã <span className="font-mono font-bold text-rose-600">{code}</span> không tồn tại trên hệ thống hoặc đã bị hủy hiệu lực.
        </p>
        <Link
          to="/"
          className="mt-6 px-5 py-2.5 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          Về trang chủ S-TRACE
        </Link>
      </div>
    );
  }

  // Nếu lô bị hủy công bố
  if (!trace.isPublished) {
    return (
      <div className="min-h-screen bg-[#F6F8F7] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-strace-text">Dữ liệu tạm ngưng công bố</h2>
        <p className="text-xs text-strace-muted mt-2 max-w-sm">
          Lô nông sản <span className="font-mono font-bold">{trace.lotCode}</span> đang trong quá trình cập nhật hồ sơ kiểm định mùa vụ mới. Vui lòng thử lại sau.
        </p>
        <Link
          to="/"
          className="mt-6 px-5 py-2.5 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          Về cổng thông tin S-TRACE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F2] text-[#17231D] antialiased">
      {/* Mobile-first Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl border-x border-slate-200 flex flex-col">
        {/* Header Bar */}
        <header className="bg-gradient-to-r from-[#0B3D2E] to-[#115740] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-strace-fresh flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 transform -rotate-12" />
              </div>
              <div>
                <span className="font-black text-sm tracking-wider">S-TRACE</span>
                <p className="text-[10px] text-emerald-200">Truy Xuất Nguồn Gốc Số</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] text-emerald-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Chính ngạch</span>
            </div>
          </div>
        </header>

        {/* Hero Product Banner */}
        <div className="relative">
          <img
            src={lot.imageUrl}
            alt={lot.name}
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Product Badge Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-strace-fresh text-[#0B3D2E] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                {lot.cropType}
              </span>
              <span className="bg-white/20 backdrop-blur text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20">
                {trace.traceCode}
              </span>
            </div>
            <h1 className="text-xl font-bold leading-tight drop-shadow-sm">{trace.productName}</h1>
            <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{lot.location}, {lot.region}</span>
            </p>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="p-4 -mt-3 relative z-10">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-strace-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-strace-dark">
                Nguồn Gốc Xuất Xứ Đã Xác Thực
              </h3>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                Sản phẩm được canh tác trực tiếp bởi <strong>{cooperative.shortName}</strong>, kiểm soát quy trình theo chuẩn VietGAP.
              </p>
            </div>
          </div>
        </div>

        {/* Key Product Metadata */}
        <div className="px-4 pb-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-strace-muted">Mã số lô:</span>
              <p className="font-mono font-bold text-strace-primary mt-0.5">{lot.code}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-strace-muted">Giống cây:</span>
              <p className="font-bold text-strace-text mt-0.5">{lot.variety}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-strace-muted">Mùa vụ canh tác:</span>
              <p className="font-semibold text-strace-text mt-0.5">{formatDate(lot.seasonStartDate)}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-strace-muted">Ngày thu hoạch:</span>
              <p className="font-bold text-emerald-700 mt-0.5">
                {lot.actualHarvestDate ? formatDate(lot.actualHarvestDate) : 'Đang thu hoạch'}
              </p>
            </div>
          </div>
        </div>

        {/* Production Journey (Timeline) */}
        <div className="px-4 pb-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-strace-text flex items-center gap-2">
              <Leaf className="w-4 h-4 text-strace-primary" />
              <span>Hành trình sản xuất sạch ({publicLogs.length} bước)</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-strace-muted px-2 py-0.5 rounded font-medium">
              Minh bạch 100%
            </span>
          </div>

          <div className="relative pl-5 space-y-4">
            {/* Timeline Line */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-emerald-200" />

            {publicLogs.map((log, index) => (
              <div key={log.id} className="relative">
                {/* Dot */}
                <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-white border-2 border-strace-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-strace-primary" />
                </div>

                <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-strace-primary bg-emerald-50 px-2 py-0.5 rounded">
                      {log.activityType}
                    </span>
                    <span className="text-strace-muted font-medium">
                      {formatDate(log.date)}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-strace-text">{log.title}</h4>
                  <p className="text-[11.5px] text-strace-muted leading-relaxed">
                    {log.content}
                  </p>

                  {log.materialsUsed && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50/60 px-2 py-1 rounded border border-emerald-100">
                      Vật tư an toàn: {log.materialsUsed}
                    </div>
                  )}

                  {log.imageUrl && (
                    <img
                      src={log.imageUrl}
                      alt={log.title}
                      className="w-full h-36 object-cover rounded-lg border border-slate-200 mt-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooperative Info Card */}
        <div className="px-4 pb-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-strace-text border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4 text-strace-primary" />
              <span>Đơn vị sản xuất & Chịu trách nhiệm</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-bold text-strace-text">{cooperative.name}</p>
              <p className="text-strace-muted text-[11px] leading-snug">
                {cooperative.address}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-strace-muted">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-strace-primary" /> {cooperative.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-strace-primary" /> {cooperative.email}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-strace-muted">Mã số chứng nhận vùng trồng:</span>
              <span className="font-mono font-bold text-strace-dark bg-white px-2 py-0.5 rounded border border-slate-200">
                {cooperative.code}
              </span>
            </div>
          </div>
        </div>

        {/* Consumer Footer */}
        <footer className="mt-auto bg-[#0B3D2E] text-white p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs tracking-wider">S-TRACE — DIGITAL AGRICULTURE</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 italic">
            "Minh bạch chi phí — Rõ nguồn gốc — Nâng giá trị nông sản"
          </p>
          <p className="text-[9.5px] text-emerald-400/60 pt-2 border-t border-white/10">
            Thông tin do đơn vị sản xuất cung cấp — Dữ liệu minh họa hệ thống S-TRACE HTX Ea H'leo.
          </p>
        </footer>
      </div>
    </div>
  );
};
