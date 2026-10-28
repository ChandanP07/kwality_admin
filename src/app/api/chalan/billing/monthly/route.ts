// POST /api/chalan/billing/monthly  — create a new monthly rental bill
// GET  /api/chalan/billing/monthly  — list monthly bills (optionally filtered by client)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createMonthlyBill } from '@/lib/billing-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { clientId, month, year, amount, remarks } = body

    if (!clientId) return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    if (!month || !year) return NextResponse.json({ error: 'month and year are required' }, { status: 400 })
    if (!amount) return NextResponse.json({ error: 'amount is required' }, { status: 400 })

    const result = await createMonthlyBill({
      clientId,
      billMonth: parseInt(month),
      billYear: parseInt(year),
      amount: parseFloat(amount),
      remarks,
      createdById: (session.user as any).id,
    })

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 })
    return NextResponse.json({ success: true, bill: result.bill }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/chalan/billing/monthly]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId') || searchParams.get('client')

  try {
    const where: any = { billType: 'RENTAL' }
    if (clientId) where.clientId = clientId

    const bills = await prisma.bill.findMany({
      where,
      include: {
        client: { select: { companyName: true, clientCode: true } },
        billPeriod: true,
        billItems: true,
      },
      orderBy: { billDate: 'desc' },
      take: 100,
    })

    const data = bills.map((b, i) => ({
      sr: i + 1,
      billNo: b.billNumber,
      clientName: b.client.companyName,
      clientCode: b.client.clientCode,
      month: b.billPeriod?.billMonth,
      year: b.billPeriod?.billYear,
      amount: Number(b.subtotal),
      taxAmount: Number(b.taxAmount),
      totalAmount: Number(b.totalAmount),
      status: b.status,
      billDate: b.billDate,
      dueDate: b.dueDate,
    }))

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('[GET /api/chalan/billing/monthly]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}