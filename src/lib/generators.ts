// 4. Create a utility for generating codes: src/lib/generators.ts
import { prisma } from './prisma'

export async function generateClientCode(): Promise<string> {
  const lastClient = await prisma.client.findFirst({
    orderBy: { clientCode: 'desc' },
    where: { clientCode: { startsWith: 'CL' } }
  })
  
  if (!lastClient) return 'CL0001'
  
  const lastNumber = parseInt(lastClient.clientCode.substring(2))
  const nextNumber = lastNumber + 1
  return `CL${nextNumber.toString().padStart(4, '0')}`
}

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2)
  const prefix = `ORD-${year}-`
  
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' },
    where: { orderNumber: { startsWith: prefix } }
  })
  
  if (!lastOrder) return `${prefix}0001`
  
  const lastNumber = parseInt(lastOrder.orderNumber.split('-')[2])
  const nextNumber = lastNumber + 1
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`
}

export async function generateBillNumber(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const prefix = `BILL-${year}${month}-`
  
  const lastBill = await prisma.bill.findFirst({
    orderBy: { billNumber: 'desc' },
    where: { billNumber: { startsWith: prefix } }
  })
  
  if (!lastBill) return `${prefix}0001`
  
  const lastNumber = parseInt(lastBill.billNumber.split('-')[2])
  const nextNumber = lastNumber + 1
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`
}

export async function generateAgreementNumber(): Promise<string> {
  const year = new Date().getFullYear().toString()
  const prefix = `AGR-${year}-`
  
  const lastAgreement = await prisma.agreement.findFirst({
    orderBy: { agreementNumber: 'desc' },
    where: { agreementNumber: { startsWith: prefix } }
  })
  
  if (!lastAgreement) return `${prefix}0001`
  
  const lastNumber = parseInt(lastAgreement.agreementNumber.split('-')[2])
  const nextNumber = lastNumber + 1
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`
}