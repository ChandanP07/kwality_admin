// src/app/api/branches/route.ts
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
    const { clientId, branchName, address, contactPerson, phone, email } = body

    const branch = await prisma.branch.create({
      data: {
        clientId,
        branchName,
        address,
        contactPerson,
        phone,
        email
      },
      include: {
        client: true
      }
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}