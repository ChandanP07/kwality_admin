// src/app/api/client-printers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const clientPrinter = await prisma.clientPrinter.create({
      data: {
        clientId: body.clientId,
        printerId: body.printerId,
        installDate: new Date(body.installDate),
        isActive: true,
        rentalType: body.rentalType,
        monthlyRental: body.monthlyRental ? parseFloat(body.monthlyRental) : null,
        perPageRate: body.perPageRate ? parseFloat(body.perPageRate) : null,
        initialPageCount: parseInt(body.initialPageCount) || 0,
        currentPageCount: parseInt(body.initialPageCount) || 0
      }
    })

    return NextResponse.json(clientPrinter, { status: 201 })
  } catch (error) {
    console.error('Error allotting printer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}