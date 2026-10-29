// src/app/api/agreements/[id]/reminder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    // Get agreement details
    const agreement = await prisma.agreement.findUnique({
      where: { id: id },
      include: {
        client: true
      }
    })

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }

    // Here you would implement your email/notification logic
    // For example, using nodemailer or a service like SendGrid
    
    // For now, we'll just log the reminder
    logger.info('Sending agreement reminder', { 
      agreementNumber: agreement.agreementNumber, 
      clientEmail: agreement.client.email 
    })

    // Update agreement to track reminder sent
    await prisma.agreement.update({
      where: { id: id },
      data: {
        status: 'SENT', // Update status if needed
        updatedAt: new Date()
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: 'SEND_REMINDER',
        table: 'Agreement',
        recordId: id,
        newValues: {
          reminderSentAt: new Date(),
          sentTo: agreement.client.email
        }
      }
    })

    return NextResponse.json({ 
      message: 'Reminder sent successfully',
      sentTo: agreement.client.email 
    })
  } catch (error) {
    console.error('Error sending reminder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}