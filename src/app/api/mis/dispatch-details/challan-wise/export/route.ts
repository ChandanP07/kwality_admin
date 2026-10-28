// Location: src/app/api/mis/dispatch-details/challan-wise/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'dispatch-details', 'challan-wise', generateExcel)
}