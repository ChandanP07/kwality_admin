// app/api/admin/cities/route.ts (Updated version)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ROLES } from '@/lib/roles'
import { prisma } from '@/lib/prisma'
import { safeValidate, createCitySchema, updateCitySchema } from '@/lib/validations/schemas'

// GET - Fetch all cities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cities = await prisma.city.findMany({
      orderBy: [
        { state: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new city
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // VALIDATE INPUT
    const validation = safeValidate(createCitySchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors
        },
        { status: 400 }
      );
    }



    const { name, state, country = 'India' } = body

    if (!name || !state) {
      return NextResponse.json(
        { error: 'City name and state are required' },
        { status: 400 }
      )
    }

    // Check if city already exists
    const existingCity = await prisma.city.findFirst({
      where: {
        name: name.trim(),
        state: state.trim(),
        country: country.trim()
      }
    })

    if (existingCity) {
      return NextResponse.json(
        { error: 'City already exists' },
        { status: 400 }
      )
    }

    const newCity = await prisma.city.create({
      data: {
        name: name.trim(),
        state: state.trim(),
        country: country.trim(),
        isActive: true
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_CITY',
        table: 'cities',
        recordId: newCity.id,
        newValues: {
          name: newCity.name,
          state: newCity.state,
          country: newCity.country
        }
      }
    })

    return NextResponse.json({
      message: 'City added successfully',
      city: newCity
    })
  } catch (error) {
    console.error('Error creating city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update existing city
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = safeValidate(updateCitySchema, body);
    const { id, name, state, country, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Get current city for audit log
    const currentCity = await prisma.city.findUnique({
      where: { id }
    })

    if (!currentCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: {
        name: name?.trim() || currentCity.name,
        state: state?.trim() || currentCity.state,
        country: country?.trim() || currentCity.country,
        isActive: isActive !== undefined ? isActive : currentCity.isActive,
        updatedAt: new Date()
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CITY',
        table: 'cities',
        recordId: id,
        oldValues: {
          name: currentCity.name,
          state: currentCity.state,
          country: currentCity.country,
          isActive: currentCity.isActive
        },
        newValues: {
          name: updatedCity.name,
          state: updatedCity.state,
          country: updatedCity.country,
          isActive: updatedCity.isActive
        }
      }
    })

    return NextResponse.json({
      message: 'City updated successfully',
      city: updatedCity
    })
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete city
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get('id')

    if (!cityId) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Check if city is being used by any clients
    const clientCount = await prisma.client.count({
      where: { cityId: cityId }
    })

    if (clientCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete city. It is being used by ${clientCount} client(s)` },
        { status: 400 }
      )
    }

    // Get city data for audit log
    const cityToDelete = await prisma.city.findUnique({
      where: { id: cityId }
    })

    if (!cityToDelete) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    await prisma.city.delete({
      where: { id: cityId }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_CITY',
        table: 'cities',
        recordId: cityId,
        oldValues: {
          name: cityToDelete.name,
          state: cityToDelete.state,
          country: cityToDelete.country,
          deletedBy: session.user.username
        }
      }
    })

    return NextResponse.json({
      message: 'City deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}