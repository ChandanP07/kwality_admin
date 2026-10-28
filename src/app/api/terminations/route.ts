// src/app/api/terminations/route.ts
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

    // Mock data for terminations - you'd need to create a Termination model
    const terminations = [
      {
        id: '1',
        client: 'Old Client Corp',
        date: '2024-01-05',
        reason: 'CLIENT_REQUEST',
        status: 'COMPLETED',
        refundAmount: 5000,
        terminationNumber: 'TRM-001',
        processedBy: 'Admin User'
      }
    ]

    return NextResponse.json(terminations)
  } catch (error) {
    console.error('Error fetching terminations:', error)
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
    
    // Generate termination number
    const terminationNumber = `TRM${Date.now().toString().slice(-3)}`
    
    // Mock response - you'd need to create a Termination model
    const termination = {
      id: Date.now().toString(),
      terminationNumber,
      ...body,
      status: 'PENDING',
      processedBy: session.user.username,
      createdAt: new Date()
    }

    return NextResponse.json(termination, { status: 201 })
  } catch (error) {
    console.error('Error creating termination:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}