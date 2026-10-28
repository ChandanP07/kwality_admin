// GET  /api/chalan/send-bills/edit?challanNo=BILL-2501-0042  — find a bill to edit
// POST /api/chalan/send-bills/edit                           — update amount/remarks
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { queryBill, editBill } from '@/lib/billing-service'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const challanNo = searchParams.get('challanNo') || searchParams.get('billNo')

  try {
    if (challanNo) {
      const bill = await queryBill(challanNo)
      if (!bill) return NextResponse.json({ success: true, data: [] })
      return NextResponse.json({
        success: true,
        data: [{
          id: bill.id,
          billNo: bill.billNumber,
          clientName: bill.client.companyName,
          date: bill.billDate,
          amount: Number(bill.totalAmount),
          status: bill.status,
        }],
      })
    }
    return NextResponse.json({ success: true, data: [] })
  } catch (error) {
    console.error('[GET /api/chalan/send-bills/edit]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { billId, amount, remarks } = body

    if (!billId) return NextResponse.json({ error: 'billId is required' }, { status: 400 })

    const result = await editBill(billId, {
      amount: amount !== undefined ? parseFloat(amount) : undefined,
      remarks,
    })

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 })
    return NextResponse.json({ success: true, bill: result.bill })
  } catch (error) {
    console.error('[POST /api/chalan/send-bills/edit]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}