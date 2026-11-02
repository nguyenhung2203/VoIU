import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, ExternalLink, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { TraceabilityItem } from '../../types';
import { useAppStore } from '../../store/useStore';
import { getTraceUrl } from '../../utils/formatters';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  traceItem: TraceabilityItem | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, traceItem }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const cooperative = useAppStore((state) => state.cooperative);

  const traceUrl = traceItem ? getTraceUrl(traceItem.traceCode) : '';

  useEffect(() => {
    if (traceItem && isOpen) {
      QRCode.toDataURL(traceUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0B3D2E', // Màu dark forest green chuẩn thương hiệu S-TRACE
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Lỗi tạo mã QR:', err));
    }
  }, [traceItem, traceUrl, isOpen]);

  if (!isOpen || !traceItem) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${traceItem.traceCode}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(traceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-strace-border relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-strace-subtle hover:text-strace-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 no-print">
          <div className="p-2.5 rounded-xl bg-strace-accentGreen text-strace-deep">
            <QrIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-strace-text">Tem Truy Xuất Nguồn Gốc</h3>
            <p className="text-xs text-strace-muted">Mã: {traceItem.traceCode}</p>
          </div>
        </div>

        {/* Printable Label Card */}
        <div className="print-area bg-gradient-to-b from-emerald-50/40 to-slate-50 border-2 border-strace-primary/40 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
          {/* S-TRACE Header on Badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-strace-primary flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-extrabold text-sm tracking-wider text-strace-dark">
              S-TRACE
            </span>
            <span className="text-[10px] bg-strace-accentGreen text-strace-deep px-1.5 py-0.5 rounded font-medium">
              Chính Ngạch
            </span>
          </div>

          <h4 className="text-base font-bold text-strace-text mb-1">
            {traceItem.productName}
          </h4>
          <p className="text-xs text-strace-muted mb-4 font-medium">
            {cooperative.shortName} — {cooperative.province}
          </p>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto mb-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR ${traceItem.traceCode}`}
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-xs text-strace-muted">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-mono font-semibold text-strace-primary tracking-wide">
              {traceItem.traceCode}
            </p>
            <p className="text-[11px] text-strace-muted">
              Mở camera điện thoại quét để xem nhật ký canh tác & nguồn gốc
            </p>
          </div>

          {/* Micro stamp footer */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-strace-subtle">
            <span>Mã lô: {traceItem.lotCode}</span>
            <span>HTX Ea H'leo</span>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="mt-5 space-y-3 no-print">
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-strace-muted">
            <input
              type="text"
              readOnly
              value={traceUrl}
              className="bg-transparent flex-1 outline-none text-strace-text font-mono text-[11px]"
            />
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-strace-text font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-strace-border hover:bg-slate-50 text-xs font-medium text-strace-text transition-colors"
            >
              <Download className="w-4 h-4 text-strace-primary" />
              <span>Tải ảnh QR</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-strace-border hover:bg-slate-50 text-xs font-medium text-strace-text transition-colors"
            >
              <Printer className="w-4 h-4 text-strace-primary" />
              <span>In tem nhãn</span>
            </button>

            <a
              href={traceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-strace-primary hover:bg-strace-deep text-xs font-medium text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Xem trang</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
