import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Sprout,
  QrCode,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();

  // Đúng 5 mục chính theo yêu cầu đề bài
  const navigationItems = [
    {
      name: 'Tổng quan',
      path: '/dashboard',
      aliases: ['/', '/dashboard'],
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Chi phí',
      path: '/expenses',
      aliases: ['/expenses'],
      icon: Wallet,
      badge: null,
    },
    {
      name: 'Lô sản xuất',
      path: '/production-lots',
      aliases: ['/production-lots'],
      icon: Sprout,
      badge: '12',
    },
    {
      name: 'Truy xuất nguồn gốc',
      path: '/traceability',
      aliases: ['/traceability'],
      icon: QrCode,
      badge: null,
    },
    {
      name: 'Báo cáo',
      path: '/reports',
      aliases: ['/reports'],
      icon: BarChart3,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B3D2E] text-white select-none relative">
      {/* Brand Header */}
      <div
        className={`border-b border-white/10 ${
          isCollapsed ? 'py-5 flex justify-center' : 'p-5 flex items-center gap-3.5'
        }`}
      >
        <div
          onClick={() => isCollapsed && setIsCollapsed(false)}
          className={`w-10 h-10 rounded-xl bg-gradient-to-br from-strace-fresh to-strace-primary flex items-center justify-center shrink-0 shadow-lg shadow-black/20 ${
            isCollapsed ? 'cursor-pointer hover:scale-105 transition-transform' : ''
          }`}
          title={isCollapsed ? 'Nhấp để mở rộng menu' : undefined}
        >
          <Leaf className="w-5 h-5 text-white transform -rotate-12" />
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-xl tracking-wider text-white leading-none">
              S-TRACE
            </h2>
            <p className="text-[11px] text-emerald-200/80 font-normal mt-1.5 truncate">
              Kế toán số & Nguồn gốc nông sản
            </p>
          </div>
        )}
      </div>

      {/* Organization Badge */}
      {!isCollapsed && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-100 truncate">
              HTX Ea H'leo — Đắk Lắk
            </span>
          </div>
          <p className="text-[10px] text-emerald-300/70 mt-0.5 pl-4 truncate">
            Mã số vùng trồng: HTX-EHL-DAKLAK
          </p>
        </div>
      )}

      {/* Main 5 Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/50 px-3 mb-2">
          {!isCollapsed && 'Nghiệp vụ chính'}
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.aliases.includes(location.pathname) ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-strace-primary text-white font-semibold shadow-md shadow-strace-dark/40'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-emerald-300/80'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 text-[13.5px]">{item.name}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-900/80 text-emerald-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {isCollapsed && isActive && (
                <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-emerald-300" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Branding & Agricultural Slogan */}
      <div className="p-4 border-t border-white/10 bg-emerald-950/40">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nông nghiệp Minh Bạch</span>
            </div>
            <p className="text-[11px] text-emerald-200/60 leading-tight italic">
              "Minh bạch chi phí — Rõ nguồn gốc — Nâng giá trị nông sản"
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-400/50">
              <span>S-TRACE SaaS v1.0</span>
              <span>Đắk Lắk 2026</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-emerald-400">
            <Leaf className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 h-screen sticky top-0 z-30 shadow-xl relative ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {sidebarContent}

        {/* Floating Collapse / Expand Button on Border */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-[#115740] hover:bg-strace-primary text-white border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-40"
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B3D2E] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
