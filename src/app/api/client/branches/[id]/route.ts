// app/api/client/branches/[id]/route.ts
// PUT — update a branch's contact details
// Client can update contact info on their own branches only.

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession } from '@/lib/client-auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    // Verify this branch belongs to the client
    const branch = await prisma.branch.findFirst({
      where: { id: params.id, clientId: auth.clientId },
    })
    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found or does not belong to your account' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const updated = await prisma.branch.update({
      where: { id: params.id },
      data: {
        branchName:    body.name          ?? branch.branchName,
        address:       body.address       ?? branch.address,
        contactPerson: body.contactPerson ?? branch.contactPerson,
        phone:         body.phone         ?? branch.phone,
        email:         body.email         ?? branch.email,
        ...(body.cityId ? { cityId: body.cityId } : {}),
      },
      include: { city: { select: { name: true, state: true } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT /api/client/branches/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}