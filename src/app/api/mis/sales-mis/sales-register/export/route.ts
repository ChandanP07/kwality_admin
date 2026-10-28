// Location: src/app/api/mis/sales-mis/sales-register/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'sales-mis', 'sales-register', generateExcel)
}