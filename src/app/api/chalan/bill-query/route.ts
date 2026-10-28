// GET /api/chalan/bill-query?billNo=BILL-2501-0042
// Returns full bill detail including payments and client info
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { queryBill } from '@/lib/billing-service'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const billNo = searchParams.get('billNo') || searchParams.get('billNumber')

  if (!billNo) return NextResponse.json({ error: 'billNo is required' }, { status: 400 })

  try {
    const bill = await queryBill(billNo)
    if (!bill) return NextResponse.json({ success: true, data: [] })

    const formatted = {
      billNo: bill.billNumber,
      clientName: bill.client.companyName,
      clientCode: bill.client.clientCode,
      clientEmail: bill.client.email,
      date: bill.billDate,
      dueDate: bill.dueDate,
      billType: bill.billType,
      amount: Number(bill.subtotal),
      gstAmount: Number(bill.taxAmount),
      totalAmount: Number(bill.totalAmount),
      paidAmount: Number(bill.paidAmount),
      balanceAmount: Number(bill.balanceAmount),
      status: bill.status,
      paymentStatus: bill.paidAmount >= bill.totalAmount ? 'PAID' : bill.paidAmount > 0 ? 'PARTIAL' : 'UNPAID',
      billItems: bill.billItems,
      payments: bill.payments,
      period: bill.billPeriod
        ? `${bill.billPeriod.billMonth}/${bill.billPeriod.billYear}`
        : null,
    }

    return NextResponse.json({ success: true, data: [formatted] })
  } catch (error) {
    console.error('[GET /api/chalan/bill-query]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// bill-query doesn't create bills — POST is a no-op alias for GET
export async function POST(request: NextRequest) {
  return GET(request)
}