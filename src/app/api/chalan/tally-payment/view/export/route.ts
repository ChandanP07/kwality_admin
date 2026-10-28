// Location: src/app/api/chalan/tally-payment/view/export/route.ts
import { NextRequest } from 'next/server'
import { handleChalanExport } from '@/lib/chalan-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleChalanExport(request, 'tally-payment', 'view', generateExcel)
}
