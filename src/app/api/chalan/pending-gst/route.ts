// GET /api/chalan/pending-gst?month=3&year=2025
// Returns all bills with pending (uncollected) GST, optionally filtered by month/year
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPendingGstBills } from '@/lib/billing-service'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined
  const year  = searchParams.get('year')  ? parseInt(searchParams.get('year')!)  : undefined

  try {
    const data = await getPendingGstBills(month, year)
    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('[GET /api/chalan/pending-gst]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}