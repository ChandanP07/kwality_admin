// Location: src/app/api/chalan/page-count/verify/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'page-count', 'verify')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'page-count', 'verify')
}
