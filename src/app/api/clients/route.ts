// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      include: {
        city: true,
        branches: true,
        createdBy: {
          select: { id: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      cityId,
      state,
      pincode,
      gstNumber,
      panNumber,
      clientType,
      creditLimit,
      billingDate,
      autoForward,
      hardcopyRequired,
      stopBillMail,
      isSezClient,
      isNgoClient,
      isB2cClient,
      fixedRental
    } = body

    // Generate unique client code
    const lastClient = await prisma.client.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { clientCode: true }
    })
    
    let nextNumber = 1
    if (lastClient && lastClient.clientCode) {
      const match = lastClient.clientCode.match(/CLT(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const clientCode = `CLT${nextNumber.toString().padStart(4, '0')}`

    const client = await prisma.client.create({
      data: {
        clientCode,
        companyName,
        contactPerson,
        email,
        phone,
        address,
        cityId,
        state,
        pincode,
        gstNumber,
        panNumber,
        clientType,
        creditLimit,
        billingDate,
        autoForward: autoForward || false,
        hardcopyRequired: hardcopyRequired || false,
        stopBillMail: stopBillMail || false,
        isSezClient: isSezClient || false,
        isNgoClient: isNgoClient || false,
        isB2cClient: isB2cClient || false,
        fixedRental: fixedRental || false,
        createdById: session.user.id
      },
      include: {
        city: true,
        createdBy: {
          select: { id: true, username: true }
        }
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}