// app/api/client/bills/route.ts
// GET — list all bills for the logged-in client

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession } from '@/lib/client-auth'

// ─── GET /api/client/bills ────────────────────────────────────────────────────
// Returns all bills for this client including line items and payment status.
// pdfUrl is included so the client can download the invoice directly.
export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // e.g. ?status=PENDING

    const bills = await prisma.bill.findMany({
      where: {
        clientId: auth.clientId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        billItems: true,
        payments: {
          select: {
            amount: true,
            paymentMethod: true,
            paymentDate: true,
            status: true,
          },
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { billDate: 'desc' },
    })

    // Shape the response to match what the client UI expects:
    // - paid: boolean (true if status === PAID)
    // - overdue: boolean
    // - amount: totalAmount as a number
    // - invoiceNo: billNumber
    // - attachment: pdfUrl (for download button)
    const formatted = bills.map((bill) => ({
      id: bill.id,
      invoiceNo: bill.billNumber,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      billType: bill.billType,
      amount: Number(bill.totalAmount),
      paidAmount: Number(bill.paidAmount),
      balanceAmount: Number(bill.balanceAmount),
      status: bill.status,
      paid: bill.status === 'PAID',
      overdue: bill.overdue || bill.status === 'OVERDUE',
      attachment: bill.pdfUrl ?? null,
      billItems: bill.billItems,
      payments: bill.payments,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('[GET /api/client/bills]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}