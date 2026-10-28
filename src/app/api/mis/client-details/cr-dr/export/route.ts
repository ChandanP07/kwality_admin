// Location: src/app/api/mis/client-details/cr-dr/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'client-details', 'cr-dr', generateExcel)
}