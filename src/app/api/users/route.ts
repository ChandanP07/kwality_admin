// app/api/users/route.ts
// GET — returns admin/staff users for assignment dropdowns
// ?role=ADMIN,MANAGER,EMPLOYEE  (comma-separated, optional)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const roleParam = searchParams.get('role')

    const roles = roleParam
      ? roleParam.split(',').map(r => r.trim())
      : ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']

    const users = await prisma.user.findMany({
      where: {
        role:     { in: roles as any },
        isActive: true,
      },
      select: {
        id:       true,
        name:     true,
        username: true,
        email:    true,
        role:     true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('[GET /api/users]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}