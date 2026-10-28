export const dispatchScreens: Record<string, any> = {
  'pending-dispatch': {
    id: 'pending-dispatch', title: 'Pending Dispatch', category: 'DISPATCH',
    description: 'Click order ID to view details - all buttons work as labeled',
    filters: [
      { type: 'text', name: 'orderId', label: 'Order ID', placeholder: 'Search order' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Order ID', key: 'orderId', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Order Date', key: 'orderDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Actions', key: 'actions', width: 20, type: 'button' }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'dispatchOrder'
  },
  'pending-delivery': {
    id: 'pending-delivery', title: 'Pending Delivery', category: 'DISPATCH',
    description: 'Click client to view deliveries - Update Details button opens form',
    filters: [
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30, type: 'link' },
      { header: 'Order Number', key: 'orderNumber', width: 15, type: 'link' },
      { header: 'Delivery Date', key: 'deliveryDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Actions', key: 'actions', width: 15, type: 'button' }
    ],
    actions: [
      { label: 'Update Details', type: 'button', action: 'updateForm' },
      { label: 'Refresh', type: 'button', action: 'refresh' }
    ],
    pagination: true,
    model: 'deliveryOrder'
  },
  'hard-copy': {
    id: 'hard-copy', title: 'Hard Copy', category: 'DISPATCH',
    description: 'Click order number to view signed, stamped invoice document',
    filters: [
      { type: 'text', name: 'orderNumber', label: 'Order Number', placeholder: 'Search order' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Order Number', key: 'orderNumber', width: 20, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Document', key: 'document', width: 15, type: 'button' }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'hardCopy'
  },
  'order-query': {
    id: 'order-query', title: 'Order Query', category: 'DISPATCH',
    description: 'Click Scan to view invoice - Upload option available - Click order for details',
    filters: [
      { type: 'text', name: 'orderNumber', label: 'Order Number', placeholder: 'Search order' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Order Number', key: 'orderNumber', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Scan', key: 'scan', width: 15, type: 'button' },
      { header: 'Upload', key: 'upload', width: 15, type: 'button' }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'orderQuery'
  },
  'empty-cartridge': {
    id: 'empty-cartridge', title: 'Empty Cartridge', category: 'DISPATCH',
    description: 'View empty cartridge information',
    filters: [
      { type: 'text', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Search model' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'emptyCartridge'
  },
  'empty-payment': {
    id: 'empty-payment', title: 'Empty Payment', category: 'DISPATCH',
    description: 'View empty payment information',
    filters: [
      { type: 'text', name: 'clientName', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'emptyPayment'
  },
  'pending-pod': {
    id: 'pending-pod', title: 'Pending POD', category: 'DISPATCH',
    description: 'View pending Proof of Delivery',
    filters: [
      { type: 'text', name: 'orderNumber', label: 'Order Number', placeholder: 'Search order' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Order Number', key: 'orderNumber', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Dispatch Date', key: 'dispatchDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'pendingPod'
  },
  'pod-details': {
    id: 'pod-details', title: 'POD Details', category: 'DISPATCH',
    description: 'Search by client & dates - View Details generates Excel with 20+ columns',
    filters: [
      { type: 'autocomplete', name: 'clientName', label: 'Client Name', placeholder: 'Search client', required: true },
      { type: 'daterange', name: 'dateRange', label: 'Date Range', required: true }
    ],
    columns: [],
    actions: [
      { label: 'View Details', type: 'button', action: 'exportExcel' }
    ],
    exportType: 'excel',
    model: 'podDetails'
  },
  'godowns-dispatch': {
    id: 'godowns-dispatch', title: 'Godowns - Dispatch', category: 'GODOWNS',
    description: 'Autocomplete godown & cartridge - Add to system & database - Submit shows details',
    filters: [
      { type: 'autocomplete', name: 'godownName', label: 'Godown Name', placeholder: 'Select from suggestions as you type', required: true },
      { type: 'autocomplete', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Select from suggestions as you type', required: true },
      { type: 'number', name: 'quantity', label: 'Quantity', placeholder: 'Enter quantity', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Godown', key: 'godownName', width: 25 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [
      { label: 'Add', type: 'button', action: 'add' },
      { label: 'Submit', type: 'button', action: 'submit' }
    ],
    pagination: true,
    model: 'godownDispatch'
  },
  'godowns-return': {
    id: 'godowns-return', title: 'Godowns - Return', category: 'GODOWNS',
    description: 'Autocomplete godown & cartridge - Add to system & database - Submit shows returns',
    filters: [
      { type: 'autocomplete', name: 'godownName', label: 'Godown Name', placeholder: 'Select from suggestions as you type', required: true },
      { type: 'autocomplete', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Select from suggestions as you type', required: true },
      { type: 'number', name: 'quantity', label: 'Quantity', placeholder: 'Enter quantity', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Godown', key: 'godownName', width: 25 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [
      { label: 'Add', type: 'button', action: 'add' },
      { label: 'Submit', type: 'button', action: 'submit' }
    ],
    pagination: true,
    model: 'godownReturn'
  },
  'godowns-view-stock': {
    id: 'godowns-view-stock', title: 'Godowns - View Stock', category: 'GODOWNS',
    description: 'View godown stock details',
    filters: [
      { type: 'autocomplete', name: 'godownName', label: 'Godown Name', placeholder: 'Search godown' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Last Updated', key: 'lastUpdated', width: 15 }
    ],
    actions: [
      { label: 'View Stock', type: 'button', action: 'viewStock' }
    ],
    pagination: true,
    model: 'godownStock'
  },
  'repair-pending': {
    id: 'repair-pending', title: 'Repair - Pending', category: 'REPAIR',
    description: 'Cancel cancels appointment - Dispatch sends person to resolve',
    filters: [
      { type: 'text', name: 'clientName', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Repair Type', key: 'repairType', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Cancel', key: 'cancel', width: 15, type: 'button' },
      { header: 'Dispatch', key: 'dispatch', width: 15, type: 'button' }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'repairPending'
  },
  'repair-done': {
    id: 'repair-done', title: 'Repair - Done', category: 'REPAIR',
    description: 'View Details shows repair details',
    filters: [
      { type: 'text', name: 'clientName', label: 'Client Name', placeholder: 'Search client' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Repair Type', key: 'repairType', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'View Details', key: 'viewDetails', width: 15, type: 'button' }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'repairDone'
  }
}
export default dispatchScreens
