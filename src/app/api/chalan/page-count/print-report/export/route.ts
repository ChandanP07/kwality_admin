// Location: src/app/api/chalan/page-count/print-report/export/route.ts
import { NextRequest } from 'next/server'
import { handleChalanExport } from '@/lib/chalan-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleChalanExport(request, 'page-count', 'print-report', generateExcel)
}
