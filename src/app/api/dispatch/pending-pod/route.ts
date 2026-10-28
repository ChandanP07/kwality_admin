import { NextRequest } from 'next/server'
import { handleDispatchRequest } from '@/lib/dispatch-handler'
export async function GET(req: NextRequest) { return handleDispatchRequest(req, 'pending-pod') }
export async function POST(req: NextRequest) { return handleDispatchRequest(req, 'pending-pod') }