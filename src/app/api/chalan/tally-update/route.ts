// Location: src/app/api/chalan/tally-update//route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'tally-update', '')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'tally-update', '')
}
