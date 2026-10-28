// Location: src/app/api/mis/empty-details/client-wise/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'empty-details', 'client-wise', generateExcel)
}