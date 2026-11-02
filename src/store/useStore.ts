import { create } from 'zustand';
import {
  CooperativeInfo,
  ProductionLot,
  Expense,
  ProductionLog,
  HarvestRecord,
  TraceabilityItem,
  ActivityTimelineItem,
} from '../types';
import {
  INITIAL_COOPERATIVE,
  INITIAL_LOTS,
  INITIAL_EXPENSES,
  INITIAL_LOGS,
  INITIAL_HARVESTS,
  INITIAL_TRACES,
  INITIAL_ACTIVITIES,
} from '../data/seed';

const STORAGE_KEY = 's_trace_state_v3';

interface AppState {
  cooperative: CooperativeInfo;
  lots: ProductionLot[];
  expenses: Expense[];
  logs: ProductionLog[];
  harvests: HarvestRecord[];
  traces: TraceabilityItem[];
  activities: ActivityTimelineItem[];

  // Lots actions
  addLot: (lot: Omit<ProductionLot, 'id' | 'actualYield' | 'createdAt'>) => ProductionLot;
  updateLot: (id: string, updates: Partial<ProductionLot>) => void;
  deleteLot: (id: string) => boolean;

  // Expenses actions
  addExpense: (expense: Omit<Expense, 'id' | 'code' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Logs actions
  addLog: (log: Omit<ProductionLog, 'id' | 'createdAt'>) => ProductionLog;
  updateLog: (id: string, updates: Partial<ProductionLog>) => void;
  deleteLog: (id: string) => void;

  // Harvests actions
  addHarvest: (harvest: Omit<HarvestRecord, 'id' | 'createdAt'>) => HarvestRecord;
  deleteHarvest: (id: string) => void;

  // Trace actions
  addTrace: (trace: Omit<TraceabilityItem, 'id'>) => TraceabilityItem;
  updateTrace: (id: string, updates: Partial<TraceabilityItem>) => void;
  togglePublishTrace: (id: string) => void;

  // Utilities
  resetToSeedData: () => void;
  recalculateLotYields: () => void;
}

// Load initial data from localStorage if available, or fall back to seed
const loadInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lots && parsed.expenses && parsed.traces) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu từ localStorage, sử dụng dữ liệu mặc định:', e);
  }
  return {
    cooperative: INITIAL_COOPERATIVE,
    lots: INITIAL_LOTS,
    expenses: INITIAL_EXPENSES,
    logs: INITIAL_LOGS,
    harvests: INITIAL_HARVESTS,
    traces: INITIAL_TRACES,
    activities: INITIAL_ACTIVITIES,
  };
};

