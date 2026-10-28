// Location: src/app/api/mis/get-clients/route.ts
// Purpose: Fetch client suggestions for autocomplete

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''

    const clients = await prisma.client.findMany({
      where: {
        companyName: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        companyName: true
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      data: clients.map(c => c.companyName)
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}