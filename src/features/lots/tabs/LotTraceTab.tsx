import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  ExternalLink,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import { ProductionLot, TraceabilityItem } from '../../../types';
import { useAppStore } from '../../../store/useStore';
import { QRCodeModal } from '../../../components/common/QRCodeModal';
import { formatDate } from '../../../utils/formatters';
import { toast } from 'sonner';

interface LotTraceTabProps {
  lot: ProductionLot;
}

export const LotTraceTab: React.FC<LotTraceTabProps> = ({ lot }) => {
  const traces = useAppStore((state) => state.traces);
  const togglePublishTrace = useAppStore((state) => state.togglePublishTrace);
  const addTrace = useAppStore((state) => state.addTrace);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Tìm trace item tương ứng với lot này
  let traceItem = traces.find((t) => t.lotId === lot.id);

  // Nếu chưa có, tự động tạo một trace item draft
  useEffect(() => {
    if (!traceItem) {
      traceItem = addTrace({
        traceCode: `TRACE-${lot.code}`,
        lotId: lot.id,
        lotCode: lot.code,
        productName: `${lot.name} - ${lot.variety}`,
        publishedDate: new Date().toISOString().split('T')[0],
        isPublished: true,
        scanCount: 15,
        notes: `Mã truy xuất nguồn gốc khởi tạo cho lô ${lot.code}`,
      });
    }
  }, [lot.id, traceItem]);

  const traceUrl = traceItem
    ? `${window.location.origin}/trace/${traceItem.traceCode}`
    : '';

  useEffect(() => {
    if (traceItem) {
      QRCode.toDataURL(traceUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0B3D2E',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [traceUrl, traceItem]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(traceUrl);
    setCopied(true);
    toast.success('Đã sao chép liên kết truy xuất nguồn gốc');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl || !traceItem) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${traceItem.traceCode}.png`;
    a.click();
  };

  const handleTogglePublish = () => {
    if (traceItem) {
      togglePublishTrace(traceItem.id);
      toast.success(
        traceItem.isPublished ? 'Đã tạm dừng công bố mã QR' : 'Đã công bố công khai mã QR'
      );
    }
  };

  if (!traceItem) {
    return <div className="p-8 text-center text-xs text-strace-muted">Đang tải thông tin truy xuất...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview status banner */}
      <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-strace-text">Mã định danh truy xuất nguồn gốc</h3>
            {traceItem.isPublished ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Đang công bố công khai
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                Chưa công bố (Nội bộ)
              </span>
            )}
          </div>
          <p className="text-xs text-strace-muted mt-1">
            Người tiêu dùng quét mã QR để tra cứu nhật ký sản xuất, vùng trồng và tiêu chuẩn chất lượng
          </p>
        </div>

        <button
          onClick={handleTogglePublish}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors shrink-0 ${
            traceItem.isPublished
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              : 'bg-strace-primary text-white border-transparent hover:bg-strace-deep shadow-xs'
          }`}
        >
          {traceItem.isPublished ? 'Tạm dừng công bố' : 'Kích hoạt công bố'}
        </button>
      </div>

      {/* Main QR Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: QR Display */}
        <div className="bg-white rounded-2xl border border-strace-border p-6 shadow-card text-center flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm mb-4 inline-block">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />
            ) : (
              <div className="w-52 h-52 bg-slate-100 flex items-center justify-center text-xs text-strace-muted">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          <p className="font-mono text-sm font-extrabold text-strace-dark tracking-wide">
            {traceItem.traceCode}
          </p>
          <p className="text-[11px] text-strace-muted mt-1">
            Lượt quét mô phỏng: <strong className="text-strace-primary font-bold">{traceItem.scanCount} lượt</strong>
          </p>

          <div className="mt-4 flex items-center gap-2 w-full">
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-strace-text rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-strace-primary" />
              <span>Tải ảnh QR</span>
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-strace-text rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-strace-primary" />
              <span>In tem mẫu</span>
            </button>
          </div>
        </div>

        {/* Right: Trace Link & Public Page Details */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-strace-border p-6 shadow-card space-y-4">
            <h4 className="text-sm font-bold text-strace-text">Liên kết tra cứu công khai</h4>
            <p className="text-xs text-strace-muted">
              Đường dẫn website truy xuất nguồn gốc độc lập (không cần đăng nhập, thiết kế chuẩn di động cho người tiêu dùng):
            </p>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <input
                type="text"
                readOnly
                value={traceUrl}
                className="bg-transparent flex-1 outline-none text-strace-text font-mono text-xs"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-strace-text font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép link'}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`/trace/${traceItem.traceCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Mở xem trang truy xuất công khai</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 text-xs text-strace-text space-y-2">
            <h5 className="font-bold text-strace-dark">Lưu ý quan trọng về tính minh bạch:</h5>
            <ul className="list-disc pl-4 space-y-1 text-strace-muted">
              <li>Chỉ những mục nhật ký được đánh dấu <strong>"Công khai QR"</strong> mới xuất hiện trên trang truy xuất của người tiêu dùng.</li>
              <li>Thông tin chi phí nội bộ và tài chính kế toán tuyệt đối <strong>không bao giờ</strong> được công khai ra bên ngoài.</li>
              <li>Mã QR đã được tối ưu hóa chuẩn Vector SVG/PNG sắc nét, có thể in ấn trực tiếp lên tem nhãn bao bì thùng hàng hoặc dán từng quả.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Label Modal */}
      <QRCodeModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        traceItem={traceItem}
      />
    </div>
  );
};
