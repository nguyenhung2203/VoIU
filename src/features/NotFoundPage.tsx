import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-strace-text">404</h1>
      <h2 className="text-lg font-bold text-strace-text mt-1">Trang không tồn tại</h2>
      <p className="text-xs text-strace-muted mt-2 max-w-sm">
        Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới trên hệ thống S-TRACE.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Về trang Tổng quan</span>
      </Link>
    </div>
  );
};
