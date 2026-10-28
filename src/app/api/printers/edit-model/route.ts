import { NextRequest } from 'next/server'
import { handlePrinterRequest } from '@/lib/printer-handler'
export async function GET(req: NextRequest) { return handlePrinterRequest(req, 'edit-model') }
export async function POST(req: NextRequest) { return handlePrinterRequest(req, 'edit-model') }