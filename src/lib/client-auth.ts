// lib/client-auth.ts
// Shared helper used by every /api/client/* route.
//
// getClientSession() does three things:
//   1. Checks the user is logged in
//   2. Checks their role is CLIENT
//   3. Looks up their ClientProfile to get the linked clientId
//
// Every client API route calls this first and uses the returned
// clientId to scope ALL database queries — ensuring users can
// never see each other's data.

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export type ClientSession = {
  userId: string
  clientId: string
  email: string
  name: string
}

export type AuthError = NextResponse

/**
 * Returns ClientSession on success, or a NextResponse error to return immediately.
 *
 * Usage in any /api/client/* route:
 *
 *   const result = await getClientSession()
 *   if (result instanceof NextResponse) return result   // auth failed
 *   const { clientId, userId } = result                 // success
 */
export async function getClientSession(): Promise<ClientSession | NextResponse> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized — please log in' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'CLIENT') {
    return NextResponse.json(
      { error: 'Forbidden — client access only' },
      { status: 403 }
    )
  }

  // Look up the ClientProfile that bridges userId → clientId
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
    select: { clientId: true },
  })

  if (!profile) {
    // User is logged in but hasn't been linked to a Client record yet.
    // This happens if onboarding is incomplete or admin hasn't linked them.
    return NextResponse.json(
      { error: 'Client profile not found — please complete onboarding' },
      { status: 404 }
    )
  }

  return {
    userId: session.user.id,
    clientId: profile.clientId,
    email: session.user.email,
    name: session.user.name,
  }
}

/**
 * Auto-generate a sequential number string for orders/complaints.
 * Format: PREFIX-YYYY-XXXXX  e.g. ORD-2025-00042
 */
export function generateNumber(prefix: string): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `${prefix}-${year}-${random}`
}
