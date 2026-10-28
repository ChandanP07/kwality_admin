// app/api/client/onboarding/route.ts
// POST — save firmName + industry after first login, create ClientProfile
//
// Flow:
//   1. New user signs in with Google (or email)
//   2. They land on /onboarding page
//   3. They submit firmName + industry
//   4. This route creates/updates their User record
//   5. Creates a Client record (the business entity) in the system
//   6. Creates a ClientProfile linking userId ↔ clientId
//   7. Sets user.onboarded = true
//   8. Returns { success: true } — frontend then calls update({ onboarded: true })
//      to refresh the JWT so middleware stops redirecting to /onboarding

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Allow CLIENT role only — admin staff never hit this route
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Don't re-onboard if already done
    if (session.user.onboarded) {
      return NextResponse.json({ message: 'Already onboarded', alreadyDone: true })
    }

    const body = await request.json()

    if (!body.firmName?.trim() || !body.industry?.trim()) {
      return NextResponse.json(
        { error: 'firmName and industry are required' },
        { status: 400 }
      )
    }

    const firmName = body.firmName.trim()
    const industry = body.industry.trim()
    const phone = body.phone?.trim() || null

    // Run everything in a transaction so it's all-or-nothing
    await prisma.$transaction(async (tx) => {
      // 1. Update the User with firm details
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          firmName,
          industry,
          phone,
          onboarded: true,
        },
      })

      // 2. Check if a ClientProfile already exists (edge case: re-submission)
      const existingProfile = await tx.clientProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!existingProfile) {
        // 3. Create a Client record (the business entity admins will manage)
        //    We generate a clientCode from the firm name + timestamp
        const clientCode = `CLI-${firmName.replace(/\s+/g, '').toUpperCase().slice(0, 6)}-${Date.now().toString().slice(-5)}`

        // Find or create a default city (use first available city as placeholder)
        const defaultCity = await tx.city.findFirst({ orderBy: { name: 'asc' } })
        if (!defaultCity) {
          throw new Error('No cities found in database — please seed cities first')
        }

        // Find the system admin user to use as createdById
        const systemAdmin = await tx.user.findFirst({
          where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
          orderBy: { createdAt: 'asc' },
        })
        if (!systemAdmin) {
          throw new Error('No admin user found — please seed an admin user first')
        }

        const client = await tx.client.create({
          data: {
            clientCode,
            companyName: firmName,
            contactPerson: session.user.name || firmName,
            email: session.user.email,
            phone: phone || '0000000000',
            address: 'To be updated',
            state: 'To be updated',
            pincode: '000000',
            clientType: 'REGULAR',
            cityId: defaultCity.id,
            createdById: systemAdmin.id,
          },
        })

        // 4. Create the ClientProfile bridge
        await tx.clientProfile.create({
          data: {
            userId: session.user.id,
            clientId: client.id,
          },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/client/onboarding]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET — check onboarding status (used by the /onboarding page on mount)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboarded: true, firmName: true, industry: true },
    })

    return NextResponse.json({
      onboarded: user?.onboarded ?? false,
      firmName: user?.firmName ?? null,
      industry: user?.industry ?? null,
    })
  } catch (error) {
    console.error('[GET /api/client/onboarding]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}