// GET /api/chalan/clients?q=abc
// Used by autocomplete filters across all chalan screens.
// Returns active client names + ids matching the query.
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const clients = await prisma.client.findMany({
    where: {
      isActive: true,
      ...(q ? { companyName: { contains: q, mode: 'insensitive' } } : {}),
    },
    select: { id: true, companyName: true, clientCode: true, email: true },
    orderBy: { companyName: 'asc' },
    take: 30,
  })

  return NextResponse.json({
    success: true,
    data: clients,
    // flat list of names for the existing autocomplete component
    names: clients.map(c => c.companyName),
  })
}