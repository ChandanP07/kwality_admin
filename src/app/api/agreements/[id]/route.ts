// src/app/api/agreements/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single agreement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agreement = await prisma.agreement.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        printer: true
      }
    })

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }

    return NextResponse.json(agreement)
  } catch (error) {
    // console.error('Error fetching agreement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE agreement
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
    
    const agreement = await prisma.agreement.update({
      where: { id: params.id },
      data: {
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        agreementType: body.agreementType,
        monthlyRental: body.monthlyRental ? parseFloat(body.monthlyRental) : null,
        perPageRate: body.perPageRate ? parseFloat(body.perPageRate) : null,
        securityDeposit: body.securityDeposit ? parseFloat(body.securityDeposit) : null,
        terms: body.terms,
        status: body.status,
        updatedAt: new Date()
      },
      include: {
        client: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: 'UPDATE',
        table: 'Agreement',
        recordId: params.id,
        newValues: body
      }
    })

    return NextResponse.json(agreement)
  } catch (error) {
    console.error('Error updating agreement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE agreement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if agreement exists
    const existing = await prisma.agreement.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }

    // Delete agreement
    await prisma.agreement.delete({
      where: { id: params.id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: 'DELETE',
        table: 'Agreement',
        recordId: params.id,
        oldValues: existing
      }
    })

    return NextResponse.json({ message: 'Agreement deleted successfully' })
  } catch (error) {
    console.error('Error deleting agreement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}