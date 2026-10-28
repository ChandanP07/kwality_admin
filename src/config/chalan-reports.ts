// Location: src/config/chalan-reports.ts
// Purpose: Central configuration for all Chalan/Bill Management screens
// ✅ COMPLETE VERSION - All 35 screens configured

export interface ChalanFilterConfig {
  type: 'text' | 'autocomplete' | 'daterange' | 'dropdown' | 'monthyear' | 'checkbox' | 'textarea'
  name: string
  label: string
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface ChalanColumnConfig {
  header: string
  key: string
  width: number
  type?: 'text' | 'link' | 'button' | 'number' | 'date' | 'checkbox'
  linkTo?: string
}

export interface ChalanScreenConfig {
  id: string
  title: string
  category: string
  categoryPath: string
  screenPath: string
  description?: string
  filters: ChalanFilterConfig[]
  columns?: ChalanColumnConfig[]
  actions?: {
    label: string
    type: 'button' | 'export' | 'download'
    action: string
  }[]
  exportType?: 'csv' | 'pdf' | 'excel' | 'none'
  pagination?: boolean
  fixedValues?: Record<string, any>
  model?: string
}

export const chalanScreens: Record<string, ChalanScreenConfig> = {
  // ==================== SEND BILLS SECTION (3 screens) ====================
  'send-bills-edit': {
    id: 'send-bills-edit',
    title: 'Edit Monthly Bill',
    category: 'SEND BILLS',
    categoryPath: 'send-bills',
    screenPath: 'edit',
    model: 'bill',
    description: 'Edit monthly bill - click on blue chalan link to update',
    filters: [
      { type: 'text', name: 'challanNo', label: 'Challan Number', placeholder: 'Enter challan number' }
    ],
    columns: [
      { header: 'Bill No', key: 'billNo', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    pagination: true,
    exportType: 'none'
  },

  'send-bills-courier': {
    id: 'send-bills-courier',
    title: 'Send Bills - Courier',
    category: 'SEND BILLS',
    categoryPath: 'send-bills',
    screenPath: 'courier',
    model: 'bill',
    description: 'Pending mail bill list - select users by checkbox and mail',
    filters: [],
    columns: [
      { header: 'Select', key: 'select', width: 10, type: 'checkbox' },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    actions: [
      { label: 'Send Mail', type: 'button', action: 'sendMail' }
    ],
    pagination: true,
    exportType: 'none'
  },

  'send-bills-email': {
    id: 'send-bills-email',
    title: 'Send Bills - Email',
    category: 'SEND BILLS',
    categoryPath: 'send-bills',
    screenPath: 'email',
    model: 'bill',
    description: 'Email bills to clients',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    pagination: true,
    exportType: 'none'
  },

  // ==================== PAGE COUNT SECTION (10 screens) ====================
  'page-count-all': {
    id: 'page-count-all',
    title: 'Page Count - All',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'all',
    model: 'pageCount',
    description: 'Add page counts for printer models',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['ALL'], required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Last Month Page Count', key: 'lastMonthCount', width: 20 },
      { header: 'A4-Bk (Current Month)', key: 'a4Bk', width: 20, type: 'text' },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    actions: [
      { label: 'Add Page Count', type: 'button', action: 'addPageCount' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'page-count-verify': {
    id: 'page-count-verify',
    title: 'Verify Count',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'verify',
    model: 'pageCount',
    description: 'Verify page counts',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Printer Model', key: 'printerModel', width: 20 },
      { header: 'Serial No', key: 'serialNo', width: 15 },
      { header: 'Page Count', key: 'pageCount', width: 15 },
      { header: 'Verified', key: 'verified', width: 15 }
    ],
    pagination: true,
    exportType: 'csv'
  },

  'page-count-partner-work': {
    id: 'page-count-partner-work',
    title: 'Partner Work',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'partner-work',
    model: 'partnerWork',
    description: 'Partner work - Kwality Andheri only',
    fixedValues: {
      vendor: 'Kwality Enterprises',
      branch: 'Andheri'
    },
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['Andheri'] },
      { type: 'dropdown', name: 'vendor', label: 'Page Count Vendor', options: ['Kwality Enterprises'] },
      { type: 'dropdown', name: 'billType', label: 'Bill Type', options: ['Type 1', 'Type 2', 'Type 3', 'Type 4'] }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'View', key: 'view', width: 15, type: 'link' },
      { header: 'Printer Model', key: 'printerModel', width: 20 },
      { header: 'Page Count', key: 'pageCount', width: 15 }
    ],
    actions: [
      { label: 'View Vendor Mapping', type: 'button', action: 'viewMapping' }
    ],
    pagination: true,
    exportType: 'pdf'
  },

  'page-count-reset': {
    id: 'page-count-reset',
    title: 'Reset Count',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'reset',
    model: 'pageCount',
    description: 'Reset page count for specific printer',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['Andheri'], required: true },
      { type: 'dropdown', name: 'printer', label: 'Printer', options: [], required: true },
      { type: 'dropdown', name: 'serialNo', label: 'Serial Number', options: [], required: true }
    ],
    columns: [
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Current Page Count', key: 'currentCount', width: 20 },
      { header: 'Last Reset Date', key: 'lastResetDate', width: 20 }
    ],
    actions: [
      { label: 'Reset Page Count', type: 'button', action: 'resetCount' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'page-count-opening': {
    id: 'page-count-opening',
    title: 'Opening Count',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'opening',
    model: 'pageCount',
    description: 'Set opening page counts',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['Andheri'], required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Opening Count', key: 'openingCount', width: 20, type: 'text' },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    actions: [
      { label: 'Add Opening Count', type: 'button', action: 'addOpeningCount' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'page-count-calculations': {
    id: 'page-count-calculations',
    title: 'Page Count Calculations',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'calculations',
    model: 'pageCount',
    description: 'Calculate page counts for month',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'printerModel', width: 20 },
      { header: 'Serial No', key: 'serialNo', width: 15 },
      { header: 'Opening', key: 'opening', width: 15 },
      { header: 'Closing', key: 'closing', width: 15 },
      { header: 'Total Pages', key: 'totalPages', width: 15 }
    ],
    pagination: false,
    exportType: 'csv'
  },

  'page-count-view': {
    id: 'page-count-view',
    title: 'View Page Count',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'view',
    model: 'pageCount',
    description: 'View page counts for date range',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'city', label: 'City', options: ['ALL'], required: true },
      { type: 'monthyear', name: 'fromMonthYear', label: 'From Month/Year', required: true },
      { type: 'monthyear', name: 'toMonthYear', label: 'To Month/Year', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Printer Model', key: 'printerModel', width: 20 },
      { header: 'Serial No', key: 'serialNo', width: 15 },
      { header: 'Page Count', key: 'pageCount', width: 15 },
      { header: 'Total', key: 'total', width: 15 }
    ],
    pagination: false,
    exportType: 'csv'
  },

  'page-count-remove': {
    id: 'page-count-remove',
    title: 'Remove Count',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'remove',
    model: 'pageCount',
    description: 'Remove page count (set to zero)',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['Andheri'], required: true },
      { type: 'dropdown', name: 'printer', label: 'Printer', options: [], required: true },
      { type: 'dropdown', name: 'serialNo', label: 'Serial Number', options: [], required: true },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year', required: true }
    ],
    columns: [
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Current Page Count', key: 'currentCount', width: 25 },
      { header: 'Month/Year', key: 'monthYear', width: 15 }
    ],
    actions: [
      { label: 'Remove Page Count', type: 'button', action: 'removeCount' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'page-count-print-report': {
    id: 'page-count-print-report',
    title: 'Print Report',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'print-report',
    model: 'pageCount',
    description: 'Generate PDF report for printers',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['Andheri'], required: true },
      { type: 'dropdown', name: 'vendor', label: 'Vendor', options: ['Kwality Enterprises'] }
    ],
    columns: [],
    actions: [
      { label: 'View Details (PDF)', type: 'download', action: 'downloadPDF' }
    ],
    pagination: false,
    exportType: 'pdf'
  },

  'page-count-zero-mail': {
    id: 'page-count-zero-mail',
    title: 'Zero Count Mail',
    category: 'PAGE COUNT',
    categoryPath: 'page-count',
    screenPath: 'zero-mail',
    model: 'pageCount',
    description: 'Zero page count for month - Bhavna Enterprises only',
    fixedValues: {
      client: 'Bhavna Enterprises'
    },
    filters: [
      { type: 'dropdown', name: 'client', label: 'Client', options: ['Bhavna Enterprises'], required: true },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year', required: true }
    ],
    columns: [],
    actions: [
      { label: 'Zero Count', type: 'button', action: 'zeroCount' }
    ],
    pagination: false,
    exportType: 'none'
  },

  // ==================== TALLY EXPORTS SECTION (1 screen) ====================
  'tally-exports-printer-transfer': {
    id: 'tally-exports-printer-transfer',
    title: 'Printer Transfer',
    category: 'TALLY EXPORTS',
    categoryPath: 'tally-exports',
    screenPath: 'printer-transfer',
    model: 'tallyExport',
    description: 'Printer transfer list with Make Bill hyperlink',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Printer Model', key: 'printerModel', width: 20 },
      { header: 'Make Bill', key: 'makeBill', width: 15, type: 'link' },
      { header: 'Status', key: 'status', width: 15 }
    ],
    pagination: true,
    exportType: 'none'
  },

  // ==================== TALLY LEDGER SECTION (1 screen) ====================
  'tally-ledger': {
    id: 'tally-ledger',
    title: 'Tally Ledger',
    category: 'TALLY LEDGER',
    categoryPath: 'tally-ledger',
    screenPath: '',
    model: 'tallyLedger',
    description: 'Add ledger types with GST',
    filters: [
      { type: 'text', name: 'ledgerName', label: 'Ledger Name', placeholder: 'Enter ledger name', required: true },
      { type: 'dropdown', name: 'gst', label: 'GST', options: ['12%', '18%', '28%'], required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Ledger Name', key: 'ledgerName', width: 40 },
      { header: 'GST', key: 'gst', width: 15 },
      { header: 'Created Date', key: 'createdDate', width: 20 },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    actions: [
      { label: 'Add Type', type: 'button', action: 'addType' }
    ],
    pagination: true,
    exportType: 'none'
  },

  // ==================== TALLY PAYMENT SECTION (3 screens) ====================
  'tally-payment-view': {
    id: 'tally-payment-view',
    title: 'Tally Payment - View',
    category: 'TALLY PAYMENT',
    categoryPath: 'tally-payment',
    screenPath: 'view',
    model: 'tallyPayment',
    description: 'View payment details',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Payment Mode', key: 'paymentMode', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    pagination: true,
    exportType: 'csv'
  },

  'tally-payment-pending': {
    id: 'tally-payment-pending',
    title: 'Tally Payment - Pending',
    category: 'TALLY PAYMENT',
    categoryPath: 'tally-payment',
    screenPath: 'pending',
    model: 'tallyPayment',
    description: 'Pending payments with hyperlinks',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client', key: 'client', width: 20, type: 'link' },
      { header: 'Mail', key: 'mail', width: 15, type: 'link' },
      { header: 'EXEC', key: 'exec', width: 15, type: 'link' },
      { header: 'BILL_NO', key: 'billNo', width: 15, type: 'link' },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 }
    ],
    pagination: true,
    exportType: 'none'
  },

  'tally-payment-email': {
    id: 'tally-payment-email',
    title: 'Tally Payment - Email',
    category: 'TALLY PAYMENT',
    categoryPath: 'tally-payment',
    screenPath: 'email',
    model: 'tallyPayment',
    description: 'Email payment reminders',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Action', key: 'action', width: 10, type: 'button' }
    ],
    pagination: true,
    exportType: 'none'
  },