const persistState = (state: Partial<AppState>) => {
  try {
    const toSave = {
      cooperative: state.cooperative,
      lots: state.lots,
      expenses: state.expenses,
      logs: state.logs,
      harvests: state.harvests,
      traces: state.traces,
      activities: state.activities,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Không thể lưu dữ liệu vào localStorage:', e);
  }
};

export const useAppStore = create<AppState>((set, get) => {
  const initial = loadInitialState();

  return {
    ...initial,

    addLot: (lotData) => {
      const id = `lot-${Date.now()}`;
      const newLot: ProductionLot = {
        ...lotData,
        id,
        actualYield: 0,
        createdAt: new Date().toISOString(),
      };

      const newActivity: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'lot_created',
        title: `Tạo lô sản xuất mới ${newLot.code}`,
        description: `${newLot.name} (${newLot.cropType} - ${newLot.area} ha)`,
        actor: newLot.manager || 'Quản lý vùng trồng',
        lotCode: newLot.code,
      };

      // Tự động tạo một draft trace tương ứng
      const newTrace: TraceabilityItem = {
        id: `tr-${Date.now()}`,
        traceCode: `TRACE-${newLot.code}`,
        lotId: newLot.id,
        lotCode: newLot.code,
        productName: `${newLot.name} - ${newLot.variety}`,
        publishedDate: new Date().toISOString().split('T')[0],
        isPublished: false,
        scanCount: 0,
        notes: `Mã truy xuất nguồn gốc khởi tạo cho lô ${newLot.code}`,
      };

      set((state) => {
        const nextState = {
          lots: [newLot, ...state.lots],
          traces: [newTrace, ...state.traces],
          activities: [newActivity, ...state.activities],
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });

      return newLot;
    },

    updateLot: (id, updates) => {
      set((state) => {
        const updatedLots = state.lots.map((lot) =>
          lot.id === id ? { ...lot, ...updates } : lot
        );
        const nextState = { lots: updatedLots };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    deleteLot: (id) => {
      const state = get();
      const lot = state.lots.find((l) => l.id === id);
      if (!lot) return false;

      // Kiểm tra ràng buộc
      const hasExpenses = state.expenses.some((e) => e.lotId === id);
      const hasHarvests = state.harvests.some((h) => h.lotId === id);
      if (hasExpenses || hasHarvests) {
        // Vẫn cho phép xóa nếu người dùng xác nhận, nhưng xóa sạch các mục liên kết
      }

      set((s) => {
        const nextLots = s.lots.filter((l) => l.id !== id);
        const nextExpenses = s.expenses.filter((e) => e.lotId !== id);
        const nextLogs = s.logs.filter((l) => l.lotId !== id);
        const nextHarvests = s.harvests.filter((h) => h.lotId !== id);
        const nextTraces = s.traces.filter((t) => t.lotId !== id);

        const nextState = {
          lots: nextLots,
          expenses: nextExpenses,
          logs: nextLogs,
          harvests: nextHarvests,
          traces: nextTraces,
        };
        persistState({ ...s, ...nextState });
        return nextState;
      });
      return true;
    },

    addExpense: (expenseData) => {
      const id = `exp-${Date.now()}`;
      const code = `CP-${new Date().getFullYear()}-${String(get().expenses.length + 1).padStart(3, '0')}`;
      const newExpense: Expense = {
        ...expenseData,
        id,
        code,
        createdAt: new Date().toISOString(),
      };

      const newActivity: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'expense_added',
        title: `Ghi nhận chi phí ${newExpense.category} (${newExpense.code})`,
        description: `${newExpense.name} - ${new Intl.NumberFormat('vi-VN').format(newExpense.amount)} VNĐ`,
        actor: newExpense.executor || 'Kế toán HTX',
        lotCode: newExpense.lotCode,
      };

      set((state) => {
        const nextState = {
          expenses: [newExpense, ...state.expenses],
          activities: [newActivity, ...state.activities],
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });

      return newExpense;
    },

    updateExpense: (id, updates) => {
      set((state) => {
        const nextExpenses = state.expenses.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        );
        const nextState = { expenses: nextExpenses };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    deleteExpense: (id) => {
      set((state) => {
        const nextExpenses = state.expenses.filter((e) => e.id !== id);
        const nextState = { expenses: nextExpenses };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    addLog: (logData) => {
      const id = `log-${Date.now()}`;
      const newLog: ProductionLog = {
        ...logData,
        id,
        createdAt: new Date().toISOString(),
      };

      const lot = get().lots.find((l) => l.id === logData.lotId);

      const newActivity: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'log_added',
        title: `Nhật ký: ${newLog.activityType}`,
        description: `${newLog.title} (${lot?.code || ''})`,
        actor: newLog.executor || 'Cán bộ kỹ thuật',
        lotCode: lot?.code,
      };

      set((state) => {
        const nextState = {
          logs: [newLog, ...state.logs],
          activities: [newActivity, ...state.activities],
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });

      return newLog;
    },

    updateLog: (id, updates) => {
      set((state) => {
        const nextLogs = state.logs.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        );
        const nextState = { logs: nextLogs };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    deleteLog: (id) => {
      set((state) => {
        const nextLogs = state.logs.filter((l) => l.id !== id);
        const nextState = { logs: nextLogs };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    addHarvest: (harvestData) => {
      const id = `har-${Date.now()}`;
      const newHarvest: HarvestRecord = {
        ...harvestData,
        id,
        createdAt: new Date().toISOString(),
      };

      const lot = get().lots.find((l) => l.id === harvestData.lotId);

      // Cập nhật lại actualYield cho lot
      const nextHarvests = [newHarvest, ...get().harvests];
      const lotHarvests = nextHarvests.filter((h) => h.lotId === harvestData.lotId);
      const totalLotYield = lotHarvests.reduce((sum, h) => sum + h.yieldKg, 0);

      const newActivity: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'harvest_recorded',
        title: `Thu hoạch đợt ${newHarvest.batchNumber} (${lot?.code || ''})`,
        description: `Sản lượng: ${newHarvest.yieldKg.toLocaleString('vi-VN')} kg (${newHarvest.qualityGrade})`,
        actor: newHarvest.recordedBy || 'Tổ trưởng thu hoạch',
        lotCode: lot?.code,
      };

      set((state) => {
        const updatedLots = state.lots.map((l) => {
          if (l.id === harvestData.lotId) {
            return {
              ...l,
              actualYield: totalLotYield,
              status: l.status === 'in_progress' ? 'harvested' : l.status,
              actualHarvestDate: harvestData.date,
            };
          }
          return l;
        });

        const nextState = {
          harvests: nextHarvests,
          lots: updatedLots,
          activities: [newActivity, ...state.activities],
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });

      return newHarvest;
    },

    deleteHarvest: (id) => {
      set((state) => {
        const target = state.harvests.find((h) => h.id === id);
        if (!target) return state;

        const nextHarvests = state.harvests.filter((h) => h.id !== id);
        const lotId = target.lotId;
        const totalLotYield = nextHarvests
          .filter((h) => h.lotId === lotId)
          .reduce((sum, h) => sum + h.yieldKg, 0);

        const updatedLots = state.lots.map((l) =>
          l.id === lotId ? { ...l, actualYield: totalLotYield } : l
        );

        const nextState = {
          harvests: nextHarvests,
          lots: updatedLots,
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    addTrace: (traceData) => {
      const id = `tr-${Date.now()}`;
      const newTrace: TraceabilityItem = {
        ...traceData,
        id,
      };

      set((state) => {
        const nextState = { traces: [newTrace, ...state.traces] };
        persistState({ ...state, ...nextState });
        return nextState;
      });
      return newTrace;
    },

    updateTrace: (id, updates) => {
      set((state) => {
        const nextTraces = state.traces.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        );
        const nextState = { traces: nextTraces };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    togglePublishTrace: (id) => {
      set((state) => {
        const trace = state.traces.find((t) => t.id === id);
        if (!trace) return state;
        const nextPublished = !trace.isPublished;

        const updatedTraces = state.traces.map((t) =>
          t.id === id ? { ...t, isPublished: nextPublished } : t
        );

        const newActivity: ActivityTimelineItem = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'trace_published',
          title: nextPublished
            ? `Công bố mã QR ${trace.traceCode}`
            : `Hủy công bố mã QR ${trace.traceCode}`,
          description: `${trace.productName} (${trace.lotCode})`,
          actor: 'Ban Quản trị HTX',
          lotCode: trace.lotCode,
        };

        const nextState = {
          traces: updatedTraces,
          activities: [newActivity, ...state.activities],
        };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },

    resetToSeedData: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({
        cooperative: INITIAL_COOPERATIVE,
        lots: INITIAL_LOTS,
        expenses: INITIAL_EXPENSES,
        logs: INITIAL_LOGS,
        harvests: INITIAL_HARVESTS,
        traces: INITIAL_TRACES,
        activities: INITIAL_ACTIVITIES,
      });
      persistState({
        cooperative: INITIAL_COOPERATIVE,
        lots: INITIAL_LOTS,
        expenses: INITIAL_EXPENSES,
        logs: INITIAL_LOGS,
        harvests: INITIAL_HARVESTS,
        traces: INITIAL_TRACES,
        activities: INITIAL_ACTIVITIES,
      });
    },

    recalculateLotYields: () => {
      set((state) => {
        const updatedLots = state.lots.map((lot) => {
          const totalYield = state.harvests
            .filter((h) => h.lotId === lot.id)
            .reduce((sum, h) => sum + h.yieldKg, 0);
          return { ...lot, actualYield: totalYield };
        });
        const nextState = { lots: updatedLots };
        persistState({ ...state, ...nextState });
        return nextState;
      });
    },
  };
});
