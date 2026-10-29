import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateNumber } from '@/lib/client-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    let clientId = ''
    if (body.clientName) {
      const client = await prisma.client.findFirst({
        where: { companyName: { contains: body.clientName } }
      })
      if (client) clientId = client.id
    }
    if (!clientId) {
      const firstClient = await prisma.client.findFirst()
      if (firstClient) clientId = firstClient.id
    }

    if (!clientId) {
      return NextResponse.json({ error: 'No client found to associate with complaint' }, { status: 400 })
    }

    const descriptionParts = [
      body.comments,
      body.state ? `State: ${body.state}` : '',
      body.city ? `City: ${body.city}` : '',
      body.location ? `Location: ${body.location}` : '',
      body.printerModel ? `Printer: ${body.printerModel}` : '',
      body.serialNumber ? `Serial: ${body.serialNumber}` : '',
    ].filter(Boolean)

    // Save complaint to database
    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber: generateNumber('COMP'),
        clientId,
        title: body.title || body.clientName || 'New Complaint',
        description: descriptionParts.join(' | ') || 'New complaint logged',
        priority: 'MEDIUM',
        status: 'OPEN',
        category: 'PRINTER_ISSUE',
        contactPerson: body.contactPerson || null,
        contactNumber: body.contactNumber || null,
        problemType: body.printerProblem || null,
      }
    })

    return NextResponse.json({ success: true, complaint })
  } catch (error) {
    console.error('Error creating complaint:', error)
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 })
  }
}
