// app/api/pending-work/route.ts
// Returns orders and complaints that are pending/in-progress
// The old route used prisma.partner which doesn't exist in our schema.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [pendingOrders, openComplaints] = await Promise.all([
      prisma.order.findMany({
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY'] } },
        include: {
          client: { select: { companyName: true, clientCode: true } },
        },
        orderBy: { orderDate: 'asc' },
        take: 50,
      }),
      prisma.complaint.findMany({
        where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } },
        include: {
          client: { select: { companyName: true, clientCode: true } },
          assignedTo: { select: { username: true, name: true } },
        },
        orderBy: { reportedDate: 'asc' },
        take: 50,
      }),
    ])

    return NextResponse.json({
      success: true,
      pendingOrders,
      openComplaints,
      total: pendingOrders.length + openComplaints.length,
    })
  } catch (error) {
    console.error('Error fetching pending work:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}