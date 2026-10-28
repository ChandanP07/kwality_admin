// Location: src/app/api/chalan/bill-updates/tally-name/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'tally-name')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'tally-name')
}
