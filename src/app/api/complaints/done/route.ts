import { NextRequest } from 'next/server'
import { handleComplaintsRequest } from '@/lib/complaints-handler'
export async function GET(req: NextRequest) { return handleComplaintsRequest(req, 'done') }
export async function POST(req: NextRequest) { return handleComplaintsRequest(req, 'done') }