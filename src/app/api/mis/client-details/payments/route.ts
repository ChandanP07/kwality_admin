// Location: src/app/api/mis/client-details/payments/route.ts
import { NextRequest } from 'next/server'
import { handleMISRequest } from '@/lib/mis-handler'

export async function GET(request: NextRequest) {
  return handleMISRequest(request, 'client-details', 'payments')
}