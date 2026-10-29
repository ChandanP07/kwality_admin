// Location: src/lib/excel-export.ts
// Purpose: Professional Excel file generation with formatting

import ExcelJS from 'exceljs'
import { ExcelColumnn } from './types'

export interface ExcelColumn {
  header: string
  key: string
  width: number
}

export interface ExcelConfig {
  sheetName: string
  title: string
  columns: ExcelColumn[]
  data: any[]
  titleColor?: string
  headerColor?: string
}

export async function createExcelBuffer(
  columns: ExcelColumnn[],
  data: Record<string, unknown>[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add columns
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 15,
  }));

  // Add rows
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function generateExcel(config: ExcelConfig): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(config.sheetName)

  // Set default colors
  const titleColor = config.titleColor || '4472C4'
  const headerColor = config.headerColor || '666666'

  // Title Row (Row 1) - Merged cells with blue background
  const lastColumn = String.fromCharCode(64 + config.columns.length)
  sheet.mergeCells(`A1:${lastColumn}1`)
  const titleCell = sheet.getCell('A1')
  titleCell.value = config.title
  titleCell.font = { 
    bold: true, 
    size: 16, 
    color: { argb: 'FFFFFFFF' } 
  }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: `FF${titleColor}` }
  }
  titleCell.alignment = { 
    horizontal: 'center', 
    vertical: 'middle' 
  }
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  }
  sheet.getRow(1).height = 30

  // Header Row (Row 2) - Gray background with white text
  const headerRow = sheet.addRow(config.columns.map(col => col.header))
  headerRow.font = { 
    bold: true, 
    color: { argb: 'FFFFFFFF' } 
  }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: `FF${headerColor}` }
  }
  headerRow.alignment = { 
    horizontal: 'center', 
    vertical: 'middle' 
  }
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 25

  // Data Rows (Starting from Row 3)
  config.data.forEach((row) => {
    const dataRow = sheet.addRow(config.columns.map(col => row[col.key] || ''))
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      cell.alignment = { 
        vertical: 'middle' 
      }
    })
  })

  // Set column widths
  config.columns.forEach((col, idx) => {
    sheet.getColumn(idx + 1).width = col.width
  })

  // Freeze first two rows (title and header)
  sheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 2 }
  ]

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}