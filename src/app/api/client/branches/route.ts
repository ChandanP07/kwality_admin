// app/api/client/branches/route.ts
// GET — list all branches for this client (used in complaint/order dropdowns)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession } from '@/lib/client-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const branches = await prisma.branch.findMany({
      where: { clientId: auth.clientId },
      include: {
        city: { select: { name: true, state: true } },
        locations: { select: { id: true, name: true } },
      },
      orderBy: { branchName: 'asc' },
    })

    const formatted = branches.map((b) => ({
      ...b,
      name: b.branchName,
      contactName: b.contactPerson,
      contactPhone: b.phone,
      contactEmail: b.email,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('[GET /api/client/branches]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}