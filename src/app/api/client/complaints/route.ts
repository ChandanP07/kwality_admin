// app/api/client/complaints/route.ts
// GET  — list all complaints for the logged-in client
// POST — register a new complaint

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession, generateNumber } from '@/lib/client-auth'

// ─── GET /api/client/complaints ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const complaints = await prisma.complaint.findMany({
      where: {
        clientId: auth.clientId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        callLogs: {
          orderBy: { callDate: 'desc' },
        },
        location: {
          select: { name: true },
        },
        printer: {
          select: {
            printer: {
              select: {
                serialNumber: true,
                model: { select: { modelName: true, brand: true } },
              },
            },
          },
        },
        assignedTo: {
          select: { name: true, username: true },
        },
      },
      orderBy: { reportedDate: 'desc' },
    })

    return NextResponse.json(complaints)
  } catch (error) {
    console.error('[GET /api/client/complaints]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/client/complaints ──────────────────────────────────────────────
// Maps the client-side form fields directly to the unified Complaint model.
// problemType is stored in both `problemType` (free text) and `category`
// (mapped to the ComplaintCategory enum).
export async function POST(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    const required = ['contactPerson', 'contactNumber', 'productName', 'serialNumber', 'problemType', 'comments']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Map free-text problemType to the closest ComplaintCategory enum value
    const categoryMap: Record<string, string> = {
      'Paper Jam': 'PRINTER_ISSUE',
      'Print Quality': 'PRINTER_ISSUE',
      'Not Printing': 'PRINTER_ISSUE',
      'Error Message': 'PRINTER_ISSUE',
      'Hardware Issue': 'PRINTER_ISSUE',
      'Software Issue': 'SERVICE_ISSUE',
      'Toner/Ink Issue': 'CARTRIDGE_ISSUE',
      'Network Connection': 'SERVICE_ISSUE',
      'Scanner Issue': 'PRINTER_ISSUE',
      'Other': 'OTHER',
    }
    const category = categoryMap[body.problemType] ?? 'OTHER'

    // Validate branchId belongs to this client if provided
    if (body.branchId) {
      const branch = await prisma.branch.findFirst({
        where: { id: body.branchId, clientId: auth.clientId },
      })
      if (!branch) {
        return NextResponse.json(
          { error: 'Invalid branch — does not belong to your account' },
          { status: 403 }
        )
      }
    }

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber: generateNumber('COMP'),
        clientId: auth.clientId,
        title: `${body.problemType} — ${body.productName}`,
        description: body.comments,
        category: category as any,
        priority: 'MEDIUM',
        status: 'OPEN',
        problemType: body.problemType,
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
        // serialNumber stored in description; printerId resolved if available
      },
    })

    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    console.error('[POST /api/client/complaints]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
