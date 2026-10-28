// app/dashboard/clients/client-details/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  UserPlus, 
  Building2, 
  Eye, 
  Edit3, 
  Settings,
  Calendar,
  Receipt,
  FileText,
  Mail,
  Users,
  ArrowLeft,
  Search,
  Save
} from 'lucide-react'
import Link from 'next/link'

const clientDetailSubModules = [
  { id: 'new-client', title: 'New Client', icon: UserPlus, description: 'Add a new client to the system' },
  { id: 'new-branch', title: 'New Branch', icon: Building2, description: 'Add a new branch for existing client' },
  { id: 'view-update', title: 'View/Update', icon: Eye, description: 'View and update client information' },
  { id: 'master-updation', title: 'Master Updation', icon: Edit3, description: 'Bulk update client master data' },
  { id: 'billing-date', title: 'Billing Date', icon: Calendar, description: 'Set monthly billing dates' },
  { id: 'auto-forward', title: 'Auto Forward', icon: Mail, description: 'Configure auto forward settings' },
  { id: 'hardcopy-required', title: 'Hardcopy Required', icon: FileText, description: 'Manage hardcopy requirements' },
  { id: 'stop-bill-mail', title: 'Stop Bill Mail', icon: Mail, description: 'Control billing email settings' },
  { id: 'sez-client', title: 'SEZ Client', icon: Settings, description: 'Manage SEZ client settings' },
  { id: 'ngo-client', title: 'NGO Client', icon: Users, description: 'Manage NGO client settings' },
  { id: 'b2c-clients', title: 'B2C Clients', icon: Users, description: 'Manage B2C client settings' },
  { id: 'fixed-rental', title: 'Fixed Rental', icon: Receipt, description: 'Configure fixed rental settings' }
]

