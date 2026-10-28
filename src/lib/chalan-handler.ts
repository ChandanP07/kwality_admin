// Location: src/lib/chalan-handler.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import chalanScreens from '@/config/chalan-reports'

export async function handleChalanRequest(
  request: NextRequest,
  category: string,
  screenName: string
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const screenId = `${category}-${screenName}` || category
    const screenConfig = chalanScreens[screenId]

    if (!screenConfig) {
      return NextResponse.json({ error: 'Screen not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const filters: Record<string, any> = {}
    searchParams.forEach((value, key) => { filters[key] = value })

    const where: any = {}
    
    if (filters.client) {
      where.clientName = { contains: filters.client, mode: 'insensitive' }
    }
    if (filters.fromDate && filters.toDate) {
      where.date = { gte: new Date(filters.fromDate), lte: new Date(filters.toDate) }
    }

    const model = screenConfig.model || 'bill'
    const data = await (prisma as any)[model].findMany({ where, orderBy: { id: 'asc' } })

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('Chalan Handler Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleChalanExport(
  request: NextRequest,
  category: string,
  screenName: string,
  generateExcel: Function
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const screenId = `${category}-${screenName}`
    const screenConfig = chalanScreens[screenId]

    if (!screenConfig) {
      return NextResponse.json({ error: 'Screen not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const filters: Record<string, any> = {}
    searchParams.forEach((value, key) => { filters[key] = value })

    const where: any = {}
    if (filters.client) {
      where.clientName = { contains: filters.client, mode: 'insensitive' }
    }

    const model = screenConfig.model || 'bill'
    const data = await (prisma as any)[model].findMany({ where, orderBy: { id: 'asc' } })

    const buffer = await generateExcel({
      sheetName: screenConfig.title,
      title: screenConfig.title.toUpperCase(),
      columns: screenConfig.columns || [],
      data: data
    })

    const date = new Date().toISOString().split('T')[0]
    const filename = `${screenConfig.title.replace(/ /g, '_')}_${date}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Chalan Export Error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
