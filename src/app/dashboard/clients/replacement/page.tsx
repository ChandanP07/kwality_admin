// app/dashboard/clients/replacement/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  RotateCcw,
  Search,
  CheckCircle,
  ArrowLeft,
  Calendar,
  User,
  Printer
} from 'lucide-react'
import Link from 'next/link'

const replacementSubModules = [
  { 
    id: 'search-replacement', 
    title: 'Search', 
    icon: Search, 
    description: 'Search and view printer replacement records',
    color: 'bg-blue-500'
  },
  { 
    id: 'register-replacement', 
    title: 'Register', 
    icon: CheckCircle, 
    description: 'Register new printer replacements',
    color: 'bg-green-500'
  }
]

export default function ReplacementPage() {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null)
  const [replacements, setReplacements] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    fetchReplacements()
    fetchClients()
  }, [])

  const fetchReplacements = async () => {
    // Mock data for replacements
    const mockReplacements = [
      { 
        id: '1', 
        client: 'Tech Solutions Pvt Ltd', 
        oldPrinter: 'HP-001', 
        newPrinter: 'HP-005', 
        date: '2024-01-10', 
        status: 'COMPLETED',
        reason: 'Hardware failure',
        technician: 'John Doe'
      },
      { 
        id: '2', 
        client: 'Digital Agency', 
        oldPrinter: 'CN-002', 
        newPrinter: 'CN-006', 
        date: '2024-01-15', 
        status: 'PENDING',
        reason: 'Upgrade request',
        technician: 'Jane Smith'
      },
      { 
        id: '3', 
        client: 'Manufacturing Corp', 
        oldPrinter: 'EP-003', 
        newPrinter: 'EP-007', 
        date: '2024-01-20', 
        status: 'IN_PROGRESS',
        reason: 'Maintenance replacement',
        technician: 'Mike Johnson'
      }
    ]
    setReplacements(mockReplacements)
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  if (activeSubModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveSubModule(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {replacementSubModules.find(sm => sm.id === activeSubModule)?.title}
              </h1>
              <p className="text-gray-600">
                Replacement › {replacementSubModules.find(sm => sm.id === activeSubModule)?.title}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderSubModule(activeSubModule, replacements, clients, () => fetchReplacements())}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link 
            href="/dashboard/clients"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Replacement Management</h1>
            <p className="text-gray-600">Handle printer and service replacements</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Replacements</p>
              <p className="text-2xl font-bold text-gray-900">{replacements.length}</p>
              <p className="text-xs text-blue-600">All time</p>
            </div>
            <RotateCcw className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {replacements.filter(r => r.status === 'COMPLETED').length}
              </p>
              <p className="text-xs text-green-600">Successfully done</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {replacements.filter(r => r.status === 'IN_PROGRESS').length}
              </p>
              <p className="text-xs text-blue-600">Currently active</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {replacements.filter(r => r.status === 'PENDING').length}
              </p>
              <p className="text-xs text-orange-600">Awaiting action</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {replacementSubModules.map((subModule) => {
          const Icon = subModule.icon
          return (
            <div
              key={subModule.id}
              onClick={() => setActiveSubModule(subModule.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-yellow-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${subModule.color} transition-colors`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {subModule.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {subModule.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <span className="text-yellow-600 text-sm font-medium">
                  Open Module →
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Replacements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Replacements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Old Printer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">New Printer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {replacements.slice(0, 5).map((replacement) => (
                <tr key={replacement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.client}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.oldPrinter}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.newPrinter}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      replacement.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      replacement.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {replacement.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.technician}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function renderSubModule(moduleId: string, replacements: any[], clients: any[], onSuccess: () => void) {
  switch (moduleId) {
    case 'search-replacement':
      return <SearchReplacementComponent replacements={replacements} />
    case 'register-replacement':
      return <RegisterReplacementComponent clients={clients} onSuccess={onSuccess} />
    default:
      return <div>Module not found</div>
  }
}

// SEARCH REPLACEMENT COMPONENT
function SearchReplacementComponent({ replacements }: { replacements: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('client')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredReplacements = replacements.filter(replacement => {
    const matchesSearch = (() => {
      const searchValue = searchTerm.toLowerCase()
      switch (searchBy) {
        case 'client':
          return replacement.client.toLowerCase().includes(searchValue)
        case 'printer':
          return replacement.oldPrinter.toLowerCase().includes(searchValue) || 
                 replacement.newPrinter.toLowerCase().includes(searchValue)
        case 'technician':
          return replacement.technician.toLowerCase().includes(searchValue)
        default:
          return true
      }
    })()

    const matchesStatus = statusFilter === 'ALL' || replacement.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Search Replacement</h3>
        <p className="text-blue-700">Search and view printer replacement records by various criteria.</p>
      </div>

      {/* Search Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="client">Search by Client</option>
            <option value="printer">Search by Printer Serial</option>
            <option value="technician">Search by Technician</option>
          </select>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${searchBy} to search...`}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            Search Results ({filteredReplacements.length} replacements found)
          </h4>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Old Printer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Printer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReplacements.map((replacement) => (
              <tr key={replacement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{replacement.client}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Printer className="h-4 w-4 text-red-400 mr-2" />
                    <span className="text-sm text-gray-900">{replacement.oldPrinter}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Printer className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-sm text-gray-900">{replacement.newPrinter}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{replacement.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    replacement.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    replacement.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {replacement.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{replacement.reason}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{replacement.technician}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredReplacements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No replacements found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// REGISTER REPLACEMENT COMPONENT
function RegisterReplacementComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    clientId: '',
    oldPrinterId: '',
    newPrinterId: '',
    replacementDate: '',
    reason: '',
    technicianName: '',
    notes: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const availablePrinters = [
    { id: '1', model: 'HP LaserJet Pro M404n', serialNumber: 'HP001234' },
    { id: '2', model: 'Canon PIXMA G2020', serialNumber: 'CN005678' },
    { id: '3', model: 'Epson EcoTank L3250', serialNumber: 'EP009012' },
    { id: '4', model: 'HP LaserJet Pro M405n', serialNumber: 'HP005679' },
    { id: '5', model: 'Canon PIXMA G3020', serialNumber: 'CN009123' }
  ]

  const replacementReasons = [
    'Hardware failure',
    'Upgrade request',
    'Maintenance replacement',
    'End of lease',
    'Damage repair',
    'Performance issues',
    'Client request',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/replacements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          replacementDate: new Date(formData.replacementDate)
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Replacement registered successfully!' })
        setFormData({
          clientId: '',
          oldPrinterId: '',
          newPrinterId: '',
          replacementDate: '',
          reason: '',
          technicianName: '',
          notes: ''
        })
        setSelectedClient(null)
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to register replacement' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-green-900 mb-2">Register Replacement</h3>
        <p className="text-green-700">Register a new printer replacement for a client.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Select Client</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search client..."
          />
          
          {searchTerm && !selectedClient && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {clients
                .filter(client => client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client)
                      setFormData({ ...formData, clientId: client.id })
                      setSearchTerm(client.companyName)
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                  >
                    <div className="font-medium">{client.companyName}</div>
                    <div className="text-sm text-gray-500">{client.contactPerson}</div>
                  </div>
                ))}
            </div>
          )}

          {selectedClient && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">{selectedClient.companyName}</div>
              <div className="text-sm text-blue-700">{selectedClient.contactPerson}</div>
            </div>
          )}
        </div>

        {/* Replacement Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Replacement Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Printer *</label>
              <select
                required
                value={formData.oldPrinterId}
                onChange={(e) => setFormData({ ...formData, oldPrinterId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select old printer</option>
                {availablePrinters.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {printer.model} - {printer.serialNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Printer *</label>
              <select
                required
                value={formData.newPrinterId}
                onChange={(e) => setFormData({ ...formData, newPrinterId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select new printer</option>
                {availablePrinters.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {printer.model} - {printer.serialNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Date *</label>
              <input
                type="date"
                required
                value={formData.replacementDate}
                onChange={(e) => setFormData({ ...formData, replacementDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select reason</option>
                {replacementReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technician Name *</label>
              <input
                type="text"
                required
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter technician name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                clientId: '',
                oldPrinterId: '',
                newPrinterId: '',
                replacementDate: '',
                reason: '',
                technicianName: '',
                notes: ''
              })
              setSelectedClient(null)
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedClient}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Replacement'}
          </button>
        </div>
      </form>
    </div>
  )
}