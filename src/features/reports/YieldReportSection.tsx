import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ProductionLot, HarvestRecord } from '../../types';
import { formatWeight, formatArea } from '../../utils/formatters';

interface YieldReportSectionProps {
  lots: ProductionLot[];
  harvests: HarvestRecord[];
}

export const YieldReportSection: React.FC<YieldReportSectionProps> = ({
  lots,
  harvests,
}) => {
  const totalExpected = lots.reduce((sum, l) => sum + l.expectedYield, 0);
  const totalActual = lots.reduce((sum, l) => sum + l.actualYield, 0);
  const diff = totalActual - totalExpected;

  // Sản lượng theo loại nông sản
  const cropTypes = ['Sầu riêng', 'Cà phê', 'Hồ tiêu', 'Bơ', 'Mắc ca'];
  const cropData = cropTypes.map((crop) => {
    const cropLots = lots.filter((l) => l.cropType === crop);
    const exp = cropLots.reduce((sum, l) => sum + l.expectedYield, 0);
    const act = cropLots.reduce((sum, l) => sum + l.actualYield, 0);
    return {
      name: crop,
      'Kế hoạch (kg)': exp,
      'Thực thu (kg)': act,
    };
  });

  return (
    <div className="space-y-6">
      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Sản lượng dự kiến kế hoạch</span>
          <p className="text-2xl font-bold text-strace-text mt-1">{formatWeight(totalExpected)}</p>
          <p className="text-xs text-strace-muted mt-1">Tổng chỉ tiêu toàn HTX Ea H'leo</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Sản lượng thực thu</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatWeight(totalActual)}</p>
          <p className="text-xs text-strace-muted mt-1">
            Đạt {totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(1) : 0}% chỉ tiêu
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs">
          <span className="text-[10px] uppercase font-bold text-strace-muted">Chênh lệch sản lượng</span>
          <p
            className={`text-2xl font-bold mt-1 ${
              diff >= 0 ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {diff >= 0 ? '+' : ''}
            {formatWeight(diff)}
          </p>
          <p className="text-xs text-strace-muted mt-1">
            {diff >= 0 ? 'Vượt chỉ tiêu toàn vụ' : 'Đang trong quá trình thu hoạch tiếp các lô cuối'}
          </p>
        </div>
      </div>

      {/* Chart: Sản lượng theo loại nông sản */}
      <div className="bg-white rounded-2xl p-5 border border-strace-border shadow-card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-strace-text">So sánh sản lượng theo loại nông sản</h3>
            <p className="text-xs text-strace-muted mt-0.5">
              Đối chiếu sản lượng kế hoạch và sản lượng thực tế thu mua (kg)
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
            5 nhóm nông sản
          </span>
        </div>

        <div className="h-80 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#69776F', fontSize: 11 }} tickLine={false} />
              <YAxis
                tick={{ fill: '#69776F', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}t` : `${v}`)}
              />
              <Tooltip
                formatter={(val: number) => [formatWeight(val), '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E9E5',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="Kế hoạch (kg)" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="Thực thu (kg)" fill="#208456" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yield table by Lot */}
      <div className="bg-white rounded-2xl border border-strace-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-strace-border">
          <h4 className="text-sm font-bold text-strace-text">Bảng chi tiết tiến độ sản lượng từng lô</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-strace-border text-[11px] font-semibold uppercase tracking-wider text-strace-muted">
                <th className="py-3 px-4">Mã lô</th>
                <th className="py-3 px-4">Tên lô sản xuất</th>
                <th className="py-3 px-4">Nông sản & Giống</th>
                <th className="py-3 px-4 text-right">Kế hoạch</th>
                <th className="py-3 px-4 text-right">Thực thu</th>
                <th className="py-3 px-4 text-right">Tỷ lệ hoàn thành</th>
                <th className="py-3 px-4 text-right">Năng suất (kg/ha)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-strace-border text-xs">
              {lots.map((lot) => {
                const completionPct =
                  lot.expectedYield > 0
                    ? ((lot.actualYield / lot.expectedYield) * 100).toFixed(1)
                    : '0';
                const yieldPerHa =
                  lot.area > 0
                    ? Math.round((lot.actualYield > 0 ? lot.actualYield : lot.expectedYield) / lot.area)
                    : 0;

                return (
                  <tr key={lot.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-strace-primary">
                      {lot.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-strace-text">
                      {lot.name}
                    </td>
                    <td className="py-3 px-4 text-strace-muted">
                      {lot.cropType} • {lot.variety}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-strace-muted">
                      {formatWeight(lot.expectedYield)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {lot.actualYield > 0 ? formatWeight(lot.actualYield) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-strace-dark">
                      {lot.actualYield > 0 ? `${completionPct}%` : 'Chưa thu hoạch'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-strace-text">
                      {formatWeight(yieldPerHa)}/ha
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
