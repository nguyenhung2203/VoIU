import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Info,
  BookOpen,
  Wallet,
  ShoppingBag,
  QrCode,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getTraceUrl } from '../../utils/formatters';
import { GeneralInfoTab } from './tabs/GeneralInfoTab';
import { ProductionLogsTab } from './tabs/ProductionLogsTab';
import { LotExpensesTab } from './tabs/LotExpensesTab';
import { HarvestTab } from './tabs/HarvestTab';
import { LotTraceTab } from './tabs/LotTraceTab';
import { LotFormModal } from './LotFormModal';
import { EmptyState } from '../../components/common/EmptyState';

type TabType = 'general' | 'logs' | 'expenses' | 'harvest' | 'trace';

export const LotDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const lots = useAppStore((state) => state.lots);
  const expenses = useAppStore((state) => state.expenses);
  const harvests = useAppStore((state) => state.harvests);
  const traces = useAppStore((state) => state.traces);
  const updateLot = useAppStore((state) => state.updateLot);

  // Tìm lô tương ứng
  const lot = lots.find((l) => l.id === id);
  const traceItem = traces.find((t) => t.lotId === lot?.id);

  if (!lot) {
    return (
      <EmptyState
        title="Không tìm thấy lô sản xuất này"
        description="Lô sản xuất có thể đã bị xóa hoặc mã đường dẫn không hợp lệ."
        action={
          <button
            onClick={() => navigate('/production-lots')}
            className="px-4 py-2 bg-strace-primary text-white text-xs font-semibold rounded-xl hover:bg-strace-deep transition-colors"
          >
            Quay lại danh sách lô
          </button>
        }
      />
    );
  }

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: Info },
    { id: 'logs', label: 'Nhật ký canh tác', icon: BookOpen },
    { id: 'expenses', label: 'Chi phí sản xuất', icon: Wallet },
    { id: 'harvest', label: 'Thu hoạch & Sản lượng', icon: ShoppingBag },
    { id: 'trace', label: 'Truy xuất nguồn gốc', icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      {/* Back button & Title Header */}
      <div>
        <Link
          to="/production-lots"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-strace-muted hover:text-strace-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách lô sản xuất</span>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-strace-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={lot.imageUrl}
              alt={lot.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-extrabold text-strace-primary bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {lot.code}
                </span>
                <StatusBadge status={lot.status} />
                <span className="text-xs text-strace-muted">
                  {lot.cropType} • {lot.variety}
                </span>
              </div>
              <h1 className="text-xl font-bold text-strace-text mt-1.5">{lot.name}</h1>
              <p className="text-xs text-strace-muted mt-0.5">
                Vùng trồng: {lot.location}, {lot.region} • {lot.area} ha • Phụ trách: {lot.manager}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {traceItem && (
              <a
                href={getTraceUrl(traceItem.traceCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Xem trang QR</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-strace-primary hover:bg-strace-deep text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa lô</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-strace-border overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-strace-primary text-strace-primary bg-white shadow-xs'
                  : 'border-transparent text-strace-muted hover:text-strace-text hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'general' && (
          <GeneralInfoTab lot={lot} expenses={expenses} harvests={harvests} />
        )}
        {activeTab === 'logs' && <ProductionLogsTab lot={lot} />}
        {activeTab === 'expenses' && (
          <LotExpensesTab lot={lot} expenses={expenses} harvests={harvests} />
        )}
        {activeTab === 'harvest' && <HarvestTab lot={lot} />}
        {activeTab === 'trace' && <LotTraceTab lot={lot} />}
      </div>

      {/* Edit Lot Modal */}
      <LotFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={() => {}}
        onUpdate={updateLot}
        editingLot={lot}
        existingLots={lots}
      />
    </div>
  );
};
