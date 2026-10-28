import { NextRequest } from 'next/server'
import { handleMarketingRequest } from '@/lib/marketing-handler'
export async function GET(req: NextRequest) { return handleMarketingRequest(req, 'pending') }
export async function POST(req: NextRequest) { return handleMarketingRequest(req, 'pending') }