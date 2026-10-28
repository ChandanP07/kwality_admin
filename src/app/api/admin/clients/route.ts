// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {ROLES} from '@/lib/roles'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role as any)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: any = {}

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { clientCode: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.isActive = status === 'active'
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        city: {
          select: {
            name: true,
            state: true,
            country: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { companyName: 'asc' }
      ]
    })

    // Transform data for the component
    const transformedClients = clients.map(client => ({
      id: client.id,
      clientCode: client.clientCode,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      city: client.city?.name || 'Unknown',
      state: client.city?.state || 'Unknown',
      isActive: client.isActive
    }))

    return NextResponse.json({ clients: transformedClients })

  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}