// app/dashboard/clients/agreement/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  FileText,
  Printer, 
  Plus, 
  Clock, 
  AlertCircle, 
  Edit3,
  Search,
  CheckCircle,
  Settings,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

// Types
interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  clientCode: string;
  email?: string;
  phone?: string;
}

interface Agreement {
  id: string;
  agreementNumber: string;
  clientId: string;
  clientName: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'SIGNED' | 'PENDING_DC';
  agreementType: 'RENTAL' | 'PER_PAGE' | 'AMC' | 'LEASE';
  startDate: string;
  endDate: string;
  monthlyRental?: number;
  perPageRate?: number;
  securityDeposit?: number;
  terms?: string;
}

interface Printer {
  id: string;
  model: string;
  serialNumber: string;
  status: 'AVAILABLE' | 'ALLOTTED' | 'MAINTENANCE';
}

interface SubModule {
  id: string;
  title: string;
  icon: any;
  description: string;
  color: string;
}

const agreementSubModules: SubModule[] = [
  { 
    id: 'allot-printer', 
    title: 'Allot Printer', 
    icon: Printer, 
    description: 'Assign printers to clients for service agreements',
    color: 'bg-green-500'
  },
  { 
    id: 'new-agreement', 
    title: 'New', 
    icon: Plus, 
    description: 'Create new service agreements or contracts',
    color: 'bg-blue-500'
  },
  { 
    id: 'unsigned', 
    title: 'Unsigned', 
    icon: Clock, 
    description: 'View agreements pending client signature',
    color: 'bg-yellow-500'
  },
  { 
    id: 'pending-dc', 
    title: 'Pending DC', 
    icon: AlertCircle, 
    description: 'Manage pending delivery challans for agreements',
    color: 'bg-orange-500'
  },
  { 
    id: 'edit-agreement', 
    title: 'Edit', 
    icon: Edit3, 
    description: 'Edit existing agreements',
    color: 'bg-purple-500'
  },
  { 
    id: 'search-agreement', 
    title: 'Search', 
    icon: Search, 
    description: 'Search and find agreements by various criteria',
    color: 'bg-indigo-500'
  },
  { 
    id: 'register-agreement', 
    title: 'Register', 
    icon: CheckCircle, 
    description: 'Register signed agreements in the system',
    color: 'bg-emerald-500'
  },
  { 
    id: 'new-install', 
    title: 'New Install', 
    icon: Settings, 
    description: 'Process new printer installations',
    color: 'bg-teal-500'
  }
]

