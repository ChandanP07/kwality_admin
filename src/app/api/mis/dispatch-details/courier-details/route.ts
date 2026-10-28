// Location: src/app/api/mis/dispatch-details/courier-details/route.ts
import { NextRequest } from 'next/server'
import { handleMISRequest } from '@/lib/mis-handler'

export async function GET(request: NextRequest) {
  return handleMISRequest(request, 'dispatch-details', 'courier-details')
}