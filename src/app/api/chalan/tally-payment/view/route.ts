// Location: src/app/api/chalan/tally-payment/view/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'tally-payment', 'view')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'tally-payment', 'view')
}
