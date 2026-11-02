import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sprout,
  BarChart3,
  QrCode,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAppStore((state) => state.login);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState('giamdoc@eahleo.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to destination or /dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);

      if (result.success) {
        toast.success('Đăng nhập thành công! Chào mừng trở lại hệ thống S-TRACE.');
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.error || 'Đăng nhập không thành công');
        toast.error(result.error || 'Đăng nhập không thành công');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#07261C]">
      {/* Left: Branding & Agricultural Visual Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-12 bg-gradient-to-br from-[#0B3D2E] via-[#0D4A38] to-[#07261C] text-white relative overflow-hidden border-r border-emerald-900/40">
        {/* Subtle Decorative Background Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-strace-fresh to-strace-primary flex items-center justify-center shadow-lg shadow-black/30 border border-emerald-300/30">
              <Leaf className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-wider text-white">S-TRACE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Agri v2.0
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">Kế toán số & Quản lý nguồn gốc nông sản</p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-xs text-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTX Nông nghiệp & Dịch vụ Ea H'leo — Đắk Lắk</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
              Minh bạch chi phí, <br />
              <span className="text-emerald-400">Rõ ràng nguồn gốc</span>, <br />
              Nâng tầm giá trị nông sản.
            </h1>
            <p className="text-sm text-emerald-100/70 max-w-md leading-relaxed">
              Giải pháp số hóa toàn diện quy trình hạch toán chi phí niên vụ và quản lý truy xuất nguồn gốc nông sản theo tiêu chuẩn VietGAP và mã số vùng trồng xuất khẩu.
            </p>
          </div>
        </div>

        {/* Middle: Feature Highlights */}
        <div className="my-8 space-y-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 backdrop-blur flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">12 Lô sản xuất trọng điểm</p>
              <p className="text-[11px] text-emerald-300/70">
                Sầu riêng Ri6 & Dona, Cà phê Robusta, Hồ tiêu trụ sống, Bơ Booth, Mắc ca.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 backdrop-blur flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Kế toán chi phí & Giá thành thực tế</p>
              <p className="text-[11px] text-emerald-300/70">
                Tự động kết chuyển chi phí giống, phân bón, công lao động và tính giá thành/kg.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 backdrop-blur flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Truy xuất nguồn gốc minh bạch</p>
              <p className="text-[11px] text-emerald-300/70">
                Tem nhãn QR điện tử theo từng lô, minh bạch nhật ký canh tác cho người tiêu dùng.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Cooperative Credentials */}
        <div className="pt-6 border-t border-emerald-800/40 text-[11px] text-emerald-300/70 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mã số vùng trồng: HTX-EHL-DAKLAK</span>
          </div>
          <span>Niên vụ 2026</span>
        </div>
      </div>

      {/* Right: Login Form & Demo Quick-access */}
      <div className="w-full lg:w-1/2 xl:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#F8FAF8] overflow-y-auto">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile Top Brand (visible on small screens) */}
          <div className="lg:hidden flex items-center gap-3 pb-2 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-strace-fresh to-strace-primary flex items-center justify-center text-white shadow-md">
              <Leaf className="w-5 h-5 transform -rotate-12" />
            </div>
            <div>
              <span className="font-black text-xl text-strace-dark tracking-wide">S-TRACE</span>
              <p className="text-xs text-strace-muted">HTX Ea H'leo — Đắk Lắk</p>
            </div>
          </div>

          {/* Form Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-strace-primary border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              Cổng quản trị hợp tác xã
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-strace-dark mt-2.5 tracking-tight">
              Đăng nhập hệ thống
            </h2>
            <p className="text-sm text-strace-muted mt-1">
              Nhập tài khoản cán bộ HTX hoặc chọn tài khoản demo bên dưới để tiếp tục.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-strace-text uppercase tracking-wider mb-1.5">
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-strace-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giamdoc@eahleo.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-strace-text focus:outline-none focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-strace-text uppercase tracking-wider">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info('Mật khẩu mẫu của các tài khoản demo là: 123 hoặc 123456')
                  }
                  className="text-xs text-strace-primary hover:underline font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-strace-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-strace-text focus:outline-none focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-strace-muted hover:text-strace-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-strace-muted hover:text-strace-text">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-strace-primary focus:ring-strace-primary"
                />
                <span>Ghi nhớ phiên đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-strace-primary hover:bg-strace-deep active:scale-[0.99] transition-all shadow-md shadow-strace-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400">
            S-TRACE Agri Cloud • Hợp tác xã Nông nghiệp & Dịch vụ Ea H'leo, Đắk Lắk
          </div>
        </div>
      </div>
    </div>
  );
};