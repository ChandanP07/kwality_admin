// lib/generate-bill-pdf.ts
// Generates a professional invoice PDF as a base64 string.
// Uses @react-pdf/renderer — install with:
//   npm install @react-pdf/renderer --legacy-peer-deps
//
// Returns: base64 string of the PDF

import { renderToBuffer } from '@react-pdf/renderer'
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '2 solid #6366f1',
  },
  companyName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#4f46e5' },
  companyInfo: { fontSize: 9, color: '#64748b', marginTop: 2 },
  invoiceTitle: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#4f46e5', textAlign: 'right' },
  invoiceNumber: { fontSize: 10, color: '#64748b', textAlign: 'right', marginTop: 4 },
  // Billing info
  billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  billingBlock: { width: '48%' },
  sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  clientName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 2 },
  clientDetail: { fontSize: 9, color: '#475569', marginBottom: 2 },
  // Dates row
  datesRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  dateBlock: { backgroundColor: '#f8fafc', borderRadius: 6, padding: 10, flex: 1 },
  dateLabel: { fontSize: 8, color: '#94a3b8', marginBottom: 3 },
  dateValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  // Table
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#4f46e5', padding: '8 10', borderRadius: '4 4 0 0' },
  tableRow: { flexDirection: 'row', padding: '7 10', borderBottom: '1 solid #e2e8f0' },
  tableRowAlt: { flexDirection: 'row', padding: '7 10', borderBottom: '1 solid #e2e8f0', backgroundColor: '#f8fafc' },
  colDesc: { flex: 3, fontSize: 9, color: '#f1f5f9', fontFamily: 'Helvetica-Bold' },
  colQty: { flex: 1, fontSize: 9, color: '#f1f5f9', textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  colPrice: { flex: 1.5, fontSize: 9, color: '#f1f5f9', textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  colDescVal: { flex: 3, fontSize: 9, color: '#1e293b' },
  colQtyVal: { flex: 1, fontSize: 9, color: '#1e293b', textAlign: 'center' },
  colPriceVal: { flex: 1.5, fontSize: 9, color: '#1e293b', textAlign: 'right' },
  // Totals
  totalsBlock: { alignItems: 'flex-end', marginBottom: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 220, marginBottom: 4 },
  totalLabel: { fontSize: 9, color: '#64748b' },
  totalValue: { fontSize: 9, color: '#1e293b' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 220, backgroundColor: '#4f46e5', padding: '8 10', borderRadius: 4, marginTop: 4 },
  grandLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  grandValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  // Bank details
  bankBox: { backgroundColor: '#f0fdf4', border: '1 solid #bbf7d0', borderRadius: 6, padding: 12, marginBottom: 16 },
  bankTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534', marginBottom: 6 },
  bankRow: { flexDirection: 'row', marginBottom: 3 },
  bankLabel: { fontSize: 8, color: '#64748b', width: 100 },
  bankValue: { fontSize: 8, color: '#1e293b', fontFamily: 'Helvetica-Bold' },
  // Status badge
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  // Footer
  footer: { borderTop: '1 solid #e2e8f0', paddingTop: 12, textAlign: 'center' },
  footerText: { fontSize: 8, color: '#94a3b8' },
})

interface BillData {
  billNumber:   string
  billDate:     string
  dueDate?:     string
  billType:     string
  status:       string
  subtotal:     number
  taxAmount:    number
  totalAmount:  number
  paidAmount:   number
  balanceAmount: number
  client: {
    companyName:   string
    address:       string
    state:         string
    gstNumber?:    string
    contactPerson: string
    email?:        string
    phone:         string
  }
  billItems: {
    description: string
    quantity:    number
    unitPrice:   number
    totalPrice:  number
  }[]
  company: {
    name:      string
    address:   string
    gst:       string
    phone:     string
    email:     string
    bank:      string
    ifsc:      string
    account:   string
  }
}

