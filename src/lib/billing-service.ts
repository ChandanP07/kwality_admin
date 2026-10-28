// src/lib/billing-service.ts
// Central billing logic for all four bill types:
//   monthly  — fixed rental per month
//   current  — arbitrary period (date range)
//   open     — admin-defined bill number + amount
//   tally    — tally-synced bill with explicit GST selection
//
// Each function validates inputs, resolves GST, generates bill number,
// creates Bill + BillItem records atomically, and returns the full bill.

import { prisma } from '@/lib/prisma'
import { generateBillNumber } from '@/lib/generators'
import { Decimal } from '@prisma/client/runtime/library'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BillingResult {
  success: boolean
  bill?: any
  error?: string
}

export interface MonthlyBillInput {
  clientId: string
  billMonth: number   // 1–12
  billYear: number
  amount: number      // subtotal before tax
  remarks?: string
  createdById: string
}

export interface CurrentBillInput {
  clientId: string
  amount: number
  periodStart: string  // ISO date string
  periodEnd: string
  remarks?: string
  createdById: string
}

export interface OpenBillInput {
  clientId: string
  amount: number
  billNumber: string   // caller supplies the bill number
  description?: string
  createdById: string
}

export interface TallyBillInput {
  clientId: string
  amount: number
  gstRate: number      // 0, 12, 18, or 28
  items?: { description: string; quantity: number; unitPrice: number }[]
  createdById: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Fetch (or create default) client billing settings
async function getClientBillSetting(clientId: string) {
  let setting = await prisma.clientBillSetting.findUnique({
    where: { clientId },
  })
  if (!setting) {
    setting = await prisma.clientBillSetting.create({
      data: { clientId, gstRate: new Decimal(18) },
    })
  }
  return setting
}

// Resolve GST: caller may override, otherwise use client setting
function computeTax(subtotal: number, gstRatePct: number) {
  const taxAmount = parseFloat(((subtotal * gstRatePct) / 100).toFixed(2))
  const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2))
  return { taxAmount, totalAmount }
}

// Due date: 30 days from bill date
function dueDate(from: Date = new Date()): Date {
  const d = new Date(from)
  d.setDate(d.getDate() + 30)
  return d
}

// Validate client exists and billing is not stopped
async function validateClient(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { billSetting: true },
  })
  if (!client) return { error: 'Client not found' }
  if (!client.isActive) return { error: 'Client account is inactive' }

  const setting = client.billSetting
  if (setting?.stopBill) return { error: 'Billing is stopped for this client (manual stop)' }
  if (setting?.autoStop) return { error: `Billing is auto-stopped: ${setting.autoStopReason ?? 'system flag'}` }

  return { client, setting }
}

// Check if a monthly bill already exists for the given month/year
async function checkDuplicateMonthlyBill(clientId: string, month: number, year: number) {
  const existing = await prisma.billPeriod.findFirst({
    where: { billMonth: month, billYear: year, bill: { clientId } },
    include: { bill: { select: { billNumber: true, status: true } } },
  })
  return existing
}

// ─── Monthly Bill ─────────────────────────────────────────────────────────────
// Creates a RENTAL bill for a fixed calendar month.
// Prevents duplicate bills for the same client/month/year.

