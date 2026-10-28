// src/app/api/agreements/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const dcStatus = searchParams.get('dcStatus')

    // Build where clause based on filters
    const where: any = {}
    if (status) {
      where.status = status
    }
    // Handle pending DC status
    if (dcStatus === 'pending') {
      where.status = 'PENDING_DC'
    }

    const agreements = await prisma.agreement.findMany({
      where,
      include: {
        client: true,
        printer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to include clientName for frontend compatibility
    const transformedAgreements = agreements.map(agreement => ({
      ...agreement,
      clientName: agreement.client.companyName, // Add clientName field
      clientCode: agreement.client.clientCode   // Add clientCode field
    }))

    return NextResponse.json(transformedAgreements)
  } catch (error) {
    console.error('Error fetching agreements:', error)
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
      clientId,
      printerId,
      agreementType,
      startDate,
      endDate,
      monthlyRental,
      perPageRate,
      securityDeposit,
      terms
    } = body

    // Generate agreement number (keeping your existing logic)
    const lastAgreement = await prisma.agreement.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { agreementNumber: true }
    })
    
    let nextNumber = 1
    if (lastAgreement && lastAgreement.agreementNumber) {
      const match = lastAgreement.agreementNumber.match(/AGR(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const agreementNumber = `AGR${nextNumber.toString().padStart(3, '0')}`

    const agreement = await prisma.agreement.create({
      data: {
        agreementNumber,
        clientId,
        printerId: printerId || null, // Make printerId optional
        agreementType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRental: monthlyRental ? parseFloat(monthlyRental) : null,
        perPageRate: perPageRate ? parseFloat(perPageRate) : null,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
        terms,
        status: 'DRAFT'
      },
      include: {
        client: true,
        printer: true
      }
    })

    // Transform to include clientName
    const transformedAgreement = {
      ...agreement,
      clientName: agreement.client.companyName,
      clientCode: agreement.client.clientCode
    }

    return NextResponse.json(transformedAgreement, { status: 201 })
  } catch (error) {
    console.error('Error creating agreement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}