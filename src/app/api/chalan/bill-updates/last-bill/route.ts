// GET /api/chalan/bill-updates/last-bill?client=<name or id>
// Returns the most recent bill for each active client (or one client if filtered)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLastBills } from '@/lib/billing-service'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientSearch = searchParams.get('client')

  try {
    let clientId: string | undefined

    if (clientSearch) {
      // Accept either an id or a company name search
      const client = await prisma.client.findFirst({
        where: {
          OR: [
            { id: clientSearch },
            { companyName: { contains: clientSearch, mode: 'insensitive' } },
            { clientCode: clientSearch },
          ],
        },
      })
      if (client) clientId = client.id
    }

    const data = await getLastBills(clientId)
    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('[GET /api/chalan/bill-updates/last-bill]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}