// Location: src/app/api/chalan/send-bills/email/route.ts
import { NextRequest } from 'next/server'
import { handleChalanRequest } from '@/lib/chalan-handler'

export async function GET(request: NextRequest) {
  return handleChalanRequest(request, 'send-bills', 'email')
}

export async function POST(request: NextRequest) {
  return handleChalanRequest(request, 'send-bills', 'email')
}
