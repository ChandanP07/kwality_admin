// app/api/client/orders/route.ts
// GET  — list all orders for the logged-in client
// POST — create a new order linked to the client

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession, generateNumber } from '@/lib/client-auth'

// ─── GET /api/client/orders ───────────────────────────────────────────────────
// Returns all orders belonging to this client, newest first.
// Each order includes its dispatch status so the client can track delivery.
export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // optional filter e.g. ?status=PENDING

    const orders = await prisma.order.findMany({
      where: {
        clientId: auth.clientId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        dispatches: {
          select: {
            status: true,
            trackingNumber: true,
            courierCompany: true,
            deliveryDate: true,
            dispatchDate: true,
          },
          orderBy: { dispatchDate: 'desc' },
          take: 1, // only the latest dispatch per order
        },
        location: {
          select: { name: true, address: true },
        },
      },
      orderBy: { orderDate: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('[GET /api/client/orders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/client/orders ──────────────────────────────────────────────────
// Creates a new order. clientId is taken from the session — never from the body.
// This prevents a client from creating orders on behalf of another client.
export async function POST(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Required field validation
    const required = ['productName', 'serialNumber', 'type', 'modelNumber', 'quantity', 'contactPerson', 'contactNumber']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // If locationId is provided, verify it belongs to this client's branches
    if (body.locationId) {
      const location = await prisma.location.findFirst({
        where: {
          id: body.locationId,
          branch: { clientId: auth.clientId },
        },
      })
      if (!location) {
        return NextResponse.json(
          { error: 'Invalid location — does not belong to your account' },
          { status: 403 }
        )
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateNumber('ORD'),
        clientId: auth.clientId,
        clientUserId: auth.userId,
        status: 'PENDING',
        priority: 'NORMAL',
        productName: body.productName,
        serialNumber: body.serialNumber,
        type: body.type,
        modelNumber: body.modelNumber,
        quantity: parseInt(body.quantity),
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
        poNumber: body.poNumber || null,
        notes: body.comments || null,
        locationId: body.locationId || null,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('[POST /api/client/orders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
