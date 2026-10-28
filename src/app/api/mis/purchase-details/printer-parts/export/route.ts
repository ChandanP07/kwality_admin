// Location: src/app/api/mis/purchase-details/printer-parts/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'purchase-details', 'printer-parts', generateExcel)
}