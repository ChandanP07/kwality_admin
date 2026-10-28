// Location: src/config/reports.ts
// Purpose: Central configuration for all 42 MIS reports

export interface FilterConfig {
  type: 'text' | 'autocomplete' | 'daterange' | 'dropdown' | 'monthyear'
  name: string
  label: string
  placeholder?: string
  options?: string[]
}

export interface ColumnConfig {
  header: string
  key: string
  width: number
}

export interface ReportConfig {
  id: string
  title: string
  category: string
  categoryPath: string
  reportPath: string
  filters: FilterConfig[]
  columns: ColumnConfig[]
  exportFileName: string
  model?: string
  dateField?: string
  include?: unknown
  fixedValues?: Record<string, any>
}

export const reports: Record<string, ReportConfig> = {
  // CLIENT DETAILS REPORTS
  'client-details-all-clients': {
    id: 'client-details-all-clients',
    title: 'All Clients',
    category: 'CLIENT DETAILS',
    categoryPath: 'client-details',
    reportPath: 'all-clients',
    model: 'client',
    include: { city: true, createdBy: true, _count: { select: { printers: true } } },
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group name' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'companyName', width: 30 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'City', key: 'city.name', width: 20 },
      { header: 'Pincode', key: 'pincode', width: 15 },
      { header: 'Contact Person', key: 'contactPerson', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Total Printers', key: '_count.printers', width: 15 },
      { header: 'Created By', key: 'createdBy.username', width: 20 }
    ],
    exportFileName: 'All_Clients'
  },

  'client-details-present-clients': {
    id: 'client-details-present-clients',
    title: 'Present Clients',
    category: 'CLIENT DETAILS',
    categoryPath: 'client-details',
    reportPath: 'present-clients',
    model: 'client',
    include: { city: true },
    fixedValues: { isActive: true },
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group name' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'companyName', width: 30 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'City', key: 'city.name', width: 20 },
      { header: 'Pincode', key: 'pincode', width: 15 },
      { header: 'Contact Person', key: 'contactPerson', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 30 }
    ],
    exportFileName: 'Present_Clients'
  },

  'client-details-payments': {
    id: 'client-details-payments',
    title: 'Payments',
    category: 'CLIENT DETAILS',
    categoryPath: 'client-details',
    reportPath: 'payments',
    model: 'payment',
    include: { client: true },
    dateField: 'paymentDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group name' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'paymentDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Payment Mode', key: 'paymentMethod', width: 20 },
      { header: 'Cheque No', key: 'chequeNumber', width: 20 },
      { header: 'Bank', key: 'bankName', width: 25 },
      { header: 'Remarks', key: 'notes', width: 40 }
    ],
    exportFileName: 'Payments'
  },

  'client-details-cr-dr': {
    id: 'client-details-cr-dr',
    title: 'CR/DR',
    category: 'CLIENT DETAILS',
    categoryPath: 'client-details',
    reportPath: 'cr-dr',
    model: 'payment',
    include: { client: true },
    dateField: 'paymentDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group name' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SRNO', key: 'id', width: 10 },
      { header: 'Date', key: 'paymentDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Cheque Date', key: 'chequeDate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Cheque', key: 'chequeNumber', width: 20 },
      { header: 'Bank', key: 'bankName', width: 25 },
      { header: 'Mode of Payment', key: 'paymentMethod', width: 20 },
      { header: 'Remarks', key: 'notes', width: 40 }
    ],
    exportFileName: 'CR_DR'
  },

  // EMPLOYEE DETAILS REPORT
  'employee-details': {
    id: 'employee-details',
    title: 'Employee Details',
    category: 'EMPLOYEE DETAILS',
    categoryPath: 'employee-details',
    reportPath: '',
    model: 'user',
    filters: [
      {
        type: 'dropdown',
        name: 'role',
        label: 'Role',
        options: ['SELECT', 'ALL', 'ADMIN', 'MANAGER', 'EMPLOYEE']
      }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Username', key: 'username', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Active', key: 'isActive', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ],
    exportFileName: 'Employee_Details'
  },

  // PURCHASE DETAILS REPORTS
  'purchase-details-all': {
    id: 'purchase-details-all',
    title: 'All Purchases',
    category: 'PURCHASE DETAILS',
    categoryPath: 'purchase-details',
    reportPath: 'all',
    model: 'order',
    filters: [
      { type: 'autocomplete', name: 'supplier', label: 'Supplier', placeholder: 'Search supplier' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Supplier', key: 'supplierName', width: 30 },
      { header: 'Item', key: 'itemName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Invoice No', key: 'invoiceNo', width: 20 }
    ],
    exportFileName: 'All_Purchases'
  },

  'purchase-details-printers': {
    id: 'purchase-details-printers',
    title: 'Printer Purchases',
    category: 'PURCHASE DETAILS',
    categoryPath: 'purchase-details',
    reportPath: 'printers',
    model: 'printer',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Purchased Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Printer Model', key: 'printerModel', width: 30 },
      { header: 'Supplier', key: 'supplierName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 }
    ],
    exportFileName: 'Printer_Purchases'
  },

  'purchase-details-printer-parts': {
    id: 'purchase-details-printer-parts',
    title: 'Printer Parts',
    category: 'PURCHASE DETAILS',
    categoryPath: 'purchase-details',
    reportPath: 'printer-parts',
    model: 'printerPartPurchase',
    filters: [
      { type: 'autocomplete', name: 'supplier', label: 'Supplier', placeholder: 'Search supplier' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Part Name', key: 'partName', width: 30 },
      { header: 'Supplier', key: 'supplierName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 }
    ],
    exportFileName: 'Printer_Parts'
  },

  // DISPATCH DETAILS REPORTS
  'dispatch-details-client': {
    id: 'dispatch-details-client',
    title: 'Client Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'client',
    model: 'dispatch',
    include: { client: { include: { city: true } }, dispatchItems: { include: { cartridge: { include: { model: true } } } } },
    dateField: 'dispatchDate',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'autocomplete', name: 'city', label: 'City', placeholder: 'Search city' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'dispatchDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'City', key: 'client.city.name', width: 20 },
      { header: 'Cartridge', key: 'dispatchItems.0.cartridge.model.modelName', width: 25 },
      { header: 'Dispatch No', key: 'dispatchNumber', width: 20 }
    ],
    exportFileName: 'Client_Wise_Dispatch'
  },

  'dispatch-details-franchise': {
    id: 'dispatch-details-franchise',
    title: 'Franchise Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'franchise',
    model: 'dispatch',
    include: { client: true, dispatchItems: { include: { cartridge: { include: { model: true } } } } },
    filters: [
      { type: 'autocomplete', name: 'franchise', label: 'Franchise Name', placeholder: 'Search franchise' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'dispatchDate', width: 15 },
      { header: 'Franchise Name', key: 'client.companyName', width: 30 },
      { header: 'Cartridge', key: 'dispatchItems.0.cartridge.model.modelName', width: 25 },
      { header: 'Dispatch No', key: 'dispatchNumber', width: 20 }
    ],
    exportFileName: 'Franchise_Wise_Dispatch'
  },

  'dispatch-details-cartridge': {
    id: 'dispatch-details-cartridge',
    title: 'Cartridge Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'cartridge',
    model: 'dispatch',
    filters: [
      { type: 'autocomplete', name: 'franchise', label: 'Franchise', placeholder: 'Search franchise' },
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Model', placeholder: 'Search cartridge' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Franchise', key: 'franchiseName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 }
    ],
    exportFileName: 'Cartridge_Wise_Dispatch'
  },

  'dispatch-details-month-wise': {
    id: 'dispatch-details-month-wise',
    title: 'Month Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'month-wise',
    model: 'dispatch',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Model', placeholder: 'Search cartridge' },
      { type: 'autocomplete', name: 'city', label: 'City', placeholder: 'Search city' },
      { type: 'text', name: 'branch', label: 'Branch', placeholder: 'Enter branch' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'Client', key: 'clientName', width: 30 },
      { header: 'Jan', key: 'jan', width: 12 },
      { header: 'Feb', key: 'feb', width: 12 },
      { header: 'Mar', key: 'mar', width: 12 },
      { header: 'Apr', key: 'apr', width: 12 },
      { header: 'May', key: 'may', width: 12 },
      { header: 'Jun', key: 'jun', width: 12 },
      { header: 'Jul', key: 'jul', width: 12 },
      { header: 'Aug', key: 'aug', width: 12 },
      { header: 'Sep', key: 'sep', width: 12 },
      { header: 'Oct', key: 'oct', width: 12 },
      { header: 'Nov', key: 'nov', width: 12 },
      { header: 'Dec', key: 'dec', width: 12 }
    ],
    exportFileName: 'Month_Wise_Dispatch'
  },

  'dispatch-details-boy-wise': {
    id: 'dispatch-details-boy-wise',
    title: 'Boy Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'boy-wise',
    model: 'dispatch',
    include: { client: true, dispatchItems: { include: { cartridge: { include: { model: true } } } } },
    dateField: 'dispatchDate',
    filters: [
      { type: 'text', name: 'boy', label: 'Boy Name', placeholder: 'Enter boy name' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'dispatchDate', width: 15 },
      { header: 'Boy Name', key: 'deliveryBoy', width: 25 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Cartridge', key: 'dispatchItems.0.cartridge.model.modelName', width: 25 },
      { header: 'Dispatch No', key: 'dispatchNumber', width: 20 }
    ],
    exportFileName: 'Boy_Wise_Dispatch'
  },

  'dispatch-details-challan-wise': {
    id: 'dispatch-details-challan-wise',
    title: 'Challan Wise Dispatch',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'challan-wise',
    model: 'dispatch',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Challan No', key: 'challanNo', width: 20 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Items', key: 'items', width: 40 },
      { header: 'Total Qty', key: 'totalQty', width: 15 }
    ],
    exportFileName: 'Challan_Wise_Dispatch'
  },

  'dispatch-details-order-bill': {
    id: 'dispatch-details-order-bill',
    title: 'Order-Bill Details',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'order-bill',
    model: 'bill',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Order No', key: 'orderNo', width: 20 },
      { header: 'Bill No', key: 'billNo', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 }
    ],
    exportFileName: 'Order_Bill_Details'
  },

  'dispatch-details-courier': {
    id: 'dispatch-details-courier',
    title: 'Courier Details',
    category: 'DISPATCH DETAILS',
    categoryPath: 'dispatch-details',
    reportPath: 'courier-details',
    model: 'dispatch',
    include: { client: true, dispatchItems: { include: { cartridge: { include: { model: true } } } } },
    dateField: 'dispatchDate',
    filters: [
      { type: 'autocomplete', name: 'courier', label: 'Courier Company', placeholder: 'Search courier' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'dispatchDate', width: 15 },
      { header: 'Courier', key: 'courierCompany', width: 30 },
      { header: 'Tracking No', key: 'trackingNumber', width: 25 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Dispatch No', key: 'dispatchNumber', width: 20 }
    ],
    exportFileName: 'Courier_Details'
  },

  // EMPTY DETAILS REPORTS
  'empty-details-client-wise': {
    id: 'empty-details-client-wise',
    title: 'Client Wise Empty',
    category: 'EMPTY DETAILS',
    categoryPath: 'empty-details',
    reportPath: 'client-wise',
    model: 'client',
    include: { dispatches: { include: { dispatchItems: { include: { cartridge: { include: { model: true } } } } } } },
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'companyName', width: 30 },
      { header: 'Location', key: 'address', width: 25 }
    ],
    exportFileName: 'Client_Wise_Empty'
  },

  'empty-details-cart-wise': {
    id: 'empty-details-cart-wise',
    title: 'Cart Wise Empty',
    category: 'EMPTY DETAILS',
    categoryPath: 'empty-details',
    reportPath: 'cart-wise',
    model: 'cartridgeModel',
    include: { cartridges: { where: { condition: 'EMPTY' } } },
    filters: [
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Model', placeholder: 'Search cartridge' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Cartridge Model', key: 'modelName', width: 25 },
      { header: 'Total Empty', key: 'cartridges.length', width: 15 }
    ],
    exportFileName: 'Cart_Wise_Empty'
  },

  'empty-details-replacements': {
    id: 'empty-details-replacements',
    title: 'Replacements',
    category: 'EMPTY DETAILS',
    categoryPath: 'empty-details',
    reportPath: 'replacements',
    model: 'replacement',
    include: { client: true },
    dateField: 'replacementDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'replacementDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Reason', key: 'reason', width: 40 },
      { header: 'Technician', key: 'technicianName', width: 25 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    exportFileName: 'Replacements'
  },

  // SALES MIS REPORTS
  'sales-mis-monthly-sales': {
    id: 'sales-mis-monthly-sales',
    title: 'Monthly Sales',
    category: 'SALES MIS',
    categoryPath: 'sales-mis',
    reportPath: 'monthly-sales',
    model: 'bill',
    include: { client: { include: { city: true } } },
    dateField: 'billDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'autocomplete', name: 'city', label: 'City', placeholder: 'Search city' },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'billDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'City', key: 'client.city.name', width: 20 },
      { header: 'Sales Amount', key: 'totalAmount', width: 15 }
    ],
    exportFileName: 'Monthly_Sales'
  },

  'sales-mis-sales-register': {
    id: 'sales-mis-sales-register',
    title: 'Sales Register',
    category: 'SALES MIS',
    categoryPath: 'sales-mis',
    reportPath: 'sales-register',
    model: 'bill',
    include: { client: true },
    dateField: 'billDate',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'billDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Bill No', key: 'billNumber', width: 20 },
      { header: 'Amount', key: 'totalAmount', width: 15 }
    ],
    exportFileName: 'Sales_Register'
  },

  'sales-mis-bill-entries': {
    id: 'sales-mis-bill-entries',
    title: 'Bill Entries',
    category: 'SALES MIS',
    categoryPath: 'sales-mis',
    reportPath: 'bill-entries',
    model: 'bill',
    include: { client: true },
    dateField: 'billDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'billDate', width: 15 },
      { header: 'Bill No', key: 'billNumber', width: 20 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Amount', key: 'totalAmount', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    exportFileName: 'Bill_Entries'
  },

  'sales-mis-per-page': {
    id: 'sales-mis-per-page',
    title: 'Per Page MIS',
    category: 'SALES MIS',
    categoryPath: 'sales-mis',
    reportPath: 'per-page',
    model: 'bill',
    filters: [
      { type: 'text', name: 'vendor', label: 'Vendor Name', placeholder: 'Enter vendor name' },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Vendor', key: 'vendorName', width: 30 },
      { header: 'Total Pages', key: 'totalPages', width: 15 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 }
    ],
    exportFileName: 'Per_Page_MIS'
  },

  'sales-mis-collection': {
    id: 'sales-mis-collection',
    title: 'Collection',
    category: 'SALES MIS',
    categoryPath: 'sales-mis',
    reportPath: 'collection',
    model: 'payment',
    include: { client: true },
    dateField: 'paymentDate',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'dropdown', name: 'type', label: 'Collection Type', options: ['All', 'Cash', 'Cheque', 'Online'] },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'paymentDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Type', key: 'paymentMethod', width: 15 },
      { header: 'Reference', key: 'transactionId', width: 25 }
    ],
    exportFileName: 'Collection'
  },

  // COMPLAINT DETAILS REPORT
  'complaint-details': {
    id: 'complaint-details',
    title: 'Complaint Details',
    category: 'COMPLAINT DETAILS',
    categoryPath: 'complaint-details',
    reportPath: '',
    model: 'complaint',
    include: { client: true },
    dateField: 'reportedDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'monthyear', name: 'monthYear', label: 'Month/Year' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'reportedDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Complaint Type', key: 'category', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Details', key: 'description', width: 40 }
    ],
    exportFileName: 'Complaint_Details'
  },

  // ORDER DETAILS REPORT
  'order-details': {
    id: 'order-details',
    title: 'Order Details',
    category: 'ORDER DETAILS',
    categoryPath: 'order-details',
    reportPath: '',
    model: 'order',
    include: { client: true, orderItems: { include: { cartridgeModel: true } } },
    dateField: 'orderDate',
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Model', placeholder: 'Search cartridge' },
      { type: 'daterange', name: 'dateRange', label: 'Order Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Order Date', key: 'orderDate', width: 15 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Cartridge', key: 'orderItems.0.cartridgeModel.modelName', width: 25 },
      { header: 'Quantity', key: 'orderItems.0.quantity', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    exportFileName: 'Order_Details'
  },

  // ORDER COUNT REPORT
  'order-count': {
    id: 'order-count',
    title: 'Order Count',
    category: 'ORDER COUNT',
    categoryPath: 'order-count',
    reportPath: '',
    model: 'order',
    include: { createdBy: true },
    dateField: 'orderDate',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'Order No', key: 'orderNumber', width: 20 },
      { header: 'Date', key: 'orderDate', width: 15 },
      { header: 'User', key: 'createdBy.username', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Amount', key: 'totalAmount', width: 15 }
    ],
    exportFileName: 'Order_Count'
  },

  // FACTORY DETAILS REPORTS
  'factory-details-cartridge-stock': {
    id: 'factory-details-cartridge-stock',
    title: 'Cartridge Stock',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'cartridge-stock',
    model: 'cartridgeModel',
    include: { _count: { select: { cartridges: true } } },
    filters: [
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Model', placeholder: 'Search cartridge' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Cartridge Model', key: 'modelName', width: 30 },
      { header: 'In Stock', key: '_count.cartridges', width: 15 },
      { header: 'Status', key: 'isActive', width: 15 }
    ],
    exportFileName: 'Cartridge_Stock'
  },

  'factory-details-stock-by-workman': {
    id: 'factory-details-stock-by-workman',
    title: 'Stock by Workman',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'stock-by-workman',
    model: 'dispatch',
    include: { client: true, dispatchItems: { include: { cartridge: { include: { model: true } } } } },
    dateField: 'dispatchDate',
    filters: [
      { type: 'text', name: 'boy', label: 'Boy Name', placeholder: 'Enter boy name' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'dispatchDate', width: 15 },
      { header: 'Workman', key: 'deliveryBoy', width: 25 },
      { header: 'Client', key: 'client.companyName', width: 30 },
      { header: 'Cartridge', key: 'dispatchItems.0.cartridge.model.modelName', width: 25 }
    ],
    exportFileName: 'Stock_By_Workman'
  },

  'factory-details-productions': {
    id: 'factory-details-productions',
    title: 'Productions',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'productions',
    model: 'production',
    filters: [
      { type: 'autocomplete', name: 'cartridge', label: 'Cartridge Name', placeholder: 'Search cartridge' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Produced Qty', key: 'producedQty', width: 15 },
      { header: 'OK Qty', key: 'okQty', width: 15 },
      { header: 'Rejected Qty', key: 'rejectedQty', width: 15 }
    ],
    exportFileName: 'Productions'
  },

  'factory-details-rejections': {
    id: 'factory-details-rejections',
    title: 'Rejections',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'rejections',
    model: 'rejection',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Rejected Qty', key: 'rejectedQty', width: 15 },
      { header: 'Reason', key: 'reason', width: 40 }
    ],
    exportFileName: 'Rejections'
  },

  'factory-details-material-purchase': {
    id: 'factory-details-material-purchase',
    title: 'Material Purchase',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'material-purchase',
    model: 'materialPurchase',
    filters: [
      { type: 'text', name: 'material', label: 'Material Name', placeholder: 'Enter material name' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Material Name', key: 'materialName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 }
    ],
    exportFileName: 'Material_Purchase'
  },

  'factory-details-material-usage': {
    id: 'factory-details-material-usage',
    title: 'Material Usage',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'material-usage',
    model: 'materialUsage',
    filters: [
      { type: 'text', name: 'material', label: 'Material Name', placeholder: 'Enter material name' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Material Name', key: 'materialName', width: 30 },
      { header: 'Used Qty', key: 'usedQty', width: 15 },
      { header: 'Purpose', key: 'purpose', width: 40 }
    ],
    exportFileName: 'Material_Usage'
  },

  'factory-details-material-to-cartridge': {
    id: 'factory-details-material-to-cartridge',
    title: 'Material to Cartridge',
    category: 'FACTORY DETAILS',
    categoryPath: 'factory-details',
    reportPath: 'material-to-cartridge',
    model: 'materialToCartridge',
    filters: [
      { type: 'daterange', name: 'dateRange', label: 'Date Range' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Material Name', key: 'materialName', width: 30 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Quantity Used', key: 'quantityUsed', width: 15 }
    ],
    exportFileName: 'Material_To_Cartridge'
  },

  // PRINTER DETAILS REPORTS
  'printer-details-all-client': {
    id: 'printer-details-all-client',
    title: 'All Client Printers',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'all-client',
    model: 'clientPrinter',
    include: { client: true, printer: { include: { model: true } } },
    filters: [
      { type: 'text', name: 'group', label: 'Group', placeholder: 'Enter group' },
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'Printer Model', key: 'printer.model.modelName', width: 25 },
      { header: 'Serial No', key: 'printer.serialNumber', width: 20 },
      { header: 'Install Date', key: 'installDate', width: 15 }
    ],
    exportFileName: 'All_Client_Printers'
  },

  'printer-details-purchase': {
    id: 'printer-details-purchase',
    title: 'Printer Purchase Details',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'purchase',
    model: 'printer',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' },
      { type: 'text', name: 'vendor', label: 'Vendor Name', placeholder: 'Enter vendor name' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Purchase Date', key: 'purchaseDate', width: 15 },
      { header: 'Vendor', key: 'vendorName', width: 30 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Rate', key: 'rate', width: 15 }
    ],
    exportFileName: 'Printer_Purchase_Details'
  },

  'printer-details-outstation': {
    id: 'printer-details-outstation',
    title: 'Outstation Printers',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'outstation',
    model: 'clientPrinter',
    include: { client: { include: { city: true } }, printer: { include: { model: true } } },
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'client.companyName', width: 30 },
      { header: 'City', key: 'client.city.name', width: 20 },
      { header: 'Printer Model', key: 'printer.model.modelName', width: 25 },
      { header: 'Serial No', key: 'printer.serialNumber', width: 20 }
    ],
    exportFileName: 'Outstation_Printers'
  },

  'printer-details-local': {
    id: 'printer-details-local',
    title: 'Local Printers',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'local',
    model: 'clientPrinter',
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 }
    ],
    exportFileName: 'Local_Printers'
  },

  'printer-details-per-page': {
    id: 'printer-details-per-page',
    title: 'Per Page Printers',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'per-page',
    model: 'clientPrinter',
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Rate per Page', key: 'ratePerPage', width: 15 },
      { header: 'Total Pages', key: 'totalPages', width: 15 }
    ],
    exportFileName: 'Per_Page_Printers'
  },

  'printer-details-stock': {
    id: 'printer-details-stock',
    title: 'Printer Stock',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'stock',
    model: 'printer',
    include: { model: true },
    filters: [
      { type: 'autocomplete', name: 'printer', label: 'Printer Name', placeholder: 'Search printer' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'model.modelName', width: 30 },
      { header: 'Serial No', key: 'serialNumber', width: 20 },
      { header: 'Condition', key: 'condition', width: 15 },
      { header: 'Status', key: 'isActive', width: 15 }
    ],
    exportFileName: 'Printer_Stock'
  },

  'printer-details-all-printer': {
    id: 'printer-details-all-printer',
    title: 'All Printers',
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'all-printer',
    model: 'printer',
    include: { model: true },
    filters: [],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'model.modelName', width: 30 },
      { header: 'Brand', key: 'model.brand', width: 20 },
      { header: 'Serial No', key: 'serialNumber', width: 20 },
      { header: 'Status', key: 'isActive', width: 15 }
    ],
    exportFileName: 'All_Printers'
  },

  'printer-details-clients-printer': {
    id: 'printer-details-clients-printer',
    title: "Client's Printers",
    category: 'PRINTER DETAILS',
    categoryPath: 'printer-details',
    reportPath: 'clients-printer',
    model: 'clientPrinter',
    filters: [
      { type: 'autocomplete', name: 'client', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Serial No', key: 'serialNo', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    exportFileName: 'Clients_Printers'
  }
}

export default reports