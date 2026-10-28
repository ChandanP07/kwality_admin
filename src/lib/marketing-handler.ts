import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import marketingScreens from '@/config/marketing-config'

export async function handleMarketingRequest(req: NextRequest, screenId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const config = marketingScreens[screenId]
    if (!config) return NextResponse.json({ error: 'Screen not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const filters: Record<string, any> = {}
    searchParams.forEach((v, k) => { filters[k] = v })

    const where: any = {}
    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' }
    if (filters.cartridgeModel) where.cartridgeModel = { contains: filters.cartridgeModel, mode: 'insensitive' }

    const model = config.model || 'marketingLead'
    const data = await (prisma as any)[model].findMany({ where, orderBy: { id: 'desc' }, take: 100 })

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
