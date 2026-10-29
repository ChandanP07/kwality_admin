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
      return NextResponse.json({ error: 'No client found to associate with order' }, { status: 400 })
    }

    const noteParts = [
      body.comments,
      body.state ? `State: ${body.state}` : '',
      body.city ? `City: ${body.city}` : '',
      body.branch ? `Branch: ${body.branch}` : '',
      body.orderType ? `Order Type: ${body.orderType}` : '',
      body.cartridgeModelType ? `Cartridge Model: ${body.cartridgeModelType}` : '',
    ].filter(Boolean)

    // Save order to database
    const order = await prisma.order.create({
      data: {
        orderNumber: generateNumber('ORD'),
        clientId,
        contactPerson: body.contactPerson || null,
        contactNumber: body.contactNumber || null,
        productName: body.printerModel || body.cartridgeModelType || null,
        modelNumber: body.printerModel || null,
        type: body.type || body.orderType || null,
        quantity: parseInt(body.quantity) || 1,
        poNumber: body.poNumber || null,
        notes: noteParts.join(' | ') || null,
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
