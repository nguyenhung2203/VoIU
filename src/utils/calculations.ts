import { Expense, HarvestRecord, ProductionLot } from '../types';

/**
 * Tính tổng chi phí của 1 lô
 */
export function calculateLotTotalCost(lotId: string, expenses: Expense[]): number {
  return expenses
    .filter((e) => e.lotId === lotId)
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Tính tổng sản lượng thực tế đã thu hoạch của 1 lô từ các đợt thu hoạch
 */
export function calculateLotActualYield(lotId: string, harvests: HarvestRecord[]): number {
  return harvests
    .filter((h) => h.lotId === lotId)
    .reduce((sum, h) => sum + h.yieldKg, 0);
}

/**
 * Tính giá thành bình quân trên 1 kg của 1 lô:
 * Giá thành/kg = Tổng chi phí / Tổng sản lượng thực tế (kg)
 * Chỉ tính khi sản lượng thực tế > 0 và tổng chi phí > 0.
 */
export function calculateLotCostPerKg(
  lotId: string,
  expenses: Expense[],
  harvests: HarvestRecord[]
): number | null {
  const totalCost = calculateLotTotalCost(lotId, expenses);
  const actualYield = calculateLotActualYield(lotId, harvests);

  if (actualYield > 0 && totalCost > 0) {
    return Math.round((totalCost / actualYield) * 10) / 10;
  }
  return null;
}

/**
 * Tính giá thành bình quân toàn hệ thống (hoặc theo danh sách lô lọc)
 * Công thức: Tổng chi phí của các lô ĐÃ THU HOẠCH / Tổng sản lượng thực thu của các lô đó
 */
export function calculateAverageCostPerKg(
  lots: ProductionLot[],
  expenses: Expense[],
  harvests: HarvestRecord[]
): number | null {
  // Lọc các lô đã có thu hoạch thực tế > 0
  let totalCostOfHarvestedLots = 0;
  let totalHarvestedKg = 0;

  lots.forEach((lot) => {
    const lotHarvests = harvests.filter((h) => h.lotId === lot.id);
    const lotYield = lotHarvests.reduce((sum, h) => sum + h.yieldKg, 0);

    if (lotYield > 0) {
      const lotCost = expenses
        .filter((e) => e.lotId === lot.id)
        .reduce((sum, e) => sum + e.amount, 0);
      if (lotCost > 0) {
        totalCostOfHarvestedLots += lotCost;
        totalHarvestedKg += lotYield;
      }
    }
  });

  if (totalHarvestedKg > 0 && totalCostOfHarvestedLots > 0) {
    return Math.round((totalCostOfHarvestedLots / totalHarvestedKg) * 10) / 10;
  }
  return null;
}

/**
 * Tính chi phí trên mỗi hecta (VNĐ/ha)
 */
export function calculateCostPerHectare(totalCost: number, area: number): number | null {
  if (area > 0 && totalCost > 0) {
    return Math.round(totalCost / area);
  }
  return null;
}

/**
 * Tính sản lượng trên mỗi hecta (kg/ha hoặc tấn/ha)
 */
export function calculateYieldPerHectare(totalYield: number, area: number): number | null {
  if (area > 0 && totalYield > 0) {
    return Math.round(totalYield / area);
  }
  return null;
}