export async function createMonthlyBill(input: MonthlyBillInput): Promise<BillingResult> {
  const { clientId, billMonth, billYear, amount, remarks, createdById } = input

  // Validate month/year range
  if (billMonth < 1 || billMonth > 12) return { success: false, error: 'Invalid month (1–12)' }
  if (billYear < 2000 || billYear > 2100) return { success: false, error: 'Invalid year' }
  if (amount <= 0) return { success: false, error: 'Amount must be greater than 0' }

  const validation = await validateClient(clientId)
  if (validation.error) return { success: false, error: validation.error }

  // Duplicate guard
  const duplicate = await checkDuplicateMonthlyBill(clientId, billMonth, billYear)
  if (duplicate) {
    return {
      success: false,
      error: `A monthly bill already exists for this period: ${duplicate.bill.billNumber} (${duplicate.bill.status})`,
    }
  }

  const setting = await getClientBillSetting(clientId)
  const gstRatePct = Number(setting.gstRate)
  const { taxAmount, totalAmount } = computeTax(amount, gstRatePct)
  const billNumber = await generateBillNumber()

  // Period dates: first and last day of the month
  const periodStart = new Date(billYear, billMonth - 1, 1)
  const periodEnd = new Date(billYear, billMonth, 0)  // day 0 of next month = last day

  const monthName = periodStart.toLocaleString('en-IN', { month: 'long' })
  const description = remarks?.trim() || `Monthly rental — ${monthName} ${billYear}`

  const bill = await prisma.$transaction(async (tx) => {
    const newBill = await tx.bill.create({
      data: {
        billNumber,
        clientId,
        billType: 'RENTAL',
        billDate: new Date(),
        dueDate: dueDate(),
        subtotal: new Decimal(amount),
        taxAmount: new Decimal(taxAmount),
        totalAmount: new Decimal(totalAmount),
        paidAmount: new Decimal(0),
        balanceAmount: new Decimal(totalAmount),
        status: 'PENDING',
        billItems: {
          create: [
            {
              description,
              quantity: 1,
              unitPrice: new Decimal(amount),
              totalPrice: new Decimal(amount),
            },
          ],
        },
      },
      include: { billItems: true, client: { select: { companyName: true, email: true } } },
    })

    await tx.billPeriod.create({
      data: {
        billId: newBill.id,
        billMonth,
        billYear,
        periodStart,
        periodEnd,
      },
    })

    return newBill
  })

  return {
    success: true,
    bill: {
      ...bill,
      gstRate: gstRatePct,
      taxAmount,
      totalAmount,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
    },
  }
}

// ─── Current Bill ─────────────────────────────────────────────────────────────
// Bill for an arbitrary date range (e.g. a mid-cycle addition or service charge).

export async function createCurrentBill(input: CurrentBillInput): Promise<BillingResult> {
  const { clientId, amount, periodStart, periodEnd, remarks, createdById } = input

  if (amount <= 0) return { success: false, error: 'Amount must be greater than 0' }

  const start = new Date(periodStart)
  const end = new Date(periodEnd)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { success: false, error: 'Invalid date range' }
  }
  if (end < start) return { success: false, error: 'End date must be after start date' }

  const validation = await validateClient(clientId)
  if (validation.error) return { success: false, error: validation.error }

  const setting = await getClientBillSetting(clientId)
  const gstRatePct = Number(setting.gstRate)
  const { taxAmount, totalAmount } = computeTax(amount, gstRatePct)
  const billNumber = await generateBillNumber()

  const startLabel = start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const endLabel = end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const description = remarks?.trim() || `Current bill — ${startLabel} to ${endLabel}`

  const bill = await prisma.$transaction(async (tx) => {
    const newBill = await tx.bill.create({
      data: {
        billNumber,
        clientId,
        billType: 'RENTAL',
        billDate: new Date(),
        dueDate: dueDate(),
        subtotal: new Decimal(amount),
        taxAmount: new Decimal(taxAmount),
        totalAmount: new Decimal(totalAmount),
        paidAmount: new Decimal(0),
        balanceAmount: new Decimal(totalAmount),
        status: 'PENDING',
        billItems: {
          create: [{ description, quantity: 1, unitPrice: new Decimal(amount), totalPrice: new Decimal(amount) }],
        },
      },
      include: { billItems: true, client: { select: { companyName: true, email: true } } },
    })

    await tx.billPeriod.create({
      data: {
        billId: newBill.id,
        billMonth: start.getMonth() + 1,
        billYear: start.getFullYear(),
        periodStart: start,
        periodEnd: end,
      },
    })

    return newBill
  })

  return { success: true, bill: { ...bill, gstRate: gstRatePct, taxAmount, totalAmount } }
}

// ─── Open Bill ────────────────────────────────────────────────────────────────
// Admin supplies the bill number (e.g. migrating from old system or one-off billing).
// Uniqueness of billNumber is enforced by the DB unique constraint on bills.billNumber.

