import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: number; // e.g. 12.5%
    label: string; // "so với kỳ trước"
    isPositive?: boolean; // Tùy ngữ cảnh: với chi phí tăng có thể là cảnh báo hoặc ngược lại
  };
  icon: ReactNode;
  iconBgColor?: string;
  sparklineData?: number[];
  tooltipText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon,
  iconBgColor = 'bg-strace-accentGreen text-strace-deep',
  sparklineData,
  tooltipText,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card hover:shadow-cardHover transition-all duration-200 relative overflow-hidden group">
      {/* Decorative top gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strace-primary to-strace-fresh opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-strace-muted">
              {title}
            </p>
            {tooltipText && (
              <span
                className="cursor-help text-xs text-strace-subtle hover:text-strace-text"
                title={tooltipText}
              >
                ⓘ
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-strace-text tracking-tight">{value}</h3>
          {subValue && (
            <p className="text-xs text-strace-muted flex items-center gap-1.5 mt-0.5">
              {subValue}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {trend.value > 0 ? (
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                  trend.isPositive !== false
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                +{trend.value}%
              </span>
            ) : trend.value < 0 ? (
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                  trend.isPositive !== false
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                {trend.value}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-slate-600 bg-slate-100">
                <Minus className="w-3 h-3" /> 0%
              </span>
            )}
            <span className="text-strace-muted text-[11px]">{trend.label}</span>
          </div>
        ) : (
          <span className="text-[11px] text-strace-subtle">Cập nhật theo thời gian thực</span>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="flex items-end gap-1 h-5">
            {sparklineData.map((d, idx) => {
              const max = Math.max(...sparklineData);
              const heightPct = max > 0 ? Math.max(15, (d / max) * 100) : 20;
              return (
                <div
                  key={idx}
                  className="w-1.5 bg-strace-fresh/40 group-hover:bg-strace-primary rounded-t transition-all"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
