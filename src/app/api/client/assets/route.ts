// app/api/client/assets/route.ts
// GET — list all printers (assets) assigned to the logged-in client

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession } from '@/lib/client-auth'

// ─── GET /api/client/assets ───────────────────────────────────────────────────
// Returns all ClientPrinter records for this client.
// Includes the printer model details and latest page count reading.
export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const assets = await prisma.clientPrinter.findMany({
      where: {
        clientId: auth.clientId,
        isActive: true,
      },
      include: {
        printer: {
          include: {
            model: {
              select: {
                modelName: true,
                brand: true,
                type: true,
              },
            },
          },
        },
        pageCountings: {
          orderBy: { readingDate: 'desc' },
          take: 1, // only latest reading
          select: {
            pageCount: true,
            pagesUsed: true,
            readingDate: true,
          },
        },
        complaints: {
          where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
          select: { id: true, status: true },
        },
      },
      orderBy: { installDate: 'desc' },
    })

    // Shape response for the client UI
    const formatted = assets.map((asset) => ({
      id: asset.id,
      serialNumber: asset.printer.serialNumber,
      modelName: asset.printer.model.modelName,
      brand: asset.printer.model.brand,
      printerType: asset.printer.model.type,
      installDate: asset.installDate,
      rentalType: asset.rentalType,
      monthlyRental: asset.monthlyRental ? Number(asset.monthlyRental) : null,
      perPageRate: asset.perPageRate ? Number(asset.perPageRate) : null,
      currentPageCount: asset.currentPageCount,
      lastReadingDate: asset.lastReadingDate,
      latestReading: asset.pageCountings[0] ?? null,
      openComplaints: asset.complaints.length,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('[GET /api/client/assets]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}