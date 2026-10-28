import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    
    // Save complaint to database
    const complaint = await prisma.complaint.create({
      data: {
        title: body.title || body.clientName || 'New Complaint',
        state: body.state,
        city: body.city,
        location: body.location,
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
        printerModel: body.printerModel,
        serialNumber: body.serialNumber,
        printerProblem: body.printerProblem,
        comments: body.comments,
        status: 'OPEN',
        createdBy: session.user.email
      }
    })

    return NextResponse.json({ success: true, complaint })
  } catch (error) {
    console.error('Error creating complaint:', error)
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 })
  }
}