// src/app/api/printers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const available = searchParams.get('available')

    // Build where clause
    const where: any = { isActive: true }
    
    // If looking for available printers (not assigned to any client)
    if (status === 'available' || available === 'true') {
      // You might need to adjust this based on your schema
      // This assumes printers not in clientPrinter table are available
      const assignedPrinterIds = await prisma.clientPrinter.findMany({
        where: { isActive: true },
        select: { printerId: true }
      })
      
      const assignedIds = assignedPrinterIds.map(cp => cp.printerId)
      
      where.id = {
        notIn: assignedIds
      }
    }

    const printers = await prisma.printer.findMany({
      include: {
        model: true
      },
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Transform data for frontend
    const transformedPrinters = printers.map(printer => ({
      id: printer.id,
      model: printer.model.modelName,
      serialNumber: printer.serialNumber,
      status: 'AVAILABLE', // You can determine this based on your logic
      condition: printer.condition,
      isActive: printer.isActive
    }))

    return NextResponse.json(transformedPrinters)
  } catch (error) {
    console.error('Error fetching printers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}