// GET /api/chalan/bill-updates/last-bill/export
// Exports last-bill data as Excel
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLastBills } from '@/lib/billing-service'
import { generateExcel } from '@/lib/excel-export'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getLastBills()

    const buffer = await generateExcel({
      sheetName: 'Last Bill Numbers',
      title: 'LAST BILL NUMBERS — ALL CLIENTS',
      columns: [
        { header: 'SR',          key: 'sr',             width: 6 },
        { header: 'Client Code', key: 'clientCode',     width: 12 },
        { header: 'Client Name', key: 'companyName',    width: 35 },
        { header: 'Last Bill No',key: 'lastBillNo',     width: 20 },
        { header: 'Date',        key: 'lastBillDate',   width: 15 },
        { header: 'Amount',      key: 'lastBillAmount', width: 15 },
        { header: 'Status',      key: 'lastBillStatus', width: 12 },
      ],
      data: data.map((r: any, i: number) => ({ ...r, sr: i + 1 })),
    })

    const date = new Date().toISOString().split('T')[0]
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Last_Bill_Numbers_${date}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('[GET /api/chalan/bill-updates/last-bill/export]', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}