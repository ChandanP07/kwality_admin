// src/app/api/agreements/[id]/dc/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Update agreement status from PENDING_DC to ACTIVE
    const agreement = await prisma.agreement.update({
      where: { id: params.id },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date()
      }
    })

    // Log the DC details (you can extend this based on your schema)
    // console.log('DC Updated:', { 
    //   agreementId: params.id, 
    //   dcNumber: body.dcNumber,
    //   dcDate: body.dcDate 
    // })

    return NextResponse.json({ 
      message: 'DC details updated successfully',
      agreement 
    })
  } catch (error) {
    console.error('Error updating DC:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}