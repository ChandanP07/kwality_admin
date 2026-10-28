export const printerScreens: Record<string, any> = {
  'new-model': {
    id: 'new-model', title: 'New Printer Model', category: 'PRINTERS',
    description: 'Add new printer model - cartridge model has autocomplete with suggestions',
    filters: [
      { type: 'text', name: 'modelName', label: 'Model Name', placeholder: 'Enter model name', required: true },
      { type: 'dropdown', name: 'printerType', label: 'Printer Type', options: ['Inkjet', 'Laser', 'Dot Matrix', 'Thermal', 'LED', '3D Printer'], required: true },
      { type: 'dropdown', name: 'printColor', label: 'Print Color', options: ['Black & White', 'Color', 'Both'], required: true },
      { type: 'dropdown', name: 'printSize', label: 'Print Size', options: ['A4', 'A3', 'Letter', 'Legal', 'A5', 'Custom'], required: true },
      { type: 'dropdown', name: 'cartridgeType', label: 'Cartridge Type', options: ['Ink Cartridge', 'Toner Cartridge', 'Ribbon', 'Inkjet Tank'], required: true },
      { type: 'autocomplete', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Search and select from suggestions', required: true },
      { type: 'text', name: 'manufacturer', label: 'Manufacturer', placeholder: 'Enter manufacturer' }
    ],
    actions: [{ label: 'Add', type: 'button', action: 'add' }],
    model: 'printerModel'
  },
  'edit-model': {
    id: 'edit-model', title: 'Edit Printer Model', category: 'PRINTERS',
    description: 'Search model as you type and edit - updates whole system & database',
    filters: [
      { type: 'autocomplete', name: 'modelName', label: 'Search Model', placeholder: 'Type to search printer model', required: true },
      { type: 'dropdown', name: 'printerType', label: 'Printer Type', options: ['Inkjet', 'Laser', 'Dot Matrix', 'Thermal', 'LED', '3D Printer'] },
      { type: 'dropdown', name: 'printColor', label: 'Print Color', options: ['Black & White', 'Color', 'Both'] },
      { type: 'dropdown', name: 'printSize', label: 'Print Size', options: ['A4', 'A3', 'Letter', 'Legal', 'A5', 'Custom'] },
      { type: 'dropdown', name: 'cartridgeType', label: 'Cartridge Type', options: ['Ink Cartridge', 'Toner Cartridge', 'Ribbon', 'Inkjet Tank'] },
      { type: 'autocomplete', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Search cartridge' },
      { type: 'text', name: 'manufacturer', label: 'Manufacturer', placeholder: 'Manufacturer name' }
    ],
    actions: [
      { label: 'Edit Model', type: 'button', action: 'search' },
      { label: 'Update Changes', type: 'button', action: 'update' }
    ],
    model: 'printerModel'
  },
  'printer-purchase': {
    id: 'printer-purchase', title: 'Printer Purchase', category: 'PRINTERS',
    description: 'Add printer purchase - adds to system & database',
    filters: [
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Search model', required: true },
      { type: 'text', name: 'serialNumber', label: 'Serial Number', required: true },
      { type: 'text', name: 'vendor', label: 'Vendor Name', required: true },
      { type: 'number', name: 'purchasePrice', label: 'Purchase Price (₹)', required: true },
      { type: 'text', name: 'invoiceNumber', label: 'Invoice Number' },
      { type: 'text', name: 'warranty', label: 'Warranty Period' },
      { type: 'textarea', name: 'notes', label: 'Notes' }
    ],
    actions: [{ label: 'Add', type: 'button', action: 'add' }],
    model: 'printerPurchase'
  },
  'view-edit-printer': {
    id: 'view-edit-printer', title: 'View or Edit Printer', category: 'PRINTERS',
    description: 'Search by model & serial (autocomplete) - updates system & database (frontend & backend)',
    filters: [
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Type to search', required: true },
      { type: 'autocomplete', name: 'serialNumber', label: 'Serial Number', placeholder: 'Type to search', required: true },
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', placeholder: 'Search client' },
      { type: 'dropdown', name: 'status', label: 'Status', options: ['Active', 'Inactive', 'Under Maintenance', 'Retired', 'In Stock', 'Assigned', 'Faulty'], required: true },
      { type: 'text', name: 'location', label: 'Location' },
      { type: 'number', name: 'pageCount', label: 'Current Page Count' },
      { type: 'textarea', name: 'notes', label: 'Notes' }
    ],
    actions: [
      { label: 'Search Printer', type: 'button', action: 'search' },
      { label: 'Save Changes', type: 'button', action: 'save' }
    ],
    model: 'clientPrinter'
  },
  'printer-query': {
    id: 'printer-query', title: 'Printer Query', category: 'PRINTERS',
    description: 'Query printer details - blue color & underlined = hyperlinks',
    filters: [
      { type: 'autocomplete', name: 'printerModel', label: 'Select Printer Model', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Serial Number', key: 'serialNumber', width: 20, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 25, type: 'link' },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Status', key: 'status', width: 15, type: 'link' },
      { header: 'Page Count', key: 'pageCount', width: 15 },
      { header: 'Last Service', key: 'lastService', width: 15, type: 'link' }
    ],
    actions: [{ label: 'Search', type: 'button', action: 'query' }],
    pagination: true,
    exportType: 'csv',
    model: 'clientPrinter'
  },
  'edit-client-printer': {
    id: 'edit-client-printer', title: 'Edit Client Printer', category: 'PRINTERS',
    description: 'Autocomplete shows suggestions as you type - updates system & database',
    filters: [
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Search model', required: true },
      { type: 'autocomplete', name: 'serialNumber', label: 'Serial Number', placeholder: 'Search serial', required: true },
      { type: 'dropdown', name: 'status', label: 'Status', options: ['Active', 'Inactive', 'Under Maintenance', 'Retired'] },
      { type: 'text', name: 'location', label: 'Location' },
      { type: 'number', name: 'monthlyPageLimit', label: 'Monthly Page Limit' },
      { type: 'number', name: 'ratePerPage', label: 'Rate Per Page (₹)' },
      { type: 'textarea', name: 'notes', label: 'Notes' }
    ],
    actions: [
      { label: 'Update Details', type: 'button', action: 'load' },
      { label: 'Update', type: 'button', action: 'update' }
    ],
    model: 'clientPrinter'
  },
  'stock': {
    id: 'stock', title: 'Printer Stock', category: 'PRINTERS',
    description: 'Search model & refresh - click printer model name to see table',
    filters: [
      { type: 'autocomplete', name: 'printerModel', label: 'Select Model', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Serial Number', key: 'serialNumber', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Purchase Date', key: 'purchaseDate', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'printerStock'
  },
  'request-add': {
    id: 'request-add', title: 'Add Printer Request', category: 'PRINTER REQUEST',
    description: 'Autocomplete suggestions - adds to system & database',
    filters: [
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Search model', required: true },
      { type: 'number', name: 'quantity', label: 'Quantity', required: true },
      { type: 'text', name: 'requestedBy', label: 'Requested By' },
      { type: 'textarea', name: 'remarks', label: 'Remarks' }
    ],
    actions: [{ label: 'Add', type: 'button', action: 'add' }],
    model: 'printerRequest'
  },
  'request-view': {
    id: 'request-view', title: 'Printer Request', category: 'PRINTER REQUEST',
    description: 'Enter client & refresh - shows pending requests',
    filters: [
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Request Date', key: 'requestDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'printerRequest'
  },
  'vendor-add': {
    id: 'vendor-add', title: 'Add Vendor Printer', category: 'VENDOR PRINTER',
    description: 'Autocomplete suggestions - adds to system & database',
    filters: [
      { type: 'autocomplete', name: 'vendorName', label: 'Vendor Name', placeholder: 'Search vendor', required: true },
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Search model', required: true },
      { type: 'text', name: 'contactPerson', label: 'Contact Person' },
      { type: 'text', name: 'contactNumber', label: 'Contact Number' },
      { type: 'text', name: 'email', label: 'Email' },
      { type: 'number', name: 'pricePerUnit', label: 'Price Per Unit (₹)' },
      { type: 'textarea', name: 'notes', label: 'Notes' }
    ],
    actions: [{ label: 'Add Vendor Printer', type: 'button', action: 'add' }],
    model: 'vendorPrinter'
  },
  'vendor-update': {
    id: 'vendor-update', title: 'Update Vendor Printer', category: 'VENDOR PRINTER',
    description: 'Search vendor/client - click Update hyperlink - OK/Add Mapping buttons',
    filters: [
      { type: 'autocomplete', name: 'vendorName', label: 'Search Vendor or Client', placeholder: 'Type to search', required: true },
      { type: 'autocomplete', name: 'printerModel', label: 'Printer Model', placeholder: 'Search model' },
      { type: 'text', name: 'contactPerson', label: 'Contact Person' },
      { type: 'text', name: 'contactNumber', label: 'Contact Number' },
      { type: 'number', name: 'pricePerUnit', label: 'Price Per Unit (₹)' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Vendor Name', key: 'vendorName', width: 25 },
      { header: 'Printer Model', key: 'printerModel', width: 25 },
      { header: 'Contact', key: 'contactPerson', width: 20 },
      { header: 'Update', key: 'update', width: 15, type: 'link' }
    ],
    actions: [
      { label: 'OK', type: 'button', action: 'update' },
      { label: 'Add Mapping', type: 'button', action: 'addMapping' }
    ],
    pagination: true,
    model: 'vendorPrinter'
  }
}
export default printerScreens
