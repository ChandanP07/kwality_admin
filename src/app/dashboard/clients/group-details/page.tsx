// app/dashboard/clients/group-details/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Clock, 
  Receipt, 
  ArrowLeft,
  Plus,
  Search,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const groupDetailSubModules = [
  { 
    id: 'add-client-group', 
    title: 'Add Client Group', 
    icon: Users, 
    description: 'Create a new client group for better organization',
    color: 'bg-teal-500'
  },
  { 
    id: 'add-followup-group', 
    title: 'Add Follow-up Group', 
    icon: Clock, 
    description: 'Create groups for follow-up activities and reminders',
    color: 'bg-blue-500'
  },
  { 
    id: 'add-bill-group', 
    title: 'Add Bill Group', 
    icon: Receipt, 
    description: 'Create billing groups for collective billing processes',
    color: 'bg-purple-500'
  }
]

export default function GroupDetailsPage() {
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClients()
    fetchGroups()
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

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/client-groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
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
                {groupDetailSubModules.find(sm => sm.id === activeSubModule)?.title}
              </h1>
              <p className="text-gray-600">
                Group Details › {groupDetailSubModules.find(sm => sm.id === activeSubModule)?.title}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderSubModule(activeSubModule, clients, fetchGroups)}
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
            <h1 className="text-2xl font-bold text-gray-900">Group Details</h1>
            <p className="text-gray-600">Organize clients into groups for better management</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
              <p className="text-xs text-blue-600">All client groups</p>
            </div>
            <Users className="h-8 w-8 text-teal-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-up Groups</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-blue-600">Active follow-ups</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Billing Groups</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-purple-600">Collective billing</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupDetailSubModules.map((subModule) => {
          const Icon = subModule.icon
          return (
            <div
              key={subModule.id}
              onClick={() => setActiveSubModule(subModule.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-300"
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
                <span className="text-blue-600 text-sm font-medium">
                  Open Module →
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Existing Groups */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Existing Client Groups</h3>
        <div className="space-y-3">
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-sm text-gray-500">{group.memberCount} clients</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No client groups created yet</p>
              <p className="text-sm">Create your first group using the options above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function renderSubModule(moduleId: string, clients: any[], onSuccess: () => void) {
  switch (moduleId) {
    case 'add-client-group':
      return <AddClientGroupComponent clients={clients} onSuccess={onSuccess} />
    case 'add-followup-group':
      return <AddFollowupGroupComponent clients={clients} onSuccess={onSuccess} />
    case 'add-bill-group':
      return <AddBillGroupComponent clients={clients} onSuccess={onSuccess} />
    default:
      return <div>Module not found</div>
  }
}

// ADD CLIENT GROUP COMPONENT
function AddClientGroupComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedClients.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one client' })
      return
    }

    if (!groupName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a group name' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/client-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          description,
          clientIds: selectedClients,
          type: 'CLIENT_GROUP'
        })
      })

      const result = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: `Group "${groupName}" created successfully with ${selectedClients.length} clients!` })
        setGroupName('')
        setDescription('')
        setSelectedClients([])
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create group' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const selectAll = () => {
    setSelectedClients(filteredClients.map(client => client.id))
  }

  const clearSelection = () => {
    setSelectedClients([])
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-teal-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-teal-900 mb-2">Add Client Group</h3>
        <p className="text-teal-700">Create a new client group to organize clients for better management and reporting.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Basic Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Group Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter group description (optional)"
              />
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
                onClick={selectAll}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearSelection}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    onChange={() => toggleClientSelection(client.id)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">
                      {client.contactPerson} • {client.clientCode} • {client.clientType}
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
            {filteredClients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No clients found matching your search
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setGroupName('')
              setDescription('')
              setSelectedClients([])
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !groupName.trim() || selectedClients.length === 0}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Group...' : `Create Group (${selectedClients.length} clients)`}
          </button>
        </div>
      </form>
    </div>
  )
}

// ADD FOLLOW-UP GROUP COMPONENT
function AddFollowupGroupComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [groupName, setGroupName] = useState('')
  const [followupType, setFollowupType] = useState('PAYMENT_REMINDER')
  const [frequency, setFrequency] = useState('WEEKLY')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const followupTypes = [
    { value: 'PAYMENT_REMINDER', label: 'Payment Reminder' },
    { value: 'SERVICE_CHECK', label: 'Service Check' },
    { value: 'RENEWAL_REMINDER', label: 'Renewal Reminder' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'GENERAL_FOLLOWUP', label: 'General Follow-up' }
  ]

  const frequencies = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a group name' })
      return
    }

    if (selectedClients.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one client' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/followup-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          type: followupType,
          frequency,
          clientIds: selectedClients
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Follow-up group created successfully!' })
        setGroupName('')
        setSelectedClients([])
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to create follow-up group' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const selectAll = () => {
    setSelectedClients(filteredClients.map(client => client.id))
  }

  const clearSelection = () => {
    setSelectedClients([])
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Add Follow-up Group</h3>
        <p className="text-blue-700">Create a follow-up group to schedule regular reminders and check-ins with selected clients.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Follow-up Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Type *</label>
              <select
                value={followupType}
                onChange={(e) => setFollowupType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {followupTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
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
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearSelection}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search clients..."
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-3 border-b border-gray-100 last:border-b-0">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => toggleClientSelection(client.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">{client.contactPerson}</div>
                  </div>
                </label>
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No clients found matching your search
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setGroupName('')
              setSelectedClients([])
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !groupName.trim() || selectedClients.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Group...' : 'Create Follow-up Group'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ADD BILL GROUP COMPONENT
function AddBillGroupComponent({ clients, onSuccess }: { clients: any[], onSuccess: () => void }) {
  const [groupName, setGroupName] = useState('')
  const [billingType, setBillingType] = useState('COLLECTIVE')
  const [billingDate, setBillingDate] = useState('1')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const billingTypes = [
    { value: 'COLLECTIVE', label: 'Collective Billing' },
    { value: 'CONSOLIDATED', label: 'Consolidated Billing' },
    { value: 'GROUP_DISCOUNT', label: 'Group Discount Billing' }
  ]

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a group name' })
      return
    }

    if (selectedClients.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one client' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/bill-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          billingType,
          billingDate: parseInt(billingDate),
          clientIds: selectedClients
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Bill group created successfully!' })
        setGroupName('')
        setSelectedClients([])
        setSearchTerm('')
        onSuccess()
      } else {
        setMessage({ type: 'error', text: 'Failed to create bill group' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const selectAll = () => {
    setSelectedClients(filteredClients.map(client => client.id))
  }

  const clearSelection = () => {
    setSelectedClients([])
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">Add Bill Group</h3>
        <p className="text-purple-700">Create a billing group to process collective billing for multiple clients together.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Billing Group Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter billing group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Type *</label>
              <select
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {billingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Date</label>
              <select
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString()}>{day}</option>
                ))}
              </select>
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
                onClick={selectAll}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearSelection}
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

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-3 border-b border-gray-100 last:border-b-0">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => toggleClientSelection(client.id)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">{client.contactPerson}</div>
                  </div>
                </label>
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No clients found matching your search
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setGroupName('')
              setSelectedClients([])
              setSearchTerm('')
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !groupName.trim() || selectedClients.length === 0}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Group...' : 'Create Bill Group'}
          </button>
        </div>
      </form>
    </div>
  )
}