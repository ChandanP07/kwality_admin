// Location: src/app/api/mis/factory-details/cartridge-stock/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'factory-details', 'cartridge-stock', generateExcel)
}