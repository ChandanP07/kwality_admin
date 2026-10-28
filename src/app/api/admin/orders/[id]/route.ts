// app/api/admin/orders/[id]/route.ts
// GET   — single order detail
// PATCH — update order status, tracking number, notes

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']

export async function GET(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        client: true,
        orderItems: { include: { cartridgeModel: true } },
        dispatches: {
          include: { dispatchItems: { include: { cartridge: { include: { model: true } } } } },
          orderBy: { dispatchDate: 'desc' },
        },
        location: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('[GET /api/admin/orders/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json()

    // Only allow updating specific fields — never clientId
    const allowedFields: Record<string, any> = {}
    if (body.status)       allowedFields.status       = body.status
    if (body.priority)     allowedFields.priority     = body.priority
    if (body.notes)        allowedFields.notes        = body.notes
    if (body.totalAmount !== undefined) allowedFields.totalAmount = body.totalAmount

    const order = await prisma.order.update({
      where: { id: id },
      data: {
        ...allowedFields,
        updatedAt: new Date(),
      },
      include: {
        client: { select: { companyName: true, email: true } },
      },
    })

    // If status changed to DISPATCHED and trackingNumber provided, create/update dispatch
    if (body.status === 'DISPATCHED' && body.trackingNumber) {
      const existing = await prisma.dispatch.findFirst({ where: { orderId: id } })
      if (existing) {
        await prisma.dispatch.update({
          where: { id: existing.id },
          data: {
            status: 'DISPATCHED',
            trackingNumber: body.trackingNumber,
            courierCompany: body.courierCompany ?? existing.courierCompany,
            deliveryBoy: body.deliveryBoy ?? existing.deliveryBoy,
          },
        })
      } else {
        await prisma.dispatch.create({
          data: {
            dispatchNumber: `DSP-${Date.now()}`,
            orderId: id,
            clientId: order.clientId,
            status: 'DISPATCHED',
            trackingNumber: body.trackingNumber,
            courierCompany: body.courierCompany ?? null,
            deliveryBoy: body.deliveryBoy ?? null,
          },
        })
      }
    }

    // If status changed to DELIVERED update dispatch too
    if (body.status === 'DELIVERED') {
      await prisma.dispatch.updateMany({
        where: { orderId: id, status: { not: 'DELIVERED' } },
        data: { status: 'DELIVERED', deliveryDate: new Date() },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('[PATCH /api/admin/orders/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}