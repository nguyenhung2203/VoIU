import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' VNĐ';
}

export function formatCurrencyShort(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 đ';
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace('.0', '') + ' tỷ';
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace('.0', '') + ' tr';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + ' k';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg === null || kg === undefined || isNaN(kg)) return '0 kg';
  if (kg >= 1000) {
    const tons = kg / 1000;
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(tons) + ' tấn';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(kg)) + ' kg';
}

export function formatArea(ha: number | null | undefined): string {
  if (ha === null || ha === undefined || isNaN(ha)) return '0 ha';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(ha) + ' ha';
}

export function formatUnitPrice(pricePerKg: number | null | undefined): string {
  if (pricePerKg === null || pricePerKg === undefined || isNaN(pricePerKg) || pricePerKg <= 0) {
    return 'Chưa đủ dữ liệu';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(pricePerKg)) + ' VNĐ/kg';
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm dd/MM/yyyy', { locale: vi });
  } catch {
    return dateString;
  }
}
