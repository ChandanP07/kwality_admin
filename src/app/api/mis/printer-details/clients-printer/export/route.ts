// Location: src/app/api/mis/printer-details/clients-printer/export/route.ts
import { NextRequest } from 'next/server'
import { handleMISExport } from '@/lib/mis-handler'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  return handleMISExport(request, 'printer-details', 'clients-printer', generateExcel)
}