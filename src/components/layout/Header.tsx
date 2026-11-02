import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDateTime } from '../../utils/formatters';
import { toast } from 'sonner';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const cooperative = useAppStore((state) => state.cooperative);
  const activities = useAppStore((state) => state.activities);
  const resetToSeedData = useAppStore((state) => state.resetToSeedData);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetData = () => {
    resetToSeedData();
    setShowResetConfirm(false);
    setShowUserMenu(false);
    toast.success('Đã khôi phục dữ liệu mẫu thành công!');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-strace-border px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-strace-muted hover:text-strace-text hover:bg-slate-100 transition-colors"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-strace-muted">
          <div className="flex items-center gap-1.5 font-medium text-strace-text">
            <Building2 className="w-4 h-4 text-strace-primary" />
            <span className="hidden sm:inline">{cooperative.name}</span>
            <span className="sm:hidden">{cooperative.shortName}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-strace-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>Niên vụ 2026</span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Trace Public Link */}
        <a
          href="/trace/TRACE-SR-001"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-strace-deep bg-strace-accentGreen hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          title="Xem thử giao diện quét mã QR truy xuất dành cho người tiêu dùng"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Trang QR mẫu</span>
        </a>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-strace-muted hover:text-strace-text hover:bg-slate-100 transition-colors relative"
            title="Thông báo hoạt động"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-strace-primary" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-strace-border p-4 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-strace-text">Nhật ký hoạt động</h4>
                  <span className="text-[10px] bg-slate-100 text-strace-muted font-bold px-1.5 py-0.5 rounded-full">
                    {activities.length}
                  </span>
                </div>
                <span className="text-xs text-strace-primary font-medium">Thời gian thực</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2 space-y-1">
                {activities.slice(0, 7).map((act) => (
                  <div key={act.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-strace-text line-clamp-1">{act.title}</p>
                      <span className="text-[10px] text-strace-subtle shrink-0">
                        {formatDateTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-strace-muted mt-0.5 line-clamp-2">{act.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-strace-subtle">
                      <span>Bởi: {act.actor}</span>
                      {act.lotCode && (
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono text-strace-muted">
                          {act.lotCode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-strace-border"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-strace-dark to-strace-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
              HTX
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-strace-text leading-tight">HTX Ea H'leo</p>
              <p className="text-[11px] text-strace-muted">Quản trị viên</p>
            </div>
            <ChevronDown className="w-4 h-4 text-strace-muted hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-strace-border p-3 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <p className="text-xs font-bold text-strace-text">{cooperative.name}</p>
                <p className="text-[11px] text-strace-muted mt-0.5">{cooperative.representative}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Chứng nhận: VietGAP & Mã vùng trồng</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowResetConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-xl transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Khôi phục dữ liệu mẫu (Reset)</span>
                </button>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 px-3 text-[10px] text-strace-subtle">
                S-TRACE Digital Accounting v1.0
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Khôi phục dữ liệu demo gốc?"
        message="Hành động này sẽ đặt lại toàn bộ 12 lô sản xuất, 50+ chi phí và nhật ký canh tác về trạng thái ban đầu của hệ thống. Dữ liệu đã chỉnh sửa trong phiên làm việc này sẽ được thay thế."
        confirmLabel="Đồng ý khôi phục"
        cancelLabel="Hủy"
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </header>
  );
};
