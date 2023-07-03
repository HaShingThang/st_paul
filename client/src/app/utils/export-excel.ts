import * as XLSX from 'xlsx';

// Export Excel
export function exportToExcel(
  excelData: any[],
  headerColumns: string[],
  sheetName: string,
  fileName: string
) {
  const worksheet = XLSX.utils.aoa_to_sheet([headerColumns, ...excelData]);

  // Table Header Style
  const headerStyle = {
    alignment: { horizontal: 'center', vertical: 'center' },
    font: { bold: true },
  };
  const headerRange = XLSX.utils.decode_range(worksheet['!ref']!);
  for (let i = headerRange.s.r; i <= headerRange.e.r; i++) {
    for (let j = headerRange.s.c; j <= headerRange.e.c; j++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
      const cell = worksheet[cellRef];
      cell.s = headerStyle;
    }
  }

  // Table Body Style
  const bodyStyle = {
    alignment: { horizontal: 'left', vertical: 'center' },
  };
  const bodyRange = XLSX.utils.decode_range(worksheet['!ref']!);
  for (let i = bodyRange.s.r + 1; i <= bodyRange.e.r; i++) {
    for (let j = bodyRange.s.c; j <= bodyRange.e.c; j++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
      const cell = worksheet[cellRef];
      cell.s = bodyStyle;
    }
  }

  // Column Widths
  const columnWidths = headerColumns.map((header: any, columnIndex: any) => {
    const columnData = excelData.map((row: any) => row[columnIndex]);
    const columnWidth = Math.max(
      header.length,
      ...columnData.map((cell: any) => cell.toString().length)
    );
    return { wch: columnWidth };
  });
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
