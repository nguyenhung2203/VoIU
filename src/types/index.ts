export type CropType = 'Sầu riêng' | 'Cà phê' | 'Hồ tiêu' | 'Bơ' | 'Mắc ca';

export type LotStatus = 'planning' | 'in_progress' | 'harvested' | 'completed' | 'paused';

export type ExpenseCategory = 
  | 'Giống' 
  | 'Phân bón' 
  | 'Thuốc BVTV' 
  | 'Nhân công' 
  | 'Tưới tiêu' 
  | 'Vận chuyển' 
  | 'Máy móc' 
  | 'Dịch vụ thuê ngoài' 
  | 'Khác';

export type LogActivityType = 
  | 'Chuẩn bị đất' 
  | 'Chăm sóc' 
  | 'Bón phân' 
  | 'Tưới nước' 
  | 'Phun thuốc' 
  | 'Kiểm tra sâu bệnh' 
  | 'Thu hoạch' 
  | 'Hoạt động khác';

export interface CooperativeInfo {
  id: string;
  name: string;
  shortName: string;
  code: string;
  address: string;
  province: string;
  representative: string;
  phone: string;
  email: string;
  establishedYear: number;
  totalArea: number; // ha
  memberHouseholds: number;
  certificationNote: string;
}

export interface ProductionLot {
  id: string;
  code: string; // e.g. SR-DL-001
  name: string;
  cropType: CropType;
  variety: string; // Giống: Ri6, Monthong, Robusta TRS1, Tiêu Vĩnh Linh...
  area: number; // ha
  location: string;
  region: string; // Ea H'leo, Cư M'gar, Buôn Hồ...
  seasonStartDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  actualHarvestDate?: string;
  expectedYield: number; // kg
  actualYield: number; // kg (tổng từ các đợt thu hoạch)
  associatedHouseholds: number;
  manager: string;
  description: string;
  status: LotStatus;
  imageUrl: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  code: string; // CP-2026-001
  lotId: string;
  lotCode: string;
  category: ExpenseCategory;
  name: string;
  amount: number; // VNĐ
  date: string; // YYYY-MM-DD
  executor: string;
  supplier?: string;
  note?: string;
  createdAt: string;
}

export interface ProductionLog {
  id: string;
  lotId: string;
  date: string; // YYYY-MM-DD
  activityType: LogActivityType;
  title: string;
  content: string;
  executor: string;
  materialsUsed?: string; // Vật tư (e.g., Phân hữu cơ sinh học 50kg, Chế phẩm sinh học...)
  imageUrl?: string;
  isPublic: boolean; // Công khai lên trang truy xuất nguồn gốc
  linkedExpenseId?: string;
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  lotId: string;
  batchNumber: number; // Đợt 1, đợt 2...
  date: string; // YYYY-MM-DD
  yieldKg: number; // kg
  qualityGrade: 'Loại 1' | 'Loại 2' | 'Loại 3' | 'Đạt chuẩn xuất khẩu';
  recordedBy: string;
  note?: string;
  createdAt: string;
}

export interface TraceabilityItem {
  id: string;
  traceCode: string; // TRACE-SR-001
  lotId: string;
  lotCode: string;
  productName: string;
  publishedDate: string;
  isPublished: boolean;
  scanCount: number;
  notes?: string;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  type: 'lot_created' | 'expense_added' | 'log_added' | 'harvest_recorded' | 'trace_published';
  title: string;
  description: string;
  actor: string;
  lotCode?: string;
}

export type UserRole = 'director' | 'accountant' | 'technician' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar?: string;
  phone: string;
  department: string;
}
