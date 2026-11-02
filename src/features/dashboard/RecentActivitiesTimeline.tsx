import React from 'react';
import { ActivityTimelineItem } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import {
  PlusCircle,
  Receipt,
  BookOpen,
  ShoppingBag,
  QrCode,
  Clock,
} from 'lucide-react';

interface RecentActivitiesTimelineProps {
  activities: ActivityTimelineItem[];
}

export const RecentActivitiesTimeline: React.FC<RecentActivitiesTimelineProps> = ({
  activities,
}) => {
  const getActivityIcon = (type: ActivityTimelineItem['type']) => {
    switch (type) {
      case 'lot_created':
        return {
          icon: <PlusCircle className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-200',
        };
      case 'expense_added':
        return {
          icon: <Receipt className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200',
        };
      case 'log_added':
        return {
          icon: <BookOpen className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'harvest_recorded':
        return {
          icon: <ShoppingBag className="w-4 h-4 text-teal-600" />,
          bg: 'bg-teal-50 border-teal-200',
        };
      case 'trace_published':
        return {
          icon: <QrCode className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50 border-purple-200',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-500" />,
          bg: 'bg-slate-100 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-strace-text">Hoạt động canh tác gần đây</h3>
          <p className="text-xs text-strace-muted mt-0.5">
            Dòng sự kiện ghi nhận từ hiện trường vùng trồng
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Thời gian thực" />
      </div>

      <div className="relative pl-6 space-y-4 flex-1 overflow-y-auto max-h-80 pr-1">
        {/* Timeline connector line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />

        {activities.slice(0, 6).map((item) => {
          const { icon, bg } = getActivityIcon(item.type);
          return (
            <div key={item.id} className="relative group">
              {/* Dot icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${bg}`}
              >
                {icon}
              </div>

              <div className="bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-strace-text line-clamp-1">{item.title}</h4>
                  <span className="text-[10px] text-strace-subtle shrink-0 font-medium">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-strace-muted mt-1 leading-snug">{item.description}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-strace-subtle">
                  <span>Thực hiện: <strong className="text-strace-muted font-medium">{item.actor}</strong></span>
                  {item.lotCode && (
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-strace-dark font-medium">
                      {item.lotCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
