// app/api/complaints/[id]/route.ts
// GET  — single complaint full detail
// PATCH — update status, assign engineer, add call log

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const complaint = await prisma.complaint.findUnique({
      where: { id: id },
      include: {
        client:     true,
        assignedTo: { select: { id: true, name: true, username: true } },
        callLogs:   { orderBy: { callDate: 'desc' } },
        location:   { select: { name: true } },
      },
    })

    if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(complaint)
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await request.json()
    const { status, assignedToId, resolution, callLog } = body

    const existing = await prisma.complaint.findUnique({ where: { id: id } })
    if (!existing) return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })

    const updateData: any = { updatedAt: new Date() }
    if (status)       updateData.status       = status
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null
    if (resolution)   updateData.resolution   = resolution

    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedDate = new Date()
    }

    const updated = await prisma.complaint.update({
      where: { id: id },
      data:  updateData,
      include: {
        client:     { select: { companyName: true } },
        assignedTo: { select: { name: true, username: true } },
        callLogs:   { orderBy: { callDate: 'desc' }, take: 5 },
      },
    })

    // Add call log entry if provided
    if (callLog?.details?.trim()) {
      await prisma.callLog.create({
        data: {
          complaintId:    id,
          details:        callLog.details,
          loggedBy:       session.user.username ?? session.user.name ?? 'Admin',
          clientFeedback: callLog.clientFeedback ?? null,
          callDone:       callLog.callDone ?? false,
          doneDate:       callLog.callDone ? new Date() : null,
        },
      })
    }

    return NextResponse.json({ success: true, complaint: updated })
  } catch (e) {
    console.error('[PATCH /api/complaints/:id]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}