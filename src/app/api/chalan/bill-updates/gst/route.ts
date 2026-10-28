// Location: src/app/api/chalan/bill-updates/gst/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'gst')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'bill-updates', 'gst')
}
