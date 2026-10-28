// app/api/admin/orders/route.ts
// GET  — all orders across all clients (admin full view)
// Admin can filter by status, clientId, date range

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']

function requireAdmin(role: string) {
  return ADMIN_ROLES.includes(role)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !requireAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status    = searchParams.get('status')
    const clientId  = searchParams.get('clientId')
    const search    = searchParams.get('search')
    const from      = searchParams.get('from')
    const to        = searchParams.get('to')
    const page      = parseInt(searchParams.get('page') ?? '1')
    const limit     = parseInt(searchParams.get('limit') ?? '50')

    const where: any = {}

    if (status)   where.status   = status
    if (clientId) where.clientId = clientId

    if (search) {
      where.OR = [
        { orderNumber:    { contains: search, mode: 'insensitive' } },
        { productName:    { contains: search, mode: 'insensitive' } },
        { serialNumber:   { contains: search, mode: 'insensitive' } },
        { contactPerson:  { contains: search, mode: 'insensitive' } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (from || to) {
      where.orderDate = {}
      if (from) where.orderDate.gte = new Date(from)
      if (to)   where.orderDate.lte = new Date(new Date(to).setHours(23, 59, 59, 999))
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          client: {
            select: { id: true, companyName: true, clientCode: true, phone: true, email: true },
          },
          dispatches: {
            select: { status: true, trackingNumber: true, courierCompany: true, deliveryDate: true },
            orderBy: { dispatchDate: 'desc' },
            take: 1,
          },
          location: { select: { name: true } },
        },
        orderBy: { orderDate: 'desc' },
        skip:  (page - 1) * limit,
        take:  limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[GET /api/admin/orders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}