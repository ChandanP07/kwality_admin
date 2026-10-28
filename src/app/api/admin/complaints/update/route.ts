// app/api/admin/complaints/update/route.ts
// PATCH — update complaint status, assign to user, add call log entry
// Used by admin to manage client-raised complaints

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { complaintId, status, assignedToId, resolution, callLog } = body

    if (!complaintId) {
      return NextResponse.json({ error: 'complaintId is required' }, { status: 400 })
    }

    const existing = await prisma.complaint.findUnique({ where: { id: complaintId } })
    if (!existing) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    // Update complaint fields
    const updateData: any = { updatedAt: new Date() }
    if (status)       updateData.status       = status
    if (assignedToId) updateData.assignedToId = assignedToId
    if (resolution)   updateData.resolution   = resolution

    // Mark resolvedDate when closing
    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedDate = new Date()
    }

    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data:  updateData,
      include: {
        client: { select: { companyName: true, email: true } },
        assignedTo: { select: { username: true, name: true } },
        callLogs: { orderBy: { callDate: 'desc' }, take: 5 },
      },
    })

    // Add a call log entry if provided
    if (callLog?.details) {
      await prisma.callLog.create({
        data: {
          complaintId,
          details:        callLog.details,
          loggedBy:       session.user.username ?? session.user.name ?? 'Admin',
          clientFeedback: callLog.clientFeedback ?? null,
          callDone:       callLog.callDone ?? false,
          doneDate:       callLog.callDone ? new Date() : null,
        },
      })
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('[PATCH /api/admin/complaints/update]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}