function fmt(n: number) {
  return `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function BillPDF({ data }: { data: BillData }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.companyName }, data.company.name),
          React.createElement(Text, { style: styles.companyInfo }, data.company.address),
          React.createElement(Text, { style: styles.companyInfo }, `GST: ${data.company.gst}`),
          React.createElement(Text, { style: styles.companyInfo }, `Ph: ${data.company.phone} | ${data.company.email}`),
        ),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.invoiceTitle }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceNumber }, data.billNumber),
        )
      ),

      // Billing info
      React.createElement(View, { style: styles.billingRow },
        React.createElement(View, { style: styles.billingBlock },
          React.createElement(Text, { style: styles.sectionLabel }, 'Bill To'),
          React.createElement(Text, { style: styles.clientName }, data.client.companyName),
          React.createElement(Text, { style: styles.clientDetail }, data.client.address),
          React.createElement(Text, { style: styles.clientDetail }, data.client.state),
          data.client.gstNumber && React.createElement(Text, { style: styles.clientDetail }, `GST: ${data.client.gstNumber}`),
          React.createElement(Text, { style: styles.clientDetail }, `Contact: ${data.client.contactPerson}`),
          React.createElement(Text, { style: styles.clientDetail }, `Ph: ${data.client.phone}`),
        ),
        React.createElement(View, { style: styles.billingBlock },
          React.createElement(Text, { style: styles.sectionLabel }, 'Invoice Details'),
          React.createElement(View, { style: styles.datesRow },
            React.createElement(View, { style: styles.dateBlock },
              React.createElement(Text, { style: styles.dateLabel }, 'Invoice Date'),
              React.createElement(Text, { style: styles.dateValue }, data.billDate),
            ),
            data.dueDate && React.createElement(View, { style: styles.dateBlock },
              React.createElement(Text, { style: styles.dateLabel }, 'Due Date'),
              React.createElement(Text, { style: styles.dateValue }, data.dueDate),
            ),
          ),
        ),
      ),

      // Items table
      React.createElement(View, { style: styles.table },
        React.createElement(View, { style: styles.tableHeader },
          React.createElement(Text, { style: styles.colDesc },    'Description'),
          React.createElement(Text, { style: styles.colQty },     'Qty'),
          React.createElement(Text, { style: styles.colPrice },   'Unit Price'),
          React.createElement(Text, { style: styles.colPrice },   'Total'),
        ),
        ...data.billItems.map((item, i) =>
          React.createElement(View, { key: i, style: i % 2 === 0 ? styles.tableRow : styles.tableRowAlt },
            React.createElement(Text, { style: styles.colDescVal  }, item.description),
            React.createElement(Text, { style: styles.colQtyVal   }, String(item.quantity)),
            React.createElement(Text, { style: styles.colPriceVal }, fmt(item.unitPrice)),
            React.createElement(Text, { style: styles.colPriceVal }, fmt(item.totalPrice)),
          )
        ),
      ),

      // Totals
      React.createElement(View, { style: styles.totalsBlock },
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'Subtotal'),
          React.createElement(Text, { style: styles.totalValue }, fmt(data.subtotal)),
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'GST (18%)'),
          React.createElement(Text, { style: styles.totalValue }, fmt(data.taxAmount)),
        ),
        React.createElement(View, { style: styles.grandTotalRow },
          React.createElement(Text, { style: styles.grandLabel }, 'Total Amount'),
          React.createElement(Text, { style: styles.grandValue }, fmt(data.totalAmount)),
        ),
        data.paidAmount > 0 && React.createElement(View, { style: { ...styles.totalRow, marginTop: 6 } },
          React.createElement(Text, { style: styles.totalLabel }, 'Amount Paid'),
          React.createElement(Text, { style: { ...styles.totalValue, color: '#16a34a' } }, fmt(data.paidAmount)),
        ),
        data.balanceAmount > 0 && React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: { ...styles.totalLabel, fontFamily: 'Helvetica-Bold' } }, 'Balance Due'),
          React.createElement(Text, { style: { ...styles.totalValue, fontFamily: 'Helvetica-Bold', color: '#dc2626' } }, fmt(data.balanceAmount)),
        ),
      ),

      // Bank details
      React.createElement(View, { style: styles.bankBox },
        React.createElement(Text, { style: styles.bankTitle }, '🏦 Bank Details for Payment'),
        React.createElement(View, { style: styles.bankRow },
          React.createElement(Text, { style: styles.bankLabel }, 'Account Name'),
          React.createElement(Text, { style: styles.bankValue }, data.company.name),
        ),
        React.createElement(View, { style: styles.bankRow },
          React.createElement(Text, { style: styles.bankLabel }, 'Bank'),
          React.createElement(Text, { style: styles.bankValue }, data.company.bank),
        ),
        React.createElement(View, { style: styles.bankRow },
          React.createElement(Text, { style: styles.bankLabel }, 'Account No.'),
          React.createElement(Text, { style: styles.bankValue }, data.company.account),
        ),
        React.createElement(View, { style: styles.bankRow },
          React.createElement(Text, { style: styles.bankLabel }, 'IFSC'),
          React.createElement(Text, { style: styles.bankValue }, data.company.ifsc),
        ),
      ),

      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, { style: styles.footerText },
          'Thank you for your business! For queries, contact us at ' + data.company.email
        ),
        React.createElement(Text, { style: { ...styles.footerText, marginTop: 4 } },
          'This is a computer-generated invoice and does not require a signature.'
        ),
      ),
    )
  )
}

export async function generateBillPDF(data: BillData): Promise<Buffer> {
  const element = React.createElement(BillPDF, { data })
  const buffer  = await renderToBuffer(element as any)
  return buffer
}