// Location: src/app/api/chalan/einvoice/tally2soft/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'einvoice', 'tally2soft')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'einvoice', 'tally2soft')
}
