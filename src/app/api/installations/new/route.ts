// src/app/api/installations/new/route.ts
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
    
    // Start a transaction for installation
    const result = await prisma.$transaction(async (tx) => {
      const installations = []
      
      // Process each printer installation
      for (const printer of body.printers) {
        if (printer.printerId) {
          // Create client-printer relationship
          const installation = await tx.clientPrinter.create({
            data: {
              clientId: body.clientId,
              printerId: printer.printerId,
              installDate: new Date(body.installationDate),
              isActive: true,
              initialPageCount: parseInt(printer.pageCount) || 0,
              currentPageCount: parseInt(printer.pageCount) || 0
            }
          })
          
          installations.push(installation)

          // Update printer status and location
          await tx.printer.update({
            where: { id: printer.printerId },
            data: {
              condition: 'GOOD',
              location: body.location
            }
          })
        }
      }

      // Create audit log for the installation
      await tx.auditLog.create({
        data: {
          userId: session.user?.id || '',
          action: 'NEW_INSTALLATION',
          table: 'ClientPrinter',
          recordId: body.clientId,
          newValues: {
            clientName: body.clientName,
            location: body.location,
            installationType: body.installationType,
            installationDate: body.installationDate,
            installedBy: body.installedBy,
            contactPerson: body.contactPerson,
            contactPhone: body.contactPhone,
            dcNumber: body.dcNumber,
            dcDate: body.dcDate,
            printersCount: body.printers.length,
            remarks: body.remarks
          }
        }
      })

      return installations
    })

    return NextResponse.json({ 
      message: 'Installation registered successfully',
      installations: result 
    })
  } catch (error) {
    console.error('Error registering installation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}