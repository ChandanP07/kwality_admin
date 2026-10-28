// lib/complaints-handler.ts
// Handles all 4 complaint screens: pending, done, complaint-query, pending-bill
// Queries the unified schema and shapes the response to match config column keys

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Shape a raw DB complaint into the flat object the config columns expect
function shapeComplaint(c: any, index: number) {
  return {
    id:            index + 1,
    dbId:          c.id,                                           // real DB id for updates
    complaintId:   c.complaintNumber,                             // config key: complaintId
    clientName:    c.client?.companyName ?? '—',                  // config key: clientName
    engineerName:  c.assignedTo?.name ?? c.assignedTo?.username ?? 'Unassigned', // config key: engineerName
    engineerId:    c.assignedTo?.id ?? null,
    status:        c.status,
    priority:      c.priority,
    category:      c.category,
    title:         c.title,
    description:   c.description,
    problemType:   c.problemType ?? '—',
    contactPerson: c.contactPerson ?? '—',
    contactNumber: c.contactNumber ?? '—',
    date:          c.reportedDate
      ? new Date(c.reportedDate).toLocaleDateString('en-IN')
      : '—',
    completedDate: c.resolvedDate
      ? new Date(c.resolvedDate).toLocaleDateString('en-IN')
      : '—',
    lastUpdate:    c.updatedAt
      ? new Date(c.updatedAt).toLocaleDateString('en-IN')
      : '—',
    resolution:    c.resolution ?? '',
    callLogs:      c.callLogs ?? [],
    // For pending screen grouped view
    totalComplaints: 1,
    pending:         ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status) ? 1 : 0,
  }
}

export async function handleComplaintsRequest(req: NextRequest, screenId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)

    // ── Build where clause from search params ──────────────────────
    const where: any = {}

    // Status filter per screen
    if (screenId === 'pending') {
      where.status = { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] }
    } else if (screenId === 'done') {
      where.status = { in: ['RESOLVED', 'CLOSED'] }
    } else if (screenId === 'pending-bill') {
      // Resolved complaints that don't yet have a bill linked
      where.status = 'RESOLVED'
    }

    // Search filters — map config field names to real schema fields
    const engineerName  = searchParams.get('engineerName')
    const clientName    = searchParams.get('clientName')
    const complaintNum  = searchParams.get('complaintNumber') || searchParams.get('complaintId')
    const fromDate      = searchParams.get('fromDate')
    const toDate        = searchParams.get('toDate')

    if (engineerName) {
      where.assignedTo = {
        OR: [
          { name:     { contains: engineerName, mode: 'insensitive' } },
          { username: { contains: engineerName, mode: 'insensitive' } },
        ],
      }
    }

    if (clientName) {
      where.client = { companyName: { contains: clientName, mode: 'insensitive' } }
    }

    if (complaintNum) {
      where.complaintNumber = { contains: complaintNum, mode: 'insensitive' }
    }

    if (fromDate || toDate) {
      where.reportedDate = {}
      if (fromDate) where.reportedDate.gte = new Date(fromDate)
      if (toDate)   where.reportedDate.lte = new Date(new Date(toDate).setHours(23, 59, 59))
    }

    // ── Query ──────────────────────────────────────────────────────
    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        client:     { select: { id: true, companyName: true, clientCode: true } },
        assignedTo: { select: { id: true, name: true, username: true } },
        callLogs:   { orderBy: { callDate: 'desc' }, take: 5 },
        location:   { select: { name: true } },
      },
      orderBy: { reportedDate: 'desc' },
      take: 200,
    })

    const shaped = complaints.map((c, i) => shapeComplaint(c, i))

    // ── For pending screen: group by engineer ──────────────────────
    // Shows one row per engineer with count of their complaints
    if (screenId === 'pending') {
      const grouped: Record<string, any> = {}
      shaped.forEach(c => {
        const key = c.engineerName
        if (!grouped[key]) {
          grouped[key] = {
            id:             Object.keys(grouped).length + 1,
            engineerName:   c.engineerName,
            engineerId:     c.engineerId,
            totalComplaints: 0,
            pending:         0,
            lastUpdate:      c.lastUpdate,
            // keep raw list for drill-down
            complaints:      [],
          }
        }
        grouped[key].totalComplaints++
        grouped[key].pending++
        grouped[key].complaints.push(c)
      })

      return NextResponse.json({
        success: true,
        data:    Object.values(grouped),
        count:   Object.keys(grouped).length,
        raw:     shaped, // also send raw for detail modal
      })
    }

    return NextResponse.json({ success: true, data: shaped, count: shaped.length })
  } catch (error) {
    console.error('[complaints-handler]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}