// Location: src/app/api/chalan/tally-payment/pending/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'tally-payment', 'pending')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'tally-payment', 'pending')
}
