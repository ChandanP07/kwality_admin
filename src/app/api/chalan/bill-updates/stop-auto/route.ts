// Location: src/app/api/chalan/bill-updates/stop-auto/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'stop-auto')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'stop-auto')
}