export default function AgreementPage() {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [printers, setPrinters] = useState<Printer[]>([])
  const [loading, setLoading] = useState({
    clients: false,
    agreements: false,
    printers: false
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
    fetchAgreements()
    fetchPrinters()
  }, [])

  const fetchClients = async () => {
    setLoading(prev => ({...prev, clients: true}))
    setError(null)
    try {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Failed to fetch clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      setError('Failed to load clients')
    } finally {
      setLoading(prev => ({...prev, clients: false}))
    }
  }

  const fetchAgreements = async () => {
    setLoading(prev => ({...prev, agreements: true}))
    setError(null)
    try {
      const response = await fetch('/api/agreements')
      if (!response.ok) throw new Error('Failed to fetch agreements')
      const data = await response.json()
      setAgreements(data)
    } catch (error) {
      console.error('Error fetching agreements:', error)
      setError('Failed to load agreements')
    } finally {
      setLoading(prev => ({...prev, agreements: false}))
    }
  }

  const fetchPrinters = async () => {
    setLoading(prev => ({...prev, printers: true}))
    setError(null)
    try {
      const response = await fetch('/api/printers')
      if (!response.ok) throw new Error('Failed to fetch printers')
      const data = await response.json()
      setPrinters(data)
    } catch (error) {
      console.error('Error fetching printers:', error)
      setError('Failed to load printers')
    } finally {
      setLoading(prev => ({...prev, printers: false}))
    }
  }

  const handleSuccess = () => {
    fetchAgreements()
    fetchClients()
    fetchPrinters()
  }

  if (activeSubModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveSubModule(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {agreementSubModules.find(sm => sm.id === activeSubModule)?.title}
              </h1>
              <p className="text-gray-600">
                Agreement › {agreementSubModules.find(sm => sm.id === activeSubModule)?.title}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderSubModule(activeSubModule, clients, agreements, printers, handleSuccess)}
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agreement Management</h1>
            <p className="text-gray-600">Manage client agreements and contracts</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agreements</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading.agreements ? '...' : agreements.length}
              </p>
              <p className="text-xs text-blue-600">All agreements</p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agreements</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading.agreements ? '...' : agreements.filter(a => a.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-green-600">Currently active</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unsigned</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading.agreements ? '...' : agreements.filter(a => a.status === 'DRAFT' || a.status === 'SENT').length}
              </p>
              <p className="text-xs text-yellow-600">Pending signature</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading.agreements ? '...' : agreements.filter(a => {
                  const endDate = new Date(a.endDate)
                  const thirtyDaysFromNow = new Date()
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                  return endDate <= thirtyDaysFromNow && endDate >= new Date()
                }).length}
              </p>
              <p className="text-xs text-red-600">Next 30 days</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agreementSubModules.map((subModule) => {
          const Icon = subModule.icon
          return (
            <div
              key={subModule.id}
              onClick={() => setActiveSubModule(subModule.id)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-full ${subModule.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900">{subModule.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">{subModule.description}</p>
              <div className="flex justify-end">
                <span className="text-orange-600 text-sm">Open →</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Agreements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Agreements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Agreement</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading.agreements ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading agreements...
                  </td>
                </tr>
              ) : agreements.slice(0, 5).map((agreement, index) => (
                <tr key={agreement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {agreement.agreementNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{agreement.clientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{agreement.agreementType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      agreement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      agreement.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      agreement.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {agreement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(agreement.startDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!loading.agreements && agreements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No agreements found. Create your first agreement using the options above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Render SubModule Function - FIXED VERSION
function renderSubModule(
  moduleId: string, 
  clients: Client[], 
  agreements: Agreement[], 
  printers: Printer[], 
  onSuccess: () => void
) {
  switch (moduleId) {
    case 'allot-printer':
      return <AllotPrinterComponent clients={clients} printers={printers} onSuccess={onSuccess} />
    case 'new-agreement':
      return <NewAgreementComponent clients={clients} onSuccess={onSuccess} />
    case 'unsigned':
      return <UnsignedAgreementComponent agreements={agreements} />
    case 'pending-dc':
      return <PendingDCComponent agreements={agreements} onSuccess={onSuccess} />
    case 'edit-agreement':
      return <EditAgreementComponent clients={clients} agreements={agreements} onSuccess={onSuccess} />
    case 'search-agreement':
      return <SearchAgreementComponent agreements={agreements} />
    case 'register-agreement':
      return <RegisterAgreementComponent clients={clients} printers={printers} onSuccess={onSuccess} />
    case 'new-install':
      return <NewInstallComponent clients={clients} printers={printers} onSuccess={onSuccess} />
    default:
      return <div>Module not found</div>
  }
}

// ALLOT PRINTER COMPONENT
function AllotPrinterComponent({ 
  clients, 
  printers, 
  onSuccess 
}: { 
  clients: Client[]; 
  printers: Printer[]; 
  onSuccess: () => void 
}) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    installDate: '',
    rentalType: 'MONTHLY_RENTAL',
    monthlyRental: '',
    perPageRate: '',
    initialPageCount: '0'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const availablePrinters = printers.filter(printer => printer.status === 'AVAILABLE')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !selectedPrinter) {
      setMessage({ type: 'error', text: 'Please select both client and printer' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/client-printers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          printerId: selectedPrinter,
          ...formData,
          installDate: new Date(formData.installDate),
          monthlyRental: formData.monthlyRental ? parseFloat(formData.monthlyRental) : null,
          perPageRate: formData.perPageRate ? parseFloat(formData.perPageRate) : null,
          initialPageCount: parseInt(formData.initialPageCount)
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Printer allotted successfully!' })
        setSelectedClient(null)
        setSelectedPrinter('')
        setSearchTerm('')
        setFormData({
          installDate: '',
          rentalType: 'MONTHLY_RENTAL',
          monthlyRental: '',
          perPageRate: '',
          initialPageCount: '0'
        })
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to allot printer' })
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
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-900 mb-2">Allot Printer</h3>
        <p className="text-green-700">Assign printers to clients for service agreements and rental contracts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
              {clients
                .filter(client => 
                  client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client)
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900">{selectedClient.companyName}</div>
              <div className="text-sm text-blue-700">{selectedClient.contactPerson}</div>
              <button
                onClick={() => {
                  setSelectedClient(null)
                  setSearchTerm('')
                }}
                className="text-xs text-red-600 mt-2"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Printer Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Select Printer</h4>
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Choose printer...</option>
            {availablePrinters.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.model} - {printer.serialNumber}
              </option>
            ))}
          </select>

          {selectedPrinter && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-700">Selected Printer:</div>
              <div className="font-medium text-green-900">
                {printers.find(p => p.id === selectedPrinter)?.model}
              </div>
              <div className="text-sm text-green-700">
                SN: {printers.find(p => p.id === selectedPrinter)?.serialNumber}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Allotment Details */}
      {selectedClient && selectedPrinter && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Printer Allotment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date *</label>
              <input
                type="date"
                required
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rental Type *</label>
              <select 
                value={formData.rentalType}
                onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="MONTHLY_RENTAL">Monthly Rental</option>
                <option value="PER_PAGE">Per Page</option>
                <option value="FIXED_RENTAL">Fixed Rental</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyRental}
                onChange={(e) => setFormData({ ...formData, monthlyRental: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter monthly rental"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Page Count</label>
              <input
                type="number"
                value={formData.initialPageCount}
                onChange={(e) => setFormData({ ...formData, initialPageCount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter initial page count"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Allotting Printer...' : 'Allot Printer'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// NEW AGREEMENT COMPONENT
function NewAgreementComponent({ 
  clients, 
  onSuccess 
}: { 
  clients: Client[]; 
  onSuccess: () => void 
}) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    agreementType: 'RENTAL',
    startDate: '',
    endDate: '',
    monthlyRental: '',
    perPageRate: '',
    securityDeposit: '',
    terms: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) {
      setMessage({ type: 'error', text: 'Please select a client' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          monthlyRental: formData.monthlyRental ? parseFloat(formData.monthlyRental) : null,
          perPageRate: formData.perPageRate ? parseFloat(formData.perPageRate) : null,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Agreement created successfully!' })
        setSelectedClient(null)
        setSearchTerm('')
        setFormData({
          agreementType: 'RENTAL',
          startDate: '',
          endDate: '',
          monthlyRental: '',
          perPageRate: '',
          securityDeposit: '',
          terms: ''
        })
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to create agreement' })
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
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">New Agreement</h3>
        <p className="text-blue-700">Create a new service agreement or contract with a client.</p>
      </div>

      {/* Client Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Select Client</h4>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search client..."
        />
        
        {searchTerm && !selectedClient && (
          <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
            {clients
              .filter(client => 
                client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((client) => (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client)
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
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900">{selectedClient.companyName}</div>
            <div className="text-sm text-blue-700">{selectedClient.contactPerson}</div>
            <button
              onClick={() => {
                setSelectedClient(null)
                setSearchTerm('')
              }}
              className="text-xs text-red-600 mt-2"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Agreement Form */}
      {selectedClient && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Agreement Details</h4>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Type *</label>
                <select
                  required
                  value={formData.agreementType}
                  onChange={(e) => setFormData({ ...formData, agreementType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="RENTAL">Rental</option>
                  <option value="PER_PAGE">Per Page</option>
                  <option value="AMC">AMC</option>
                  <option value="LEASE">Lease</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthlyRental}
                  onChange={(e) => setFormData({ ...formData, monthlyRental: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter monthly rental"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per Page Rate (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.perPageRate}
                  onChange={(e) => setFormData({ ...formData, perPageRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter per page rate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter security deposit"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter agreement terms and conditions"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedClient(null)
                  setSearchTerm('')
                  setFormData({
                    agreementType: 'RENTAL',
                    startDate: '',
                    endDate: '',
                    monthlyRental: '',
                    perPageRate: '',
                    securityDeposit: '',
                    terms: ''
                  })
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Creating Agreement...' : 'Create Agreement'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

// UNSIGNED AGREEMENTS COMPONENT
function UnsignedAgreementComponent({ agreements }: { agreements: Agreement[] }) {
  const unsignedAgreements = agreements.filter(agreement => 
    agreement.status === 'DRAFT' || agreement.status === 'SENT'
  )

  const handleSendReminder = async (agreementId: string) => {
    try {
      const response = await fetch(`/api/agreements/${agreementId}/reminder`, {
        method: 'POST'
      })
      if (response.ok) {
        alert('Reminder sent successfully!')
      }
    } catch (error) {
      console.error('Error sending reminder:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">Unsigned Agreements</h3>
        <p className="text-yellow-700">View and manage agreements that are pending client signature.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {unsignedAgreements.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.agreementNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.clientName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.agreementType}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {agreement.agreementType === 'RENTAL' || agreement.agreementType === 'LEASE' ? 
                    `₹${agreement.monthlyRental}/month` : 
                    agreement.agreementType === 'PER_PAGE' ? 
                    `₹${agreement.perPageRate}/page` : 
                    'Fixed'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(agreement.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                      View
                    </button>
                    <button 
                      onClick={() => handleSendReminder(agreement.id)}
                      className="text-green-600 hover:text-green-800 text-sm transition-colors"
                    >
                      Send Reminder
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {unsignedAgreements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No unsigned agreements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// PENDING DC COMPONENT
function PendingDCComponent({ 
  agreements, 
  onSuccess 
}: { 
  agreements: Agreement[]; 
  onSuccess: () => void 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null)
  const [dcDetails, setDcDetails] = useState({
    dcNumber: '',
    dcDate: '',
    deliveryDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pendingDCAgreements = agreements.filter(agreement => agreement.status === 'PENDING_DC')

  const handleUpdateDC = async (agreementId: string) => {
    if (!dcDetails.dcNumber || !dcDetails.dcDate) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/agreements/${agreementId}/dc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dcDetails)
      })

      if (response.ok) {
        onSuccess()
        setSelectedAgreement(null)
        setDcDetails({ dcNumber: '', dcDate: '', deliveryDate: '' })
        alert('DC details updated successfully!')
      } else {
        alert('Failed to update DC details')
      }
    } catch (error) {
      console.error('Error updating DC:', error)
      alert('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredAgreements = pendingDCAgreements.filter(agreement =>
    agreement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-medium text-orange-900 mb-2">Pending Delivery Challans</h3>
        <p className="text-orange-700">Manage pending delivery challans for agreements.</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by client or agreement number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <span className="text-sm text-gray-500">
          {filteredAgreements.length} pending DC(s)
        </span>
      </div>

      {/* Pending DC Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAgreements.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {agreement.agreementNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agreement.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(agreement.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending DC
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {selectedAgreement === agreement.id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="DC Number *"
                          value={dcDetails.dcNumber}
                          onChange={(e) => setDcDetails({...dcDetails, dcNumber: e.target.value})}
                          className="px-2 py-1 border rounded text-sm"
                          required
                        />
                        <input
                          type="date"
                          value={dcDetails.dcDate}
                          onChange={(e) => setDcDetails({...dcDetails, dcDate: e.target.value})}
                          className="px-2 py-1 border rounded text-sm"
                          required
                        />
                        <input
                          type="date"
                          value={dcDetails.deliveryDate}
                          onChange={(e) => setDcDetails({...dcDetails, deliveryDate: e.target.value})}
                          className="px-2 py-1 border rounded text-sm"
                          placeholder="Delivery Date"
                        />
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUpdateDC(agreement.id)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setSelectedAgreement(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAgreement(agreement.id)}
                      className="text-orange-600 hover:text-orange-900 transition-colors"
                    >
                      Update DC
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredAgreements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No pending delivery challans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// EDIT AGREEMENT COMPONENT
function EditAgreementComponent({ 
  clients, 
  agreements, 
  onSuccess 
}: { 
  clients: Client[]; 
  agreements: Agreement[]; 
  onSuccess: () => void 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Agreement[]>([])
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    agreementNumber: '',
    clientId: '',
    startDate: '',
    endDate: '',
    agreementType: '',
    monthlyRental: '',
    perPageRate: '',
    securityDeposit: '',
    terms: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchAgreements = async () => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      // Simulate API search
      const results = agreements.filter(agreement =>
        agreement.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching agreements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setFormData({
      agreementNumber: agreement.agreementNumber,
      clientId: agreement.clientId,
      startDate: agreement.startDate.split('T')[0],
      endDate: agreement.endDate.split('T')[0],
      agreementType: agreement.agreementType,
      monthlyRental: agreement.monthlyRental?.toString() || '',
      perPageRate: agreement.perPageRate?.toString() || '',
      securityDeposit: agreement.securityDeposit?.toString() || '',
      terms: agreement.terms || ''
    })
    setIsEditing(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAgreement) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/agreements/${selectedAgreement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyRental: formData.monthlyRental ? parseFloat(formData.monthlyRental) : null,
          perPageRate: formData.perPageRate ? parseFloat(formData.perPageRate) : null,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null
        })
      })

      if (response.ok) {
        alert('Agreement updated successfully!')
        setIsEditing(false)
        setSelectedAgreement(null)
        setSearchResults([])
        setSearchTerm('')
        onSuccess()
      } else {
        alert('Failed to update agreement')
      }
    } catch (error) {
      console.error('Error updating agreement:', error)
      alert('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-medium text-purple-900 mb-2">Edit Agreement</h3>
        <p className="text-purple-700">Edit existing agreements and update their details.</p>
      </div>

      {!isEditing ? (
        <>
          {/* Search Section */}
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter agreement number or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAgreements()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={searchAgreements}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{agreement.agreementNumber}</td>
                      <td className="px-6 py-4">{agreement.clientName}</td>
                      <td className="px-6 py-4">{new Date(agreement.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          agreement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          agreement.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          agreement.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {agreement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(agreement)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {searchTerm && searchResults.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No agreements found matching your search.
            </div>
          )}
        </>
      ) : (
        /* Edit Form */
        <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">
            Edit Agreement: {formData.agreementNumber}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Type</label>
              <select
                value={formData.agreementType}
                onChange={(e) => setFormData({...formData, agreementType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="RENTAL">Rental</option>
                <option value="PER_PAGE">Per Page</option>
                <option value="AMC">AMC</option>
                <option value="LEASE">Lease</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyRental}
                onChange={(e) => setFormData({...formData, monthlyRental: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Per Page Rate (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.perPageRate}
                onChange={(e) => setFormData({...formData, perPageRate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={4}
              placeholder="Enter agreement terms and conditions"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setSelectedAgreement(null)
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Agreement'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// SEARCH AGREEMENT COMPONENT
function SearchAgreementComponent({ agreements }: { agreements: Agreement[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('client')
  const [searchResults, setSearchResults] = useState<Agreement[]>([])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results = agreements.filter(agreement => {
      const searchValue = searchTerm.toLowerCase()
      switch (searchBy) {
        case 'client':
          return agreement.clientName.toLowerCase().includes(searchValue)
        case 'number':
          return agreement.agreementNumber.toLowerCase().includes(searchValue)
        case 'type':
          return agreement.agreementType.toLowerCase().includes(searchValue)
        case 'status':
          return agreement.status.toLowerCase().includes(searchValue)
        default:
          return true
      }
    })

    setSearchResults(results)
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm, searchBy, agreements])

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-medium text-indigo-900 mb-2">Search Agreement</h3>
        <p className="text-indigo-700">Search and find agreements by various criteria.</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="client">Search by Client</option>
            <option value="number">Search by Agreement Number</option>
            <option value="type">Search by Type</option>
            <option value="status">Search by Status</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Enter ${searchBy} to search...`}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {searchResults.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.agreementNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.clientName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{agreement.agreementType}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex px-2 py-1 rounded text-xs ${
                    agreement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    agreement.status === 'SIGNED' ? 'bg-blue-100 text-blue-800' :
                    agreement.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {agreement.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(agreement.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm transition-colors">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {searchTerm && searchResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No agreements found matching your search criteria.
          </div>
        )}
        {!searchTerm && (
          <div className="text-center py-8 text-gray-500">
            Enter search criteria to find agreements.
          </div>
        )}
      </div>
    </div>
  )
}

// REGISTER AGREEMENT COMPONENT
function RegisterAgreementComponent({ 
  clients, 
  printers, 
  onSuccess 
}: { 
  clients: Client[]; 
  printers: Printer[]; 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    agreementNumber: '',
    clientId: '',
    clientName: '',
    agreementDate: '',
    startDate: '',
    endDate: '',
    agreementType: 'RENTAL',
    monthlyRental: '',
    perPageRate: '',
    securityDeposit: '',
    printerDetails: [] as any[],
    billingFrequency: 'MONTHLY',
    paymentTerms: '30',
    autoRenewal: false,
    terms: ''
  })

  const [selectedPrinters, setSelectedPrinters] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const availablePrinters = printers.filter(printer => printer.status === 'AVAILABLE')

  const handleAddPrinter = () => {
    setSelectedPrinters([...selectedPrinters, {
      printerId: '',
      serialNumber: '',
      model: '',
      monthlyRental: '',
      installationDate: ''
    }])
  }

  const handleRemovePrinter = (index: number) => {
    setSelectedPrinters(selectedPrinters.filter((_, i) => i !== index))
  }

  const updatePrinter = (index: number, field: string, value: string) => {
    const updated = [...selectedPrinters]
    updated[index][field] = value
    
    // Auto-fill model when printer is selected
    if (field === 'printerId' && value) {
      const selectedPrinter = availablePrinters.find(p => p.id === value)
      if (selectedPrinter) {
        updated[index].serialNumber = selectedPrinter.serialNumber
        updated[index].model = selectedPrinter.model
      }
    }
    
    setSelectedPrinters(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientId || !formData.agreementNumber || !formData.startDate || !formData.endDate) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/agreements/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          printers: selectedPrinters,
          monthlyRental: formData.monthlyRental ? parseFloat(formData.monthlyRental) : null,
          perPageRate: formData.perPageRate ? parseFloat(formData.perPageRate) : null,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Agreement registered successfully!' })
        // Reset form
        setFormData({
          agreementNumber: '',
          clientId: '',
          clientName: '',
          agreementDate: '',
          startDate: '',
          endDate: '',
          agreementType: 'RENTAL',
          monthlyRental: '',
          perPageRate: '',
          securityDeposit: '',
          printerDetails: [],
          billingFrequency: 'MONTHLY',
          paymentTerms: '30',
          autoRenewal: false,
          terms: ''
        })
        setSelectedPrinters([])
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to register agreement' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <h3 className="text-lg font-medium text-emerald-900 mb-2">Register Agreement</h3>
        <p className="text-emerald-700">Register signed agreements in the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agreement Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">Agreement Registration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Number *</label>
              <input
                type="text"
                required
                value={formData.agreementNumber}
                onChange={(e) => setFormData({...formData, agreementNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="AGR-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Date *</label>
              <input
                type="date"
                required
                value={formData.agreementDate}
                onChange={(e) => setFormData({...formData, agreementDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
              <input
                type="text"
                placeholder="Search client by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <select
                required
                value={formData.clientId}
                onChange={(e) => {
                  const client = clients.find(c => c.id === e.target.value)
                  setFormData({
                    ...formData,
                    clientId: e.target.value,
                    clientName: client?.companyName || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                size={5}
              >
                <option value="">Select a client...</option>
                {filteredClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientCode} - {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Type *</label>
              <select
                value={formData.agreementType}
                onChange={(e) => setFormData({...formData, agreementType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="RENTAL">Rental</option>
                <option value="PER_PAGE">Per Page</option>
                <option value="AMC">AMC</option>
                <option value="LEASE">Lease</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Frequency *</label>
              <select
                value={formData.billingFrequency}
                onChange={(e) => setFormData({...formData, billingFrequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="HALF_YEARLY">Half Yearly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyRental}
                onChange={(e) => setFormData({...formData, monthlyRental: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (Days)</label>
              <input
                type="number"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.autoRenewal}
                onChange={(e) => setFormData({...formData, autoRenewal: e.target.checked})}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Auto Renewal</label>
            </div>
          </div>
        </div>

        {/* Printer Assignment Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-emerald-600">Printer Assignment</h3>
            <button
              type="button"
              onClick={handleAddPrinter}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              + Add Printer
            </button>
          </div>

          {selectedPrinters.map((printer, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Printer</label>
                <select
                  value={printer.printerId}
                  onChange={(e) => updatePrinter(index, 'printerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select printer...</option>
                  {availablePrinters.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.serialNumber} - {p.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  value={printer.serialNumber}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={printer.model}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental</label>
                <input
                  type="number"
                  step="0.01"
                  value={printer.monthlyRental}
                  onChange={(e) => updatePrinter(index, 'monthlyRental', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemovePrinter(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">Terms & Conditions</h3>
          <textarea
            value={formData.terms}
            onChange={(e) => setFormData({...formData, terms: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={6}
            placeholder="Enter agreement terms and conditions..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                agreementNumber: '',
                clientId: '',
                clientName: '',
                agreementDate: '',
                startDate: '',
                endDate: '',
                agreementType: 'RENTAL',
                monthlyRental: '',
                perPageRate: '',
                securityDeposit: '',
                printerDetails: [],
                billingFrequency: 'MONTHLY',
                paymentTerms: '30',
                autoRenewal: false,
                terms: ''
              })
              setSelectedPrinters([])
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Registering...' : 'Register Agreement'}
          </button>
        </div>
      </form>
    </div>
  )
}

// NEW INSTALL COMPONENT
function NewInstallComponent({ 
  clients, 
  printers, 
  onSuccess 
}: { 
  clients: Client[]; 
  printers: Printer[]; 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    location: '',
    installationType: 'NEW',
    installationDate: '',
    printers: [] as any[],
    dcNumber: '',
    dcDate: '',
    challanNumber: '',
    transportDetails: '',
    installedBy: '',
    contactPerson: '',
    contactPhone: '',
    remarks: ''
  })

  const [selectedPrinters, setSelectedPrinters] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const availablePrinters = printers.filter(printer => printer.status === 'AVAILABLE')

  const handleAddPrinter = () => {
    setSelectedPrinters([...selectedPrinters, {
      printerId: '',
      serialNumber: '',
      model: '',
      accessories: [] as string[],
      pageCount: '0'
    }])
  }

  const handleRemovePrinter = (index: number) => {
    setSelectedPrinters(selectedPrinters.filter((_, i) => i !== index))
  }

  const updatePrinter = (index: number, field: string, value: any) => {
    const updated = [...selectedPrinters]
    updated[index][field] = value
    
    // Auto-fill details when printer is selected
    if (field === 'printerId' && value) {
      const selectedPrinter = availablePrinters.find(p => p.id === value)
      if (selectedPrinter) {
        updated[index].serialNumber = selectedPrinter.serialNumber
        updated[index].model = selectedPrinter.model
      }
    }
    
    setSelectedPrinters(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientId || !formData.location || !formData.installationDate || !formData.installedBy) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    if (selectedPrinters.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one printer' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/installations/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          printers: selectedPrinters
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Installation registered successfully!' })
        // Reset form
        setFormData({
          clientId: '',
          clientName: '',
          location: '',
          installationType: 'NEW',
          installationDate: '',
          printers: [],
          dcNumber: '',
          dcDate: '',
          challanNumber: '',
          transportDetails: '',
          installedBy: '',
          contactPerson: '',
          contactPhone: '',
          remarks: ''
        })
        setSelectedPrinters([])
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to register installation' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
        <h3 className="text-lg font-medium text-teal-900 mb-2">New Installation</h3>
        <p className="text-teal-700">Process new printer installations and register them in the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Installation Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-teal-600">Installation Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
              <input
                type="text"
                placeholder="Search client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <select
                required
                value={formData.clientId}
                onChange={(e) => {
                  const client = clients.find(c => c.id === e.target.value)
                  setFormData({
                    ...formData,
                    clientId: e.target.value,
                    clientName: client?.companyName || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                size={5}
              >
                <option value="">Select a client...</option>
                {filteredClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientCode} - {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter installation address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Type *</label>
              <select
                value={formData.installationType}
                onChange={(e) => setFormData({...formData, installationType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="NEW">New Installation</option>
                <option value="REPLACEMENT">Replacement</option>
                <option value="ADDITIONAL">Additional</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date *</label>
              <input
                type="date"
                required
                value={formData.installationDate}
                onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installed By *</label>
              <input
                type="text"
                required
                value={formData.installedBy}
                onChange={(e) => setFormData({...formData, installedBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Technician name"
              />
            </div>
          </div>
        </div>

        {/* Printer Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-teal-600">Printers to Install</h3>
            <button
              type="button"
              onClick={handleAddPrinter}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Printer
            </button>
          </div>

          {selectedPrinters.map((printer, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Printer *</label>
                <select
                  value={printer.printerId}
                  onChange={(e) => updatePrinter(index, 'printerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select printer...</option>
                  {availablePrinters.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.serialNumber} - {p.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Page Count</label>
                <input
                  type="number"
                  value={printer.pageCount}
                  onChange={(e) => updatePrinter(index, 'pageCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={printer.accessories?.includes('USB_CABLE')}
                      onChange={(e) => {
                        const accessories = printer.accessories || []
                        if (e.target.checked) {
                          updatePrinter(index, 'accessories', [...accessories, 'USB_CABLE'])
                        } else {
                          updatePrinter(index, 'accessories', accessories.filter((a: string) => a !== 'USB_CABLE'))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">USB Cable</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={printer.accessories?.includes('POWER_CORD')}
                      onChange={(e) => {
                        const accessories = printer.accessories || []
                        if (e.target.checked) {
                          updatePrinter(index, 'accessories', [...accessories, 'POWER_CORD'])
                        } else {
                          updatePrinter(index, 'accessories', accessories.filter((a: string) => a !== 'POWER_CORD'))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">Power Cord</span>
                  </label>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemovePrinter(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-teal-600">Delivery Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DC Number</label>
              <input
                type="text"
                value={formData.dcNumber}
                onChange={(e) => setFormData({...formData, dcNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Delivery challan number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DC Date</label>
              <input
                type="date"
                value={formData.dcDate}
                onChange={(e) => setFormData({...formData, dcDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Challan Number</label>
              <input
                type="text"
                value={formData.challanNumber}
                onChange={(e) => setFormData({...formData, challanNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Transport challan number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transport Details</label>
              <input
                type="text"
                value={formData.transportDetails}
                onChange={(e) => setFormData({...formData, transportDetails: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Vehicle/courier details"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-teal-600">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Person at client location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Contact number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                rows={3}
                placeholder="Any additional notes or special instructions..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                clientId: '',
                clientName: '',
                location: '',
                installationType: 'NEW',
                installationDate: '',
                printers: [],
                dcNumber: '',
                dcDate: '',
                challanNumber: '',
                transportDetails: '',
                installedBy: '',
                contactPerson: '',
                contactPhone: '',
                remarks: ''
              })
              setSelectedPrinters([])
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Registering Installation...' : 'Register Installation'}
          </button>
        </div>
      </form>
    </div>
  )
}