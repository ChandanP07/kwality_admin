// Location: src/app/api/mis/sales-mis/per-page/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'sales-mis', 'per-page', generateExcel)
}