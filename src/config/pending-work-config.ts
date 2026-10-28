// Location: src/config/pending-work-config.ts
// Configuration for Pending Work module

export const pendingWorkConfig = {
  // Sample partners data (for demonstration)
  samplePartners: [
    {
      id: 1,
      name: 'Bhavna Enterprises',
      contactPerson: 'Bhavna Shah',
      contactNumber: '9876543210',
      email: 'bhavna@enterprises.com',
      pendingCount: 5,
      totalWork: 12,
      completedWork: 7
    },
    {
      id: 2,
      name: 'Tech Solutions Pvt Ltd',
      contactPerson: 'Rajesh Kumar',
      contactNumber: '9123456789',
      email: 'rajesh@techsolutions.com',
      pendingCount: 3,
      totalWork: 8,
      completedWork: 5
    },
    {
      id: 3,
      name: 'Global Trading Co',
      contactPerson: 'Priya Patel',
      contactNumber: '9988776655',
      email: 'priya@globaltrading.com',
      pendingCount: 7,
      totalWork: 15,
      completedWork: 8
    },
    {
      id: 4,
      name: 'Prime Associates',
      contactPerson: 'Amit Sharma',
      contactNumber: '9876501234',
      email: 'amit@primeassociates.com',
      pendingCount: 2,
      totalWork: 10,
      completedWork: 8
    },
    {
      id: 5,
      name: 'Metro Services',
      contactPerson: 'Sneha Reddy',
      contactNumber: '9765432109',
      email: 'sneha@metroservices.com',
      pendingCount: 4,
      totalWork: 9,
      completedWork: 5
    }
  ],

  // Sample pending work items for each partner
  samplePendingWork: {
    1: [ // Bhavna Enterprises
      {
        id: 101,
        workType: 'Printer Installation',
        description: 'Install 5 HP LaserJet printers at Mumbai office',
        assignedDate: '2024-01-05',
        dueDate: '2024-01-15',
        status: 'PENDING',
        priority: 'HIGH'
      },
      {
        id: 102,
        workType: 'Cartridge Delivery',
        description: 'Deliver 50 cartridges to Pune branch',
        assignedDate: '2024-01-08',
        dueDate: '2024-01-12',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM'
      },
      {
        id: 103,
        workType: 'Maintenance Service',
        description: 'Quarterly maintenance for all printers',
        assignedDate: '2024-01-10',
        dueDate: '2024-01-20',
        status: 'PENDING',
        priority: 'LOW'
      },
      {
        id: 104,
        workType: 'Repair Work',
        description: 'Fix paper jam issue in Canon printer',
        assignedDate: '2024-01-11',
        dueDate: '2024-01-13',
        status: 'PENDING',
        priority: 'HIGH'
      },
      {
        id: 105,
        workType: 'Training Session',
        description: 'Conduct printer maintenance training for staff',
        assignedDate: '2024-01-09',
        dueDate: '2024-01-18',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM'
      }
    ],
    2: [ // Tech Solutions Pvt Ltd
      {
        id: 201,
        workType: 'Printer Installation',
        description: 'Install new Epson printers',
        assignedDate: '2024-01-07',
        dueDate: '2024-01-14',
        status: 'PENDING',
        priority: 'MEDIUM'
      },
      {
        id: 202,
        workType: 'Network Setup',
        description: 'Configure network printers',
        assignedDate: '2024-01-09',
        dueDate: '2024-01-16',
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      },
      {
        id: 203,
        workType: 'Cartridge Delivery',
        description: 'Deliver bulk cartridges',
        assignedDate: '2024-01-10',
        dueDate: '2024-01-17',
        status: 'PENDING',
        priority: 'MEDIUM'
      }
    ]
  },

  // Work status options
  statusOptions: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],

  // Priority options
  priorityOptions: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
}

export default pendingWorkConfig
