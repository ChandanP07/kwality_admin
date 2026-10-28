// Location: src/app/api/chalan/einvoice/pending-irn/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'einvoice', 'pending-irn')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'einvoice', 'pending-irn')
}