  // ==================== e-INVOICE SECTION (4 screens) ====================
  'einvoice-pending-import': {
    id: 'einvoice-pending-import',
    title: 'e-Invoice - Pending Import',
    category: 'e-INVOICE',
    categoryPath: 'einvoice',
    screenPath: 'pending-import',
    model: 'eInvoice',
    description: 'Pending import list with BILL_NO hyperlink',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'BILL_NO', key: 'billNo', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 20 }
    ],
    pagination: true,
    exportType: 'none'
  },

  'einvoice-tally2soft': {
    id: 'einvoice-tally2soft',
    title: 'e-Invoice - Tally 2 Soft',
    category: 'e-INVOICE',
    categoryPath: 'einvoice',
    screenPath: 'tally2soft',
    model: 'eInvoice',
    description: 'Tally to software sync with hyperlinks',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'CHALAN/BILL', key: 'chalanBill', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'UPDATE', key: 'update', width: 15, type: 'link' },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 20 }
    ],
    pagination: true,
    exportType: 'none'
  },

  'einvoice-pending-irn': {
    id: 'einvoice-pending-irn',
    title: 'e-Invoice - Pending IRN',
    category: 'e-INVOICE',
    categoryPath: 'einvoice',
    screenPath: 'pending-irn',
    model: 'eInvoice',
    description: 'Pending IRN generation',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    pagination: true,
    exportType: 'none'
  },

  'einvoice-multi-print': {
    id: 'einvoice-multi-print',
    title: 'e-Invoice - Multi Print',
    category: 'e-INVOICE',
    categoryPath: 'einvoice',
    screenPath: 'multi-print',
    model: 'eInvoice',
    description: 'Print multiple bills',
    filters: [
      { type: 'text', name: 'firstBillNo', label: 'First Bill Number', placeholder: 'Enter first bill number', required: true },
      { type: 'text', name: 'lastBillNo', label: 'Last Bill Number', placeholder: 'Enter last bill number', required: true },
      { type: 'dropdown', name: 'billType', label: 'Bill Type', options: ['Type 1', 'Type 2', 'Type 3'], required: true }
    ],
    columns: [],
    actions: [
      { label: 'Print', type: 'button', action: 'print' }
    ],
    pagination: false,
    exportType: 'none'
  },

  // ==================== TALLY UPDATE SECTION (1 screen) ====================
  'tally-update': {
    id: 'tally-update',
    title: 'Tally Update',
    category: 'TALLY UPDATE',
    categoryPath: 'tally-update',
    screenPath: '',
    model: 'tallyUpdate',
    description: 'Tally update list with hyperlinks',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'ORD_NO', key: 'ordNo', width: 15, type: 'link' },
      { header: 'CLIENT', key: 'client', width: 25, type: 'link' },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 20 }
    ],
    pagination: true,
    exportType: 'none'
  },

  // ==================== BILL UPDATES SECTION (6 screens) ====================
  'bill-updates-stop-manual': {
    id: 'bill-updates-stop-manual',
    title: 'Stop Bill - Manual',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'stop-manual',
    model: 'billUpdate',
    description: 'Stop bill update manually - Bhavna Enterprises, ALL',
    fixedValues: {
      client: 'Bhavna Enterprises',
      branch: 'ALL'
    },
    filters: [
      { type: 'dropdown', name: 'client', label: 'Client', options: ['Bhavna Enterprises'], required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['ALL'], required: true }
    ],
    columns: [
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Branch', key: 'branch', width: 20 },
      { header: 'Last Bill Date', key: 'lastBillDate', width: 20 },
      { header: 'Status', key: 'status', width: 20 }
    ],
    actions: [
      { label: 'Stop Bill Update', type: 'button', action: 'stopBill' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'bill-updates-stop-auto': {
    id: 'bill-updates-stop-auto',
    title: 'Stop Bill - Auto',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'stop-auto',
    model: 'billUpdate',
    description: 'Auto stopped bills with remove functionality',
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Stop Date', key: 'stopDate', width: 15 },
      { header: 'Reason', key: 'reason', width: 25 },
      { header: 'Remove', key: 'remove', width: 10, type: 'button' }
    ],
    pagination: true,
    exportType: 'none'
  },

  'bill-updates-rate': {
    id: 'bill-updates-rate',
    title: 'Rate Update',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'rate',
    model: 'billUpdate',
    description: 'Update cartridge rates',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'branch', label: 'Branch', options: ['ALL', 'Andheri'], required: true }
    ],
    columns: [
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 30 },
      { header: 'Current Rate', key: 'currentRate', width: 20 },
      { header: 'New Rate', key: 'newRate', width: 20, type: 'text' },
      { header: 'Action', key: 'action', width: 15, type: 'button' }
    ],
    actions: [
      { label: 'Update Rate', type: 'button', action: 'updateRate' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'bill-updates-gst': {
    id: 'bill-updates-gst',
    title: 'GST Update',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'gst',
    model: 'billUpdate',
    description: 'Update GST rates',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'dropdown', name: 'gstRate', label: 'GST Rate', options: ['12%', '18%', '28%'], required: true }
    ],
    columns: [
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Current GST', key: 'currentGst', width: 20 },
      { header: 'New GST', key: 'newGst', width: 20 },
      { header: 'Effective Date', key: 'effectiveDate', width: 20 }
    ],
    actions: [
      { label: 'Update GST', type: 'button', action: 'updateGST' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'bill-updates-tally-name': {
    id: 'bill-updates-tally-name',
    title: 'Tally Name',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'tally-name',
    model: 'billUpdate',
    description: 'Update tally names with hyperlinks',
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Branchwise', key: 'branchwise', width: 15, type: 'link' },
      { header: 'State', key: 'state', width: 15, type: 'link' },
      { header: 'Tally Name', key: 'tallyName', width: 25 },
      { header: 'Action', key: 'action', width: 10, type: 'button' }
    ],
    pagination: true,
    exportType: 'none'
  },

  'bill-updates-last-bill': {
    id: 'bill-updates-last-bill',
    title: 'Last Bill No',
    category: 'BILL UPDATES',
    categoryPath: 'bill-updates',
    screenPath: 'last-bill',
    model: 'billUpdate',
    description: 'View last bill numbers',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Last Bill No', key: 'lastBillNo', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Amount', key: 'amount', width: 20 }
    ],
    pagination: true,
    exportType: 'csv'
  },

  // ==================== BILLING SECTION (4 screens) ====================
  'billing-monthly': {
    id: 'billing-monthly',
    title: 'Monthly Bill',
    category: 'BILLING',
    categoryPath: 'billing',
    screenPath: 'monthly',
    model: 'bill',
    description: 'Create monthly bill',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year', required: true },
      { type: 'text', name: 'amount', label: 'Amount', placeholder: 'Enter amount', required: true },
      { type: 'textarea', name: 'remarks', label: 'Remarks', placeholder: 'Enter remarks' }
    ],
    columns: [],
    actions: [
      { label: 'Add Bill Details', type: 'button', action: 'addBill' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'billing-current': {
    id: 'billing-current',
    title: 'Current Bill',
    category: 'BILLING',
    categoryPath: 'billing',
    screenPath: 'current',
    model: 'bill',
    description: 'Create current bill',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'text', name: 'amount', label: 'Amount', placeholder: 'Enter amount', required: true },
      { type: 'daterange', name: 'dateRange', label: 'Bill Period' },
      { type: 'textarea', name: 'remarks', label: 'Remarks', placeholder: 'Enter remarks' }
    ],
    columns: [],
    actions: [
      { label: 'Add Bill Details', type: 'button', action: 'addBill' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'billing-open': {
    id: 'billing-open',
    title: 'Open Bill',
    category: 'BILLING',
    categoryPath: 'billing',
    screenPath: 'open',
    model: 'bill',
    description: 'Create open bill',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'text', name: 'amount', label: 'Amount', placeholder: 'Enter amount', required: true },
      { type: 'text', name: 'billNo', label: 'Bill Number', placeholder: 'Enter bill number', required: true },
      { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Enter description' }
    ],
    columns: [],
    actions: [
      { label: 'Add Bill Details', type: 'button', action: 'addBill' }
    ],
    pagination: false,
    exportType: 'none'
  },

  'billing-tally': {
    id: 'billing-tally',
    title: 'Tally Bill',
    category: 'BILLING',
    categoryPath: 'billing',
    screenPath: 'tally',
    model: 'bill',
    description: 'Create tally bill',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'text', name: 'amount', label: 'Amount', placeholder: 'Enter amount', required: true },
      { type: 'dropdown', name: 'gst', label: 'GST', options: ['12%', '18%', '28%'], required: true },
      { type: 'textarea', name: 'items', label: 'Items', placeholder: 'Enter items' }
    ],
    columns: [],
    actions: [
      { label: 'Add Bill Details', type: 'button', action: 'addBill' }
    ],
    pagination: false,
    exportType: 'none'
  },

  // ==================== BILL QUERY SECTION (1 screen) ====================
  'bill-query': {
    id: 'bill-query',
    title: 'Bill Query',
    category: 'BILL QUERY',
    categoryPath: 'bill-query',
    screenPath: '',
    model: 'bill',
    description: 'Search bill by number',
    filters: [
      { type: 'text', name: 'billNo', label: 'Bill Number', placeholder: 'Enter bill number', required: true }
    ],
    columns: [
      { header: 'Bill No', key: 'billNo', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 }
    ],
    actions: [
      { label: 'Search', type: 'button', action: 'search' }
    ],
    pagination: false,
    exportType: 'none'
  },

  // ==================== PENDING GST SECTION (1 screen) ====================
  'pending-gst': {
    id: 'pending-gst',
    title: 'Pending GST',
    category: 'PENDING GST',
    categoryPath: 'pending-gst',
    screenPath: '',
    model: 'bill',
    description: 'List of clients with pending GST',
    filters: [
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Bill_No', key: 'billNo', width: 15, type: 'link' },
      { header: 'Client', key: 'client', width: 30, type: 'link' },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'GST Amount', key: 'gstAmount', width: 15 },
      { header: 'Pending Since', key: 'pendingSince', width: 15 }
    ],
    pagination: true,
    exportType: 'csv'
  }
}

export default chalanScreens