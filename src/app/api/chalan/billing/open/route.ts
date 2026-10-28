// POST /api/chalan/billing/open  — admin-supplied bill number, one-off billing
// GET  /api/chalan/billing/open  — list open/maintenance bills
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createOpenBill } from '@/lib/billing-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { clientId, amount, billNumber, description } = body

    if (!clientId) return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    if (!amount) return NextResponse.json({ error: 'amount is required' }, { status: 400 })
    if (!billNumber) return NextResponse.json({ error: 'billNumber is required' }, { status: 400 })

    const result = await createOpenBill({
      clientId,
      amount: parseFloat(amount),
      billNumber,
      description,
      createdById: (session.user as any).id,
    })

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 })
    return NextResponse.json({ success: true, bill: result.bill }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/chalan/billing/open]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId') || searchParams.get('client')

  try {
    const where: any = { billType: 'MAINTENANCE' }
    if (clientId) where.clientId = clientId

    const bills = await prisma.bill.findMany({
      where,
      include: {
        client: { select: { companyName: true, clientCode: true } },
        billItems: { take: 1 },
      },
      orderBy: { billDate: 'desc' },
      take: 100,
    })

    const data = bills.map((b, i) => ({
      sr: i + 1,
      billNo: b.billNumber,
      clientName: b.client.companyName,
      description: b.billItems[0]?.description ?? '',
      amount: Number(b.subtotal),
      totalAmount: Number(b.totalAmount),
      status: b.status,
      billDate: b.billDate,
    }))

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('[GET /api/chalan/billing/open]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}