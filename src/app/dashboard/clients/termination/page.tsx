// src/app/dashboard/clients/termination/page.tsx
'use client'

import { useState } from 'react'
import { 
  UserX, 
  FileX, 
  Search, 
  FileText,
  AlertTriangle,
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react'

const terminationModules = [
  {
    id: 'new',
    title: 'New Termination',
    description: 'Initiate client termination process',
    icon: UserX,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'unsigned',
    title: 'Unsigned Terminations',
    description: 'View pending termination signatures',
    icon: FileX,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'unsigned-hdctil',
    title: 'Unsigned HDCTIL',
    description: 'HDCTIL pending signatures',
    icon: AlertTriangle,
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    id: 'search',
    title: 'Search Terminations',
    description: 'Find termination records',
    icon: Search,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'register',
    title: 'Register Termination',
    description: 'Complete termination registration',
    icon: FileText,
    color: 'bg-green-500 hover:bg-green-600'
  }
]

export default function TerminationPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null)

  const renderModule = () => {
    switch (activeModule) {
      case 'new':
        return <NewTerminationComponent />
      case 'unsigned':
        return <UnsignedTerminationsComponent />
      case 'unsigned-hdctil':
        return <UnsignedHDCTILComponent />
      case 'search':
        return <SearchTerminationsComponent />
      case 'register':
        return <RegisterTerminationComponent />
      default:
        return null
    }
  }

  if (activeModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {terminationModules.find(m => m.id === activeModule)?.title}
            </h1>
            <p className="text-gray-600">
              {terminationModules.find(m => m.id === activeModule)?.description}
            </p>
          </div>
          <button
            onClick={() => setActiveModule(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back to Termination Management
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderModule()}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Termination Management</h1>
        <p className="text-red-100">Process client terminations and manage documentation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Terminations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unsigned Documents</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <FileX className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
              <p className="text-2xl font-bold text-gray-900">₹45K</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terminationModules.map((module) => {
          const Icon = module.icon
          return (
            <div
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-red-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${module.color} transition-colors`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// New Termination Component
function NewTerminationComponent() {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    terminationDate: '',
    reason: '',
    noticeDate: '',
    noticePeriod: '30',
    finalBillAmount: '',
    outstandingAmount: '',
    securityDeposit: '',
    refundAmount: '',
    printerReturnDate: '',
    printerCondition: 'GOOD',
    remarks: ''
  })

  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/terminations/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Termination initiated successfully!')
        // Reset form
        setFormData({
          clientId: '',
          clientName: '',
          terminationDate: '',
          reason: '',
          noticeDate: '',
          noticePeriod: '30',
          finalBillAmount: '',
          outstandingAmount: '',
          securityDeposit: '',
          refundAmount: '',
          printerReturnDate: '',
          printerCondition: 'GOOD',
          remarks: ''
        })
      }
    } catch (error) {
      console.error('Error initiating termination:', error)
      alert('Failed to initiate termination')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
          <input
            type="text"
            placeholder="Search client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Termination Date *</label>
          <input
            type="date"
            required
            value={formData.terminationDate}
            onChange={(e) => setFormData({...formData, terminationDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notice Date</label>
          <input
            type="date"
            value={formData.noticeDate}
            onChange={(e) => setFormData({...formData, noticeDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Termination Reason *</label>
          <select
            required
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select reason...</option>
            <option value="CONTRACT_END">Contract End</option>
            <option value="NON_PAYMENT">Non-Payment</option>
            <option value="CLIENT_REQUEST">Client Request</option>
            <option value="SERVICE_ISSUE">Service Issues</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Amount (₹)</label>
          <input
            type="number"
            value={formData.outstandingAmount}
            onChange={(e) => setFormData({...formData, outstandingAmount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
          <input
            type="number"
            value={formData.securityDeposit}
            onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount (₹)</label>
          <input
            type="number"
            value={formData.refundAmount}
            onChange={(e) => setFormData({...formData, refundAmount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Printer Return Date</label>
          <input
            type="date"
            value={formData.printerReturnDate}
            onChange={(e) => setFormData({...formData, printerReturnDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Initiate Termination'}
        </button>
      </div>
    </form>
  )
}

// Unsigned Terminations Component
function UnsignedTerminationsComponent() {
  const [terminations, setTerminations] = useState([
    {
      id: '1',
      clientName: 'Tech Solutions Ltd',
      clientCode: 'CL001',
      terminationDate: '2024-01-15',
      reason: 'Contract End',
      status: 'PENDING_SIGNATURE'
    },
    {
      id: '2',
      clientName: 'Digital Services Inc',
      clientCode: 'CL002',
      terminationDate: '2024-01-10',
      reason: 'Client Request',
      status: 'PENDING_SIGNATURE'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Termination Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {terminations.map((termination) => (
              <tr key={termination.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{termination.clientName}</div>
                    <div className="text-sm text-gray-500">{termination.clientCode}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {termination.terminationDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {termination.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending Signature
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-red-600 hover:text-red-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Mark Signed</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Unsigned HDCTIL Component
function UnsignedHDCTILComponent() {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">HDCTIL Documents</h3>
      <p className="text-gray-500">Manage unsigned HDCTIL termination documents</p>
    </div>
  )
}

// Search Terminations Component
function SearchTerminationsComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    reason: ''
  })

  const handleSearch = async () => {
    // Search implementation
    const results = [
      {
        id: '1',
        clientName: 'Past Client Corp',
        terminationDate: '2023-12-01',
        reason: 'Contract End',
        status: 'COMPLETED'
      }
    ]
    setSearchResults(results)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by client name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="From Date"
        />
        
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Termination Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4">{result.clientName}</td>
                  <td className="px-6 py-4">{result.terminationDate}</td>
                  <td className="px-6 py-4">{result.reason}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Register Termination Component
function RegisterTerminationComponent() {
  const [formData, setFormData] = useState({
    terminationId: '',
    completionDate: '',
    finalSettlement: '',
    documentsReturned: false,
    printersReturned: false,
    refundProcessed: false,
    closureRemarks: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic
    alert('Termination registered successfully!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Termination ID *</label>
          <input
            type="text"
            required
            value={formData.terminationId}
            onChange={(e) => setFormData({...formData, terminationId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter termination ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date *</label>
          <input
            type="date"
            required
            value={formData.completionDate}
            onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Settlement (₹)</label>
          <input
            type="number"
            value={formData.finalSettlement}
            onChange={(e) => setFormData({...formData, finalSettlement: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.documentsReturned}
              onChange={(e) => setFormData({...formData, documentsReturned: e.target.checked})}
              className="mr-2"
            />
            <span>Documents Returned</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.printersReturned}
              onChange={(e) => setFormData({...formData, printersReturned: e.target.checked})}
              className="mr-2"
            />
            <span>Printers Returned</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.refundProcessed}
              onChange={(e) => setFormData({...formData, refundProcessed: e.target.checked})}
              className="mr-2"
            />
            <span>Refund Processed</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Closure Remarks</label>
          <textarea
            value={formData.closureRemarks}
            onChange={(e) => setFormData({...formData, closureRemarks: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Complete Registration
        </button>
      </div>
    </form>
  )
}