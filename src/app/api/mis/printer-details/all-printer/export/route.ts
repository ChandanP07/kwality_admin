// Location: src/app/api/mis/printer-details/all-printer/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'printer-details', 'all-printer', generateExcel)
}