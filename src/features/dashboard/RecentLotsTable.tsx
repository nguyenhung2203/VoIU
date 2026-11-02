import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Eye } from 'lucide-react';
import { ProductionLot, Expense, HarvestRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  formatArea,
  formatDate,
  formatUnitPrice,
  formatWeight,
} from '../../utils/formatters';
import { calculateLotCostPerKg } from '../../utils/calculations';

interface RecentLotsTableProps {
  lots: ProductionLot[];
  expenses: Expense[];
  harvests: HarvestRecord[];
}

export const RecentLotsTable: React.FC<RecentLotsTableProps> = ({
  lots,
  expenses,
  harvests,
}) => {
  const navigate = useNavigate();

  // Hiển thị 5 lô mới nhất hoặc tiêu biểu
  const displayLots = lots.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
      <div className="p-5 border-b border-strace-border flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-strace-text">Lô sản xuất gần đây</h3>
          <p className="text-xs text-strace-muted mt-0.5">
            Theo dõi tiến độ, sản lượng thực tế và đơn giá thành sản xuất
          </p>
        </div>
        <Link
          to="/production-lots"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-strace-primary hover:text-strace-deep transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
        >
          <span>Xem tất cả ({lots.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
              <th className="py-3 px-3.5 whitespace-nowrap">Mã lô</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Sản phẩm & Giống</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">Diện tích</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Mùa vụ</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">Sản lượng</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">Giá thành</th>
              <th className="py-3 px-3.5 text-center whitespace-nowrap">Trạng thái</th>
              <th className="py-3 px-3.5 text-center whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-strace-border text-xs">
            {displayLots.map((lot) => {
              const costPerKg = calculateLotCostPerKg(lot.id, expenses, harvests);

              return (
                <tr
                  key={lot.id}
                  onClick={() => navigate(`/production-lots/${lot.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-strace-primary text-xs bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100">
                      {lot.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={lot.imageUrl}
                        alt={lot.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          // Fallback placeholder
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-strace-text group-hover:text-strace-primary transition-colors whitespace-nowrap">
                          {lot.name}
                        </p>
                        <p className="text-[11px] text-strace-muted whitespace-nowrap">
                          {lot.cropType} • {lot.variety}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-medium text-strace-text whitespace-nowrap">
                    {formatArea(lot.area)}
                  </td>
                  <td className="py-3.5 px-3.5 text-strace-muted text-[11px] whitespace-nowrap">
                    <div className="font-medium text-strace-text">Dự thu: {formatDate(lot.expectedHarvestDate)}</div>
                    <div className="text-[10px] text-strace-subtle">Bắt đầu: {formatDate(lot.seasonStartDate)}</div>
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    {lot.actualYield > 0 ? (
                      <div>
                        <span className="font-bold text-emerald-700">
                          {formatWeight(lot.actualYield)}
                        </span>
                        <p className="text-[10px] text-strace-subtle">
                          Dự kiến: {formatWeight(lot.expectedYield)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-strace-muted">
                        Dự kiến: {formatWeight(lot.expectedYield)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    {costPerKg !== null ? (
                      <span className="inline-block whitespace-nowrap font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {formatUnitPrice(costPerKg)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-strace-subtle italic">
                        Chưa đủ dữ liệu
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                    <StatusBadge status={lot.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/production-lots/${lot.id}`);
                      }}
                      className="p-1.5 rounded-lg text-strace-muted hover:text-strace-primary hover:bg-emerald-50 transition-colors"
                      title="Xem chi tiết"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
