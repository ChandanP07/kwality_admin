import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import printerScreens from '@/config/printer-config'

export async function handlePrinterRequest(req: NextRequest, screenId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const config = printerScreens[screenId]
    if (!config) return NextResponse.json({ error: 'Screen not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const filters: Record<string, any> = {}
    searchParams.forEach((v, k) => { filters[k] = v })

    const where: any = {}
    if (filters.printerModel) where.printerModel = { contains: filters.printerModel, mode: 'insensitive' }
    if (filters.serialNumber) where.serialNumber = { contains: filters.serialNumber, mode: 'insensitive' }
    if (filters.clientName) where.clientName = { contains: filters.clientName, mode: 'insensitive' }
    if (filters.status) where.status = filters.status

    const model = config.model || 'clientPrinter'
    const data = await (prisma as any)[model].findMany({ where, orderBy: { id: 'desc' }, take: 100 })

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
