// src/app/api/agreements/register/route.ts
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
    
    // Start a transaction to create agreement and assign printers
    const result = await prisma.$transaction(async (tx) => {
      // Create the agreement
      const agreement = await tx.agreement.create({
        data: {
          agreementNumber: body.agreementNumber,
          clientId: body.clientId,
          agreementType: body.agreementType,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          status: 'SIGNED',
          monthlyRental: body.monthlyRental ? parseFloat(body.monthlyRental) : null,
          perPageRate: body.perPageRate ? parseFloat(body.perPageRate) : null,
          securityDeposit: body.securityDeposit ? parseFloat(body.securityDeposit) : null,
          terms: body.terms,
          signedDate: body.agreementDate ? new Date(body.agreementDate) : new Date()
        }
      })

      // Assign printers if provided
      if (body.printers && body.printers.length > 0) {
        for (const printer of body.printers) {
          if (printer.printerId) {
            await tx.clientPrinter.create({
              data: {
                clientId: body.clientId,
                printerId: printer.printerId,
                installDate: printer.installationDate ? 
                  new Date(printer.installationDate) : 
                  new Date(body.startDate),
                isActive: true,
                rentalType: body.agreementType === 'RENTAL' ? 'MONTHLY_RENTAL' : 
                           body.agreementType === 'PER_PAGE' ? 'PER_PAGE' : 
                           'FIXED_RENTAL',
                monthlyRental: printer.monthlyRental ? 
                  parseFloat(printer.monthlyRental) : 
                  null,
                initialPageCount: 0,
                currentPageCount: 0
              }
            })

            // Update printer status
            await tx.printer.update({
              where: { id: printer.printerId },
              data: { 
                condition: 'GOOD',
                location: `Client: ${body.clientName}`
              }
            })
          }
        }
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user?.id || '',
          action: 'REGISTER',
          table: 'Agreement',
          recordId: agreement.id,
          newValues: body
        }
      })

      return agreement
    })

    return NextResponse.json({ 
      message: 'Agreement registered successfully',
      agreement: result 
    })
  } catch (error) {
    console.error('Error registering agreement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}