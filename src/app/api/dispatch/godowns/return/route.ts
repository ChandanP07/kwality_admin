import { NextRequest } from 'next/server'
import { handleDispatchRequest } from '@/lib/dispatch-handler'
export async function GET(req: NextRequest) { return handleDispatchRequest(req, 'godowns-return') }
export async function POST(req: NextRequest) { return handleDispatchRequest(req, 'godowns-return') }