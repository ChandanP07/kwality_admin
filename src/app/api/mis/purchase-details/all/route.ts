// Location: src/app/api/mis/purchase-details/all/route.ts
import { NextRequest } from 'next/server'
import { handleMISRequest } from '@/lib/mis-handler'

export async function GET(request: NextRequest) {
  return handleMISRequest(request, 'purchase-details', 'all')
}