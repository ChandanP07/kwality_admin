// src/app/api/cities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for city data
const citySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  isActive: z.boolean().optional()
})

// GET /api/cities/[id] - Get city by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const city = await prisma.city.findUnique({
      where: { id: id },
      include: {
        clients: {
          select: {
            id: true,
            companyName: true,
            clientCode: true,
            isActive: true
          }
        },
        _count: {
          select: {
            clients: true
          }
        }
      }
    })

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    return NextResponse.json({ city })

  } catch (error) {
    console.error('Error fetching city:', error)
    return NextResponse.json(
      { error: 'Failed to fetch city' },
      { status: 500 }
    )
  }
}

// PUT /api/cities/[id] - Update city
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    // Check if user has admin/manager/super_admin role
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate input data
    const validatedData = citySchema.parse(body)

    // Get existing city for audit log
    const existingCity = await prisma.city.findUnique({
      where: { id: id }
    })

    if (!existingCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Check if city with same name and state already exists (excluding current)
    if (validatedData.name !== existingCity.name || validatedData.state !== existingCity.state) {
      const existingCityWithSameName = await prisma.city.findFirst({
        where: {
          name: { equals: validatedData.name, mode: 'insensitive' },
          state: { equals: validatedData.state, mode: 'insensitive' },
          id: { not: id }
        }
      })

      if (existingCityWithSameName) {
        return NextResponse.json(
          { error: 'City already exists in this state' },
          { status: 400 }
        )
      }
    }

    // Update city
    const updatedCity = await prisma.city.update({
      where: { id: id },
      data: validatedData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CITY',
        table: 'cities',
        recordId: updatedCity.id,
        oldValues: existingCity as any,
        newValues: updatedCity as any
      }
    })

    return NextResponse.json({
      city: updatedCity,
      message: 'City updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating city:', error)
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    )
  }
}

// DELETE /api/cities/[id] - Delete city (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    // Check if user has admin or super_admin role
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Check if city has active clients
    const clientCount = await prisma.client.count({
      where: {
        cityId: id,
        isActive: true
      }
    })

    if (clientCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete city with ${clientCount} active clients` },
        { status: 400 }
      )
    }

    const city = await prisma.city.findUnique({
      where: { id: id }
    })

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Soft delete by setting isActive to false
    const deletedCity = await prisma.city.update({
      where: { id: id },
      data: { isActive: false }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_CITY',
        table: 'cities',
        recordId: id,
        oldValues: city as any,
        newValues: deletedCity as any
      }
    })

    return NextResponse.json({
      message: 'City deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json(
      { error: 'Failed to delete city' }, // Fixed incomplete error message
      { status: 500 }
    )
  }
}