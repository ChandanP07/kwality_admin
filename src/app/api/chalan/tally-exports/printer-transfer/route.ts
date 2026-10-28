// Location: src/app/api/chalan/tally-exports/printer-transfer/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'tally-exports', 'printer-transfer')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'tally-exports', 'printer-transfer')
}
