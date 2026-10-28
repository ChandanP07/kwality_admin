// POST /api/chalan/billing/current  — bill for an arbitrary date range
// GET  /api/chalan/billing/current  — list current bills
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCurrentBill } from '@/lib/billing-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { clientId, amount, periodStart, periodEnd, remarks } = body

    if (!clientId) return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    if (!amount) return NextResponse.json({ error: 'amount is required' }, { status: 400 })
    if (!periodStart || !periodEnd) return NextResponse.json({ error: 'periodStart and periodEnd are required' }, { status: 400 })

    const result = await createCurrentBill({
      clientId,
      amount: parseFloat(amount),
      periodStart,
      periodEnd,
      remarks,
      createdById: (session.user as any).id,
    })

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 })
    return NextResponse.json({ success: true, bill: result.bill }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/chalan/billing/current]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId') || searchParams.get('client')
  const fromDate = searchParams.get('fromDate')
  const toDate = searchParams.get('toDate')

  try {
    const where: any = {}
    if (clientId) where.clientId = clientId
    if (fromDate && toDate) {
      where.billDate = { gte: new Date(fromDate), lte: new Date(toDate) }
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        client: { select: { companyName: true, clientCode: true } },
        billPeriod: true,
      },
      orderBy: { billDate: 'desc' },
      take: 100,
    })

    const data = bills.map((b, i) => ({
      sr: i + 1,
      billNo: b.billNumber,
      clientName: b.client.companyName,
      periodStart: b.billPeriod?.periodStart,
      periodEnd: b.billPeriod?.periodEnd,
      amount: Number(b.subtotal),
      taxAmount: Number(b.taxAmount),
      totalAmount: Number(b.totalAmount),
      status: b.status,
      billDate: b.billDate,
    }))

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('[GET /api/chalan/billing/current]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}