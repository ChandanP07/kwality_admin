export const marketingScreens: Record<string, any> = {
  'pending': {
    id: 'pending', 
    title: 'Pending Marketing', 
    category: 'MARKETING',
    description: 'Click name to view details - Click contact number to update - Updates system & database',
    filters: [
      { type: 'text', name: 'name', label: 'Name', placeholder: 'Search name' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25, type: 'link' },
      { header: 'Contact No', key: 'contactNo', width: 15, type: 'link' },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'marketingLead',
    detailsView: true,
    statusOptions: ['Pending', 'Contacted', 'Quotation Sent', 'Follow Up', 'Closed', 'Rejected'],
    commitmentModels: ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'One Time'],
    cartridgeModels: [
      'HP 679 Black', 'HP 679 Color', 'Canon 810 XL', 'Canon 811 XL', 
      'Epson 003 Black', 'Epson 003 Color', 'Brother TN-2365', 'Samsung MLT-D101S'
    ]
  },
  'rates': {
    id: 'rates', 
    title: 'Marketing Rates', 
    category: 'MARKETING',
    description: 'View and manage marketing rates',
    filters: [
      { type: 'text', name: 'cartridgeModel', label: 'Cartridge Model', placeholder: 'Search model' }
    ],
    columns: [
      { header: 'SR', key: 'id', width: 10 },
      { header: 'Cartridge Model', key: 'cartridgeModel', width: 30 },
      { header: 'Rate', key: 'rate', width: 15 },
      { header: 'Commitment Type', key: 'commitmentType', width: 20 },
      { header: 'Last Updated', key: 'lastUpdated', width: 15 }
    ],
    actions: [{ label: 'Refresh', type: 'button', action: 'refresh' }],
    pagination: true,
    model: 'marketingRate'
  }
}
export default marketingScreens
