
// app/api/admin/enquiries/route.ts
// GET   — all enquiries from the client landing page contact form
// PATCH — update enquiry status (new → contacted → converted → closed)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { name:        { contains: search, mode: 'insensitive' } },
        { email:       { contains: search, mode: 'insensitive' } },
        { company:     { contains: search, mode: 'insensitive' } },
        { printerName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(enquiries)
  } catch (error) {
    console.error('[GET /api/admin/enquiries]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const updated = await prisma.enquiry.update({
      where: { id: body.id },
      data:  { status: body.status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/admin/enquiries]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}