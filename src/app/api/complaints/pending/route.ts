import { NextRequest } from 'next/server'
import { handleComplaintsRequest } from '@/lib/complaints-handler'
export async function GET(req: NextRequest) { return handleComplaintsRequest(req, 'pending') }
export async function POST(req: NextRequest) { return handleComplaintsRequest(req, 'pending') }