// app/api/client/locations/route.ts
// GET  — list all branches + their locations for this client
// POST — add a new location under an existing branch

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientSession } from '@/lib/client-auth'

// ─── GET /api/client/locations ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const branches = await prisma.branch.findMany({
      where: { clientId: auth.clientId },
      include: {
        city: { select: { name: true, state: true } },
        locations: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { branchName: 'asc' },
    })

    return NextResponse.json(branches)
  } catch (error) {
    console.error('[GET /api/client/locations]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/client/locations ───────────────────────────────────────────────
// Add a new sub-location under one of this client's branches.
export async function POST(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    if (!body.name || !body.branchId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, branchId' },
        { status: 400 }
      )
    }

    // Verify the branch belongs to this client
    const branch = await prisma.branch.findFirst({
      where: { id: body.branchId, clientId: auth.clientId },
    })
    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found or does not belong to your account' },
        { status: 403 }
      )
    }

    const location = await prisma.location.create({
      data: {
        name: body.name,
        pincode: body.pincode || null,
        address: body.address || null,
        branchId: body.branchId,
      },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('[POST /api/client/locations]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PUT /api/client/locations ────────────────────────────────────────────────
// Update an existing location. Verifies ownership before update.
export async function PUT(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Missing location id' }, { status: 400 })
    }

    // Verify the location belongs to one of this client's branches
    const existing = await prisma.location.findFirst({
      where: {
        id: body.id,
        branch: { clientId: auth.clientId },
      },
    })
    if (!existing) {
      return NextResponse.json(
        { error: 'Location not found or does not belong to your account' },
        { status: 403 }
      )
    }

    const updated = await prisma.location.update({
      where: { id: body.id },
      data: {
        name: body.name ?? existing.name,
        pincode: body.pincode ?? existing.pincode,
        address: body.address ?? existing.address,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT /api/client/locations]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/client/locations ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const auth = await getClientSession()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing location id' }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.location.findFirst({
      where: { id, branch: { clientId: auth.clientId } },
    })
    if (!existing) {
      return NextResponse.json(
        { error: 'Location not found or does not belong to your account' },
        { status: 403 }
      )
    }

    await prisma.location.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/client/locations]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}