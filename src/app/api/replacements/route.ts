// src/app/api/replacements/route.ts
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

    // Mock data for replacements - you'd need to create a Replacement model
    const replacements = [
      {
        id: '1',
        client: 'Tech Solutions Pvt Ltd',
        oldPrinter: 'HP-001',
        newPrinter: 'HP-005',
        date: '2024-01-10',
        status: 'COMPLETED',
        reason: 'Hardware failure',
        technician: 'John Doe'
      }
    ]

    return NextResponse.json(replacements)
  } catch (error) {
    console.error('Error fetching replacements:', error)
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
    
    // Mock response - you'd need to create a Replacement model
    const replacement = {
      id: Date.now().toString(),
      ...body,
      status: 'PENDING',
      createdAt: new Date()
    }

    return NextResponse.json(replacement, { status: 201 })
  } catch (error) {
    console.error('Error creating replacement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}