export async function createOpenBill(input: OpenBillInput): Promise<BillingResult> {
  const { clientId, amount, billNumber, description, createdById } = input

  if (amount <= 0) return { success: false, error: 'Amount must be greater than 0' }
  if (!billNumber?.trim()) return { success: false, error: 'Bill number is required' }

  const validation = await validateClient(clientId)
  if (validation.error) return { success: false, error: validation.error }

  // Check if the supplied bill number is already taken
  const existing = await prisma.bill.findUnique({ where: { billNumber: billNumber.trim() } })
  if (existing) return { success: false, error: `Bill number ${billNumber} already exists` }

  const setting = await getClientBillSetting(clientId)
  const gstRatePct = Number(setting.gstRate)
  const { taxAmount, totalAmount } = computeTax(amount, gstRatePct)

  const bill = await prisma.bill.create({
    data: {
      billNumber: billNumber.trim(),
      clientId,
      billType: 'MAINTENANCE',
      billDate: new Date(),
      dueDate: dueDate(),
      subtotal: new Decimal(amount),
      taxAmount: new Decimal(taxAmount),
      totalAmount: new Decimal(totalAmount),
      paidAmount: new Decimal(0),
      balanceAmount: new Decimal(totalAmount),
      status: 'PENDING',
      billItems: {
        create: [{
          description: description?.trim() || 'Open bill',
          quantity: 1,
          unitPrice: new Decimal(amount),
          totalPrice: new Decimal(amount),
        }],
      },
    },
    include: { billItems: true, client: { select: { companyName: true, email: true } } },
  })

  return { success: true, bill: { ...bill, gstRate: gstRatePct, taxAmount, totalAmount } }
}

// ─── Tally Bill ───────────────────────────────────────────────────────────────
// Caller explicitly chooses a GST rate (overriding the client setting).
// Supports multiple line items (cartridges, services, etc.).

export async function createTallyBill(input: TallyBillInput): Promise<BillingResult> {
  const { clientId, amount, gstRate, items, createdById } = input

  if (amount <= 0) return { success: false, error: 'Amount must be greater than 0' }
  const validGstRates = [0, 5, 12, 18, 28]
  if (!validGstRates.includes(gstRate)) {
    return { success: false, error: `Invalid GST rate. Allowed: ${validGstRates.join(', ')}%` }
  }

  const validation = await validateClient(clientId)
  if (validation.error) return { success: false, error: validation.error }

  const { taxAmount, totalAmount } = computeTax(amount, gstRate)
  const billNumber = await generateBillNumber()

  // Build line items: use provided items or fall back to single line
  const lineItems = items && items.length > 0
    ? items.map(i => ({
        description: i.description,
        quantity: i.quantity,
        unitPrice: new Decimal(i.unitPrice),
        totalPrice: new Decimal(parseFloat((i.quantity * i.unitPrice).toFixed(2))),
      }))
    : [{ description: 'Tally bill', quantity: 1, unitPrice: new Decimal(amount), totalPrice: new Decimal(amount) }]

  const bill = await prisma.bill.create({
    data: {
      billNumber,
      clientId,
      billType: 'CARTRIDGE',
      billDate: new Date(),
      dueDate: dueDate(),
      subtotal: new Decimal(amount),
      taxAmount: new Decimal(taxAmount),
      totalAmount: new Decimal(totalAmount),
      paidAmount: new Decimal(0),
      balanceAmount: new Decimal(totalAmount),
      status: 'PENDING',
      billItems: { create: lineItems },
    },
    include: { billItems: true, client: { select: { companyName: true, email: true } } },
  })

  return { success: true, bill: { ...bill, gstRate, taxAmount, totalAmount } }
}

// ─── Bill Query ───────────────────────────────────────────────────────────────
// Look up a bill by number with full detail.

export async function queryBill(billNumber: string) {
  if (!billNumber?.trim()) return null

  const bill = await prisma.bill.findUnique({
    where: { billNumber: billNumber.trim() },
    include: {
      billItems: true,
      payments: { orderBy: { paymentDate: 'desc' } },
      client: { select: { companyName: true, clientCode: true, email: true, phone: true } },
      billPeriod: true,
    },
  })
  return bill
}

