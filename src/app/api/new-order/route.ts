import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    
    // Save order to database
    const order = await prisma.order.create({
      data: {
        clientName: body.clientName,
        state: body.state,
        city: body.city,
        branch: body.branch,
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
        orderType: body.orderType,
        printerModel: body.printerModel,
        type: body.type,
        cartridgeModelType: body.cartridgeModelType,
        quantity: parseInt(body.quantity),
        poNumber: body.poNumber,
        comments: body.comments,
        status: 'PENDING',
        createdById: session.user.id
      }
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}