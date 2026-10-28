// Location: src/app/api/mis/factory-details/stock-by-workman/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'factory-details', 'stock-by-workman', generateExcel)
}