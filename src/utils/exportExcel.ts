import * as XLSX from 'xlsx';

export function exportToExcel(data: Record<string, unknown>[], fileName: string, sheetName: string = 'Sheet1') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Auto-fit column width approx
    const maxCols = Object.keys(data[0] || {}).length;
    const colWidths = Array(maxCols).fill({ wch: 18 });
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error('Lỗi xuất file Excel:', error);
    return false;
  }
}
