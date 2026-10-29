// admin/src/app/api/admin/bills/[id]/pdf/route.ts
// GET  — serves the PDF for a bill (used by client portal download button)
//        If pdfUrl exists in DB, redirects to it.
//        If not generated yet, generates it on the fly and returns it.
// POST — admin triggers PDF generation, saves base64 to DB, marks bill as SENT

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateBillPDF } from '@/lib/generate-bill-pdf'

const COMPANY = {
  name:    process.env.COMPANY_NAME    || 'PrintCare Solutions',
  address: process.env.COMPANY_ADDRESS || 'Mumbai, Maharashtra',
  gst:     process.env.COMPANY_GST     || '27XXXXX1234X1Z5',
  phone:   process.env.COMPANY_PHONE   || '+91-98190-33222',
  email:   process.env.COMPANY_EMAIL   || 'billing@printcare.com',
  bank:    process.env.COMPANY_BANK    || 'State Bank of India',
  account: process.env.COMPANY_ACCOUNT || '1234567890',
  ifsc:    process.env.COMPANY_IFSC    || 'SBIN0001234',
}

async function getBillWithDetails(id: string) {
  return prisma.bill.findUnique({
    where: { id },
    include: {
      client:    true,
      billItems: true,
    },
  })
}

// ── GET — serve PDF (called by client portal download button) ─────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    // Allow both admin users and CLIENT users (for portal download)
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const bill = await getBillWithDetails(id)
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    // If CLIENT role, verify this bill belongs to their client
    if (session.user.role === 'CLIENT') {
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: session.user.id },
      })
      if (!profile || profile.clientId !== bill.clientId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Generate PDF
    const pdfBuffer = await generateBillPDF({
      billNumber:   bill.billNumber,
      billDate:     new Date(bill.billDate).toLocaleDateString('en-IN'),
      dueDate:      bill.dueDate
        ? new Date(bill.dueDate).toLocaleDateString('en-IN')
        : undefined,
      billType:     bill.billType,
      status:       bill.status,
      subtotal:     Number(bill.subtotal),
      taxAmount:    Number(bill.taxAmount),
      totalAmount:  Number(bill.totalAmount),
      paidAmount:   Number(bill.paidAmount),
      balanceAmount: Number(bill.balanceAmount),
      client: {
        companyName:   bill.client.companyName,
        address:       bill.client.address,
        state:         bill.client.state,
        gstNumber:     bill.client.gstNumber ?? undefined,
        contactPerson: bill.client.contactPerson,
        email:         bill.client.email ?? undefined,
        phone:         bill.client.phone,
      },
      billItems: bill.billItems.map(item => ({
        description: item.description,
        quantity:    item.quantity,
        unitPrice:   Number(item.unitPrice),
        totalPrice:  Number(item.totalPrice),
      })),
      company: COMPANY,
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${bill.billNumber}.pdf"`,
        'Content-Length':      String(pdfBuffer.length),
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/bills/:id/pdf]', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

// ── POST — admin generates and stores PDF URL ─────────────────────────────────
// After this, bill.pdfUrl is set and client can download via GET above
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const bill = await getBillWithDetails(id)
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    // Store the API URL as pdfUrl so client knows it's downloadable
    const pdfUrl = `/api/admin/bills/${id}/pdf`

    await prisma.bill.update({
      where: { id: id },
      data:  {
        pdfUrl,
        status: bill.status === 'PENDING' ? 'SENT' : bill.status,
      },
    })

    return NextResponse.json({
      success: true,
      pdfUrl,
      message: 'PDF ready for download',
    })
  } catch (error) {
    console.error('[POST /api/admin/bills/:id/pdf]', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}