// ─── Edit Bill ────────────────────────────────────────────────────────────────
// Allows updating amount/remarks on a PENDING bill only.
// Recalculates tax and balance.

export async function editBill(
  billId: string,
  updates: { amount?: number; remarks?: string }
): Promise<BillingResult> {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { billItems: true },
  })

  if (!bill) return { success: false, error: 'Bill not found' }
  if (bill.status !== 'PENDING') {
    return { success: false, error: `Cannot edit a bill with status: ${bill.status}` }
  }

  const setting = await getClientBillSetting(bill.clientId)
  const gstRatePct = Number(setting.gstRate)
  const newAmount = updates.amount ?? Number(bill.subtotal)

  if (newAmount <= 0) return { success: false, error: 'Amount must be greater than 0' }
  const { taxAmount, totalAmount } = computeTax(newAmount, gstRatePct)

  const updated = await prisma.$transaction(async (tx) => {
    // Update all bill items to the single line (simplification for edit flow)
    if (updates.amount !== undefined) {
      await tx.billItem.deleteMany({ where: { billId } })
      await tx.billItem.create({
        data: {
          billId,
          description: updates.remarks ?? bill.billItems[0]?.description ?? 'Updated bill',
          quantity: 1,
          unitPrice: new Decimal(newAmount),
          totalPrice: new Decimal(newAmount),
        },
      })
    }

    return tx.bill.update({
      where: { id: billId },
      data: {
        subtotal: new Decimal(newAmount),
        taxAmount: new Decimal(taxAmount),
        totalAmount: new Decimal(totalAmount),
        balanceAmount: new Decimal(totalAmount - Number(bill.paidAmount)),
      },
      include: { billItems: true, client: { select: { companyName: true, email: true } } },
    })
  })

  return { success: true, bill: updated }
}

// ─── Last Bill Query ──────────────────────────────────────────────────────────
// Returns the most recent bill for each client (or a specific client).

export async function getLastBills(clientId?: string) {
  if (clientId) {
    const bill = await prisma.bill.findFirst({
      where: { clientId },
      orderBy: { billDate: 'desc' },
      include: { client: { select: { companyName: true, clientCode: true } } },
    })
    return bill ? [bill] : []
  }

  // All clients — one latest bill each using a subquery approach
  const clients = await prisma.client.findMany({
    where: { isActive: true },
    include: {
      bills: {
        orderBy: { billDate: 'desc' },
        take: 1,
        select: { billNumber: true, billDate: true, totalAmount: true, status: true },
      },
    },
    orderBy: { companyName: 'asc' },
  })

  return clients
    .filter(c => c.bills.length > 0)
    .map(c => ({
      clientId: c.id,
      clientCode: c.clientCode,
      companyName: c.companyName,
      lastBillNo: c.bills[0].billNumber,
      lastBillDate: c.bills[0].billDate,
      lastBillAmount: c.bills[0].totalAmount,
      lastBillStatus: c.bills[0].status,
    }))
}

// ─── Pending GST ─────────────────────────────────────────────────────────────
// Bills that are PENDING/SENT with a non-zero tax amount — i.e. GST not yet collected.

export async function getPendingGstBills(month?: number, year?: number) {
  const where: any = {
    status: { in: ['PENDING', 'SENT'] },
    taxAmount: { gt: 0 },
  }

  if (month && year) {
    where.billPeriod = { billMonth: month, billYear: year }
  }

  const bills = await prisma.bill.findMany({
    where,
    include: {
      client: { select: { companyName: true, clientCode: true, gstNumber: true } },
      billPeriod: true,
    },
    orderBy: { billDate: 'asc' },
  })

  return bills.map((b, i) => ({
    sr: i + 1,
    billNo: b.billNumber,
    client: b.client.companyName,
    clientCode: b.client.clientCode,
    gstNumber: b.client.gstNumber,
    amount: Number(b.subtotal),
    gstAmount: Number(b.taxAmount),
    totalAmount: Number(b.totalAmount),
    pendingSince: b.billDate,
    status: b.status,
  }))
}