export default function ClientDetailsPage() {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClients()
    fetchCities()
  }, [])

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

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities')
      if (response.ok) {
        const data = await response.json()
        setCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
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
                {clientDetailSubModules.find(sm => sm.id === activeSubModule)?.title}
              </h1>
              <p className="text-gray-600">
                Client Details › {clientDetailSubModules.find(sm => sm.id === activeSubModule)?.title}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderSubModule(activeSubModule, clients, cities, fetchClients)}
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
            <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
            <p className="text-gray-600">Manage client information and settings</p>
          </div>
        </div>
      </div>

      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientDetailSubModules.map((subModule) => {
          const Icon = subModule.icon
          return (
            <div
              key={subModule.id}
              onClick={() => setActiveSubModule(subModule.id)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{subModule.title}</h3>
                  <p className="text-sm text-gray-500">{subModule.description}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <span className="text-blue-600 text-sm">Open →</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderSubModule(moduleId: string, clients: any[], cities: any[], refetch: () => void) {
  switch (moduleId) {
    case 'new-client':
      return <NewClientComponent cities={cities} onSuccess={refetch} />
    case 'new-branch':
      return <NewBranchComponent clients={clients} onSuccess={refetch} />
    case 'view-update':
      return <ViewUpdateComponent clients={clients} cities={cities} onSuccess={refetch} />
    case 'master-updation':
      return <MasterUpdationComponent clients={clients} onSuccess={refetch} />
    case 'billing-date':
      return <BillingDateComponent clients={clients} />
    case 'auto-forward':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="autoForward"
        title="Auto Forward Settings"
        description="Enable or disable auto forward for clients. When enabled, orders will be automatically forwarded to the next stage."
        enabledLabel="Enabled"
        disabledLabel="Disabled"
      />
    case 'hardcopy-required':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="hardcopyRequired"
        title="Hardcopy Required Settings"
        description="Manage which clients require hardcopy documents along with digital delivery."
        enabledLabel="Required"
        disabledLabel="Not Required"
      />
    case 'stop-bill-mail':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="stopBillMail"
        title="Stop Bill Mail Settings"
        description="Control email billing for clients. When enabled, billing emails will be stopped for these clients."
        enabledLabel="Stopped"
        disabledLabel="Active"
      />
    case 'sez-client':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="isSezClient"
        title="SEZ Client Settings"
        description="Mark clients as Special Economic Zone (SEZ) clients for special tax treatment."
        enabledLabel="SEZ Client"
        disabledLabel="Regular Client"
      />
    case 'ngo-client':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="isNgoClient"
        title="NGO Client Settings"
        description="Identify Non-Governmental Organization clients for special pricing and treatment."
        enabledLabel="NGO Client"
        disabledLabel="Regular Client"
      />
    case 'b2c-clients':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="isB2cClient"
        title="B2C Client Settings"
        description="Mark clients as Business-to-Consumer for different billing and service processes."
        enabledLabel="B2C Client"
        disabledLabel="B2B Client"
      />
    case 'fixed-rental':
      return <ClientSettingComponent 
        clients={clients}
        settingKey="fixedRental"
        title="Fixed Rental Settings"
        description="Enable fixed rental pricing model for clients instead of per-page billing."
        enabledLabel="Fixed Rental"
        disabledLabel="Per Page"
      />
    default:
      return <div>Module not found</div>
  }
}

// NEW CLIENT COMPONENT
function NewClientComponent({ cities, onSuccess }: { cities: any[], onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    cityId: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    clientType: 'REGULAR',
    creditLimit: '',
    billingDate: '1',
    autoForward: false,
    hardcopyRequired: false,
    stopBillMail: false,
    isSezClient: false,
    isNgoClient: false,
    isB2cClient: false,
    fixedRental: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : null,
          billingDate: parseInt(formData.billingDate)
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `Client "${formData.companyName}" created successfully with code: ${result.clientCode}` })
        resetForm()
        onSuccess()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create client' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      cityId: '',
      state: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      clientType: 'REGULAR',
      creditLimit: '',
      billingDate: '1',
      autoForward: false,
      hardcopyRequired: false,
      stopBillMail: false,
      isSezClient: false,
      isNgoClient: false,
      isB2cClient: false,
      fixedRental: false
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              required
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pincode"
            />
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter GST number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter PAN number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Type *</label>
            <select
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="REGULAR">Regular</option>
              <option value="FRANCHISE">Franchise</option>
              <option value="DEALER">Dealer</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter credit limit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date *</label>
            <select
              value={formData.billingDate}
              onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day.toString()}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Client Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Client Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center">
            <input
              id="autoForward"
              type="checkbox"
              checked={formData.autoForward}
              onChange={(e) => setFormData({ ...formData, autoForward: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoForward" className="ml-2 block text-sm text-gray-900">Auto Forward</label>
          </div>

          <div className="flex items-center">
            <input
              id="hardcopyRequired"
              type="checkbox"
              checked={formData.hardcopyRequired}
              onChange={(e) => setFormData({ ...formData, hardcopyRequired: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hardcopyRequired" className="ml-2 block text-sm text-gray-900">Hardcopy Required</label>
          </div>

          <div className="flex items-center">
            <input
              id="stopBillMail"
              type="checkbox"
              checked={formData.stopBillMail}
              onChange={(e) => setFormData({ ...formData, stopBillMail: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="stopBillMail" className="ml-2 block text-sm text-gray-900">Stop Bill Mail</label>
          </div>

          <div className="flex items-center">
            <input
              id="isSezClient"
              type="checkbox"
              checked={formData.isSezClient}
              onChange={(e) => setFormData({ ...formData, isSezClient: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSezClient" className="ml-2 block text-sm text-gray-900">SEZ Client</label>
          </div>

          <div className="flex items-center">
            <input
              id="isNgoClient"
              type="checkbox"
              checked={formData.isNgoClient}
              onChange={(e) => setFormData({ ...formData, isNgoClient: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isNgoClient" className="ml-2 block text-sm text-gray-900">NGO Client</label>
          </div>

          <div className="flex items-center">
            <input
              id="isB2cClient"
              type="checkbox"
              checked={formData.isB2cClient}
              onChange={(e) => setFormData({ ...formData, isB2cClient: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isB2cClient" className="ml-2 block text-sm text-gray-900">B2C Client</label>
          </div>

          <div className="flex items-center">
            <input
              id="fixedRental"
              type="checkbox"
              checked={formData.fixedRental}
              onChange={(e) => setFormData({ ...formData, fixedRental: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="fixedRental" className="ml-2 block text-sm text-gray-900">Fixed Rental</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Client...' : 'Create Client'}
        </button>
      </div>
    </form>
  )
}
// NEW BRANCH COMPONENT
function NewBranchComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    clientId: '',
    branchName: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState(clients)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setFilteredClients(
      clients.filter(client => 
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, clients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: `Branch "${formData.branchName}" created successfully!` })
        setFormData({ clientId: '', branchName: '', address: '', contactPerson: '', phone: '', email: '' })
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create branch' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Client</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type client name to search..."
        />

        {searchTerm && (
          <div className="mt-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setFormData({ ...formData, clientId: client.id })
                  setSearchTerm(client.companyName)
                }}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{client.companyName}</div>
                <div className="text-sm text-gray-500">{client.contactPerson} • {client.clientCode}</div>
              </div>
            ))}
          </div>
        )}

        {formData.clientId && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Selected Client:</div>
            <div className="font-medium text-blue-900">
              {clients.find(c => c.id === formData.clientId)?.companyName}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Branch Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
            <input
              type="text"
              required
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter branch name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter branch address"
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
              branchName: '',
              address: '',
              contactPerson: '',
              phone: '',
              email: ''
            })
            setSearchTerm('')
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.clientId}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Branch...' : 'Create Branch'}
        </button>
      </div>
    </form>
  )
}

// VIEW/UPDATE COMPONENT
function ViewUpdateComponent({ clients, cities, onSuccess }: { clients: any[], cities: any[], onSuccess: () => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [filteredClients, setFilteredClients] = useState(clients)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setFilteredClients(
      clients.filter(client => 
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, clients])

  const handleClientSelect = async (client: any) => {
    setSelectedClient(client)
    setFormData({ 
      ...client, 
      cityId: client.cityId || '',
      creditLimit: client.creditLimit?.toString() || '',
      billingDate: client.billingDate?.toString() || '1'
    })
    setSearchTerm(client.companyName)
    setIsEditing(false)
    setMessage(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const updateData = {
        ...formData,
        creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : null,
        billingDate: parseInt(formData.billingDate) || 1
      }

      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedClient = await response.json()
        setMessage({ type: 'success', text: 'Client updated successfully!' })
        setSelectedClient(updatedClient)
        setIsEditing(false)
        onSuccess()
      } else {
        const result = await response.json()
        setMessage({ type: 'error', text: result.error || 'Failed to update client' })
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

      {/* Search Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Client</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type client name, contact person, or client code..."
        />

        {searchTerm && !selectedClient && (
          <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleClientSelect(client)}
                className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">Code: {client.clientCode}</div>
                    <div className="text-sm text-gray-500">Contact: {client.contactPerson}</div>
                    <div className="text-sm text-gray-500">Phone: {client.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs ${
                      client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{client.clientType}</div>
                  </div>
                </div>
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No clients found matching your search
              </div>
            )}
          </div>
        )}
      </div>

      {/* Client Details */}
      {selectedClient && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Client Details</h3>
            <div className="space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit3 className="h-4 w-4 inline mr-2" />
                  Edit
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({ ...selectedClient })
                      setMessage(null)
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={formData.cityId || ''}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                  <select
                    value={formData.clientType || 'REGULAR'}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="FRANCHISE">Franchise</option>
                    <option value="DEALER">Dealer</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.creditLimit || ''}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date</label>
                  <select
                    value={formData.billingDate || '1'}
                    onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString()}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Client Code</label>
                <p className="text-sm text-gray-900 font-mono">{selectedClient.clientCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Company Name</label>
                <p className="text-sm text-gray-900">{selectedClient.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-sm text-gray-900">{selectedClient.contactPerson}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedClient.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{selectedClient.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Client Type</label>
                <p className="text-sm text-gray-900">{selectedClient.clientType}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{selectedClient.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">City</label>
                <p className="text-sm text-gray-900">{selectedClient.city?.name || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">State</label>
                <p className="text-sm text-gray-900">{selectedClient.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Pincode</label>
                <p className="text-sm text-gray-900">{selectedClient.pincode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">GST Number</label>
                <p className="text-sm text-gray-900">{selectedClient.gstNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">PAN Number</label>
                <p className="text-sm text-gray-900">{selectedClient.panNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className={`inline-flex px-2 py-1 rounded text-xs ${
                  selectedClient.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedClient.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Credit Limit</label>
                <p className="text-sm text-gray-900">
                  {selectedClient.creditLimit ? `₹${selectedClient.creditLimit.toLocaleString()}` : 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Billing Date</label>
                <p className="text-sm text-gray-900">{selectedClient.billingDate} of every month</p>
              </div>
            </div>
          )}

          {/* Client Settings Display */}
          {!isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Client Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.autoForward ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">Auto Forward</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.hardcopyRequired ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">Hardcopy Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.stopBillMail ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">Stop Bill Mail</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.isSezClient ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">SEZ Client</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.isNgoClient ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">NGO Client</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.isB2cClient ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">B2C Client</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedClient.fixedRental ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700">Fixed Rental</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
// MASTER UPDATION COMPONENT
function MasterUpdationComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [updateType, setUpdateType] = useState('billing_date')
  const [updateValue, setUpdateValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updateOptions = [
    { value: 'billing_date', label: 'Billing Date', type: 'select' },
    { value: 'client_type', label: 'Client Type', type: 'select' },
    { value: 'credit_limit', label: 'Credit Limit', type: 'number' },
    { value: 'auto_forward', label: 'Auto Forward', type: 'boolean' },
    { value: 'hardcopy_required', label: 'Hardcopy Required', type: 'boolean' },
    { value: 'stop_bill_mail', label: 'Stop Bill Mail', type: 'boolean' },
    { value: 'is_active', label: 'Active Status', type: 'boolean' }
  ]

  const handleBulkUpdate = async () => {
    if (selectedClients.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one client' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const updates = selectedClients.map(clientId => {
        let value = updateValue
        
        // Convert values based on type
        if (updateType === 'billing_date') {
          value = parseInt(updateValue)
        } else if (updateType === 'credit_limit') {
          value = parseFloat(updateValue) || null
        } else if (['auto_forward', 'hardcopy_required', 'stop_bill_mail', 'is_active'].includes(updateType)) {
          value = updateValue === 'true'
        }

        return { clientId, field: updateType, value }
      })

      const response = await fetch('/api/clients/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Successfully updated ${selectedClients.length} clients` 
        })
        setSelectedClients([])
        setUpdateValue('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to update clients' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderUpdateInput = () => {
    const option = updateOptions.find(opt => opt.value === updateType)
    
    if (!option) return null

    switch (option.type) {
      case 'select':
        if (updateType === 'billing_date') {
          return (
            <select
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select billing date</option>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day.toString()}>{day}</option>
              ))}
            </select>
          )
        } else if (updateType === 'client_type') {
          return (
            <select
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select client type</option>
              <option value="REGULAR">Regular</option>
              <option value="FRANCHISE">Franchise</option>
              <option value="DEALER">Dealer</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          )
        }
        break

      case 'number':
        return (
          <input
            type="number"
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter value"
          />
        )

      case 'boolean':
        return (
          <select
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select option</option>
            <option value="true">Enable/Yes</option>
            <option value="false">Disable/No</option>
          </select>
        )

      default:
        return (
          <input
            type="text"
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter value"
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">Master Updation</h3>
        <p className="text-purple-700">Update multiple clients at once with bulk operations. Select clients and choose the field to update.</p>
      </div>

      {/* Update Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Update Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field to Update</label>
            <select
              value={updateType}
              onChange={(e) => {
                setUpdateType(e.target.value)
                setUpdateValue('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {updateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
            {renderUpdateInput()}
          </div>
        </div>
      </div>

      {/* Client Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Select Clients ({selectedClients.length} selected)</h4>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setSelectedClients(filteredClients.map(c => c.id))}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSelectedClients([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Search clients..."
          />
        </div>

        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClients([...selectedClients, client.id])
                    } else {
                      setSelectedClients(selectedClients.filter(id => id !== client.id))
                    }
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{client.companyName}</div>
                  <div className="text-sm text-gray-500">
                    {client.contactPerson} • {client.clientCode} • {client.clientType}
                  </div>
                  <div className="text-sm text-gray-500">
                    Current {updateOptions.find(opt => opt.value === updateType)?.label}: 
                    {updateType === 'billing_date' && ` ${client.billingDate}`}
                    {updateType === 'client_type' && ` ${client.clientType}`}
                    {updateType === 'credit_limit' && ` ₹${client.creditLimit?.toLocaleString() || '0'}`}
                    {updateType === 'auto_forward' && ` ${client.autoForward ? 'Enabled' : 'Disabled'}`}
                    {updateType === 'hardcopy_required' && ` ${client.hardcopyRequired ? 'Required' : 'Not Required'}`}
                    {updateType === 'stop_bill_mail' && ` ${client.stopBillMail ? 'Stopped' : 'Active'}`}
                    {updateType === 'is_active' && ` ${client.isActive ? 'Active' : 'Inactive'}`}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Update Actions */}
      {selectedClients.length > 0 && updateValue && (
        <div className="bg-white border border-purple-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Confirm Bulk Update</h4>
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <p className="text-purple-800">
              You are about to update <strong>{selectedClients.length} clients</strong> with the following change:
            </p>
            <p className="text-purple-800 mt-2">
              <strong>{updateOptions.find(opt => opt.value === updateType)?.label}:</strong> 
              {updateType === 'billing_date' && ` ${updateValue} of every month`}
              {updateType === 'client_type' && ` ${updateValue}`}
              {updateType === 'credit_limit' && ` ₹${parseFloat(updateValue || '0').toLocaleString()}`}
              {['auto_forward', 'hardcopy_required', 'stop_bill_mail', 'is_active'].includes(updateType) && 
                ` ${updateValue === 'true' ? 'Enable/Yes' : 'Disable/No'}`}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setSelectedClients([])
                setUpdateValue('')
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpdate}
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : `Update ${selectedClients.length} Clients`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// BILLING DATE COMPONENT
function BillingDateComponent({ clients }: { clients: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [newBillingDate, setNewBillingDate] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdateBillingDate = async () => {
    if (!selectedClient) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingDate: parseInt(newBillingDate) })
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Billing date updated to ${newBillingDate} for ${selectedClient.companyName}` 
        })
        setSelectedClient({ ...selectedClient, billingDate: parseInt(newBillingDate) })
      } else {
        setMessage({ type: 'error', text: 'Failed to update billing date' })
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

      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-indigo-900 mb-2">Billing Date Management</h3>
        <p className="text-indigo-700">Set the monthly billing date for each client. This determines when monthly bills are generated.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Search */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Search Client</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
            placeholder="Search client..."
          />
          
          {searchTerm && (
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client)
                    setNewBillingDate(client.billingDate?.toString() || '1')
                  }}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{client.companyName}</div>
                  <div className="text-sm text-gray-500">
                    Current billing date: {client.billingDate || 1} of every month
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Update Form */}
        {selectedClient && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Update Billing Date</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedClient.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Billing Date</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedClient.billingDate || 1} of every month
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Billing Date</label>
                <select
                  value={newBillingDate}
                  onChange={(e) => setNewBillingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day.toString()}>{day}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleUpdateBillingDate}
                disabled={isSubmitting || newBillingDate === selectedClient.billingDate?.toString()}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Billing Date'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Billing Date Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Billing Date Overview</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
              const clientsWithThisDate = clients.filter(client => 
                (client.billingDate || 1) === day
              )
              return (
                <div key={day} className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{day}</div>
                  <div className="text-xs text-gray-500">
                    {clientsWithThisDate.length} client{clientsWithThisDate.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// CLIENT SETTINGS COMPONENT (Reusable for all boolean settings)
function ClientSettingComponent({ 
  clients, 
  settingKey, 
  title, 
  description, 
  enabledLabel, 
  disabledLabel 
}: {
  clients: any[]
  settingKey: string
  title: string
  description: string
  enabledLabel: string
  disabledLabel: string
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState(clients)
  const [isUpdating, setIsUpdating] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setFilteredClients(
      clients.filter(client => 
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, clients])

  const handleToggle = async (clientId: string, currentValue: boolean, clientName: string) => {
    setIsUpdating(clientId)
    setMessage(null)

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [settingKey]: !currentValue })
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `${enabledLabel} ${!currentValue ? 'enabled' : 'disabled'} for ${clientName}` 
        })
        // Update local state
        setFilteredClients(prev => prev.map(client => 
          client.id === clientId ? { ...client, [settingKey]: !currentValue } : client
        ))
      } else {
        setMessage({ type: 'error', text: 'Failed to update setting' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsUpdating('')
    }
  }

  const enabledCount = filteredClients.filter(client => client[settingKey]).length
  const disabledCount = filteredClients.length - enabledCount

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">{title}</h3>
        <p className="text-blue-700">{description}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{filteredClients.length}</div>
          <div className="text-sm text-gray-500">Total Clients</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
          <div className="text-sm text-gray-500">{enabledLabel}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">{disabledCount}</div>
          <div className="text-sm text-gray-500">{disabledLabel}</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search clients..."
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">{client.clientCode}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{client.contactPerson}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    client[settingKey] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client[settingKey] ? enabledLabel : disabledLabel}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(client.id, client[settingKey], client.companyName)}
                    disabled={isUpdating === client.id}
                    className={`px-3 py-1 rounded text-sm font-medium disabled:opacity-50 ${
                      client[settingKey] 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {isUpdating === client.id ? 'Updating...' : (client[settingKey] ? 'Disable' : 'Enable')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No clients found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}