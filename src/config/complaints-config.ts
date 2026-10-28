export const complaintsScreens: Record<string, any> = {
  'pending': {
    id: 'pending', 
    title: 'Pending Complaints', 
    category: 'COMPLAINTS',
    description: 'Click engineer name to view their complaint details',
    filters: [
      { type: 'text', name: 'engineerName', label: 'Engineer Name', placeholder: 'Search engineer' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Engineer Name', key: 'engineerName', width: 30, type: 'link' },
      { header: 'Total Complaints', key: 'totalComplaints', width: 20 },
      { header: 'Pending', key: 'pending', width: 15 },
      { header: 'Last Update', key: 'lastUpdate', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'complaint'
  },
  'pending-bill': {
    id: 'pending-bill', 
    title: 'Pending Bill', 
    category: 'COMPLAINTS',
    description: 'Click complaint ID to view details',
    filters: [
      { type: 'text', name: 'complaintId', label: 'Complaint ID', placeholder: 'Search complaint ID' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Complaint ID', key: 'complaintId', width: 15, type: 'link' },
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Engineer', key: 'engineerName', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'complaintBill'
  },
  'complaint-query': {
    id: 'complaint-query', 
    title: 'Complaint Query', 
    category: 'COMPLAINTS',
    description: 'Search complaint number to get engineer details',
    filters: [
      { type: 'text', name: 'complaintNumber', label: 'Complaint Number', placeholder: 'e.g., S92765', required: true }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Complaint ID', key: 'complaintId', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Engineer Name', key: 'engineerName', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [{ label: 'Search', type: 'button', action: 'search' }],
    pagination: false,
    model: 'complaint'
  },
  'done': {
    id: 'done', 
    title: 'Done Complaints', 
    category: 'COMPLAINTS',
    description: 'Fill details and press View Complaints to see completed complaints',
    filters: [
      { type: 'text', name: 'clientName', label: 'Client Name', placeholder: 'Enter client name' },
      { type: 'text', name: 'engineerName', label: 'Engineer Name', placeholder: 'Enter engineer name' },
      { type: 'daterange', name: 'dateRange', label: 'Date Range' },
      { type: 'text', name: 'complaintId', label: 'Complaint ID', placeholder: 'Enter complaint ID' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Complaint ID', key: 'complaintId', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Engineer', key: 'engineerName', width: 20 },
      { header: 'Completed Date', key: 'completedDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ],
    actions: [{ label: 'View Complaints', type: 'button', action: 'viewComplaints' }],
    pagination: true,
    exportType: 'csv',
    model: 'complaintDone'
  }
}
export default complaintsScreens
