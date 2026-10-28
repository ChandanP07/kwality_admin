import ExcelJS from 'exceljs'

interface ExcelColumn {
  header: string
  key: string
  width?: number
}

interface ExcelExportOptions {
  sheetName: string
  title: string
  columns: ExcelColumn[]
  data: any[]
  dateRange?: string
}

export async function generateExcel(options: ExcelExportOptions): Promise<Buffer> {
  const { sheetName, title, columns, data, dateRange } = options

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Title row (merged across all columns)
  const titleRow = worksheet.addRow([title])
  worksheet.mergeCells(1, 1, 1, columns.length)
  titleRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
  titleRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' } // Blue header as shown in document
  }
  titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
  titleRow.height = 25

  // Date range row if provided
  if (dateRange) {
    const dateRow = worksheet.addRow([dateRange])
    worksheet.mergeCells(2, 1, 2, columns.length)
    dateRow.font = { size: 10 }
    dateRow.alignment = { horizontal: 'center' }
  }

  // Header row
  const headerRow = worksheet.addRow(columns.map(col => col.header))
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF666666' } // Gray header row
  }
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
  headerRow.height = 20

  // Set column widths
  columns.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width || 15
  })

  // Data rows
  data.forEach((item, index) => {
    const row = worksheet.addRow(columns.map(col => item[col.key] || ''))
    
    // Add borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
  })

  // Total row if numeric data
  const hasNumericColumns = columns.some(col => 
    data.length > 0 && typeof data[0][col.key] === 'number'
  )

  if (data.length > 0 && hasNumericColumns) {
    const totalRow = worksheet.addRow(['TOTAL', ...Array(columns.length - 1).fill('')])
    totalRow.font = { bold: true }
    
    columns.forEach((col, index) => {
      if (index > 0 && typeof data[0][col.key] === 'number') {
        const total = data.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0)
        totalRow.getCell(index + 1).value = total
      }
    })
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
