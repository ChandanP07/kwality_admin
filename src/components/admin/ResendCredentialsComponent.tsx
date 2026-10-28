'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Send, RefreshCw, User, CheckCircle } from 'lucide-react'

interface Client {
  id: string
  clientCode: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  city: string
  state: string
  isActive: boolean
}

export function ResendCredentialsComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Mock client data - In production, this would come from API
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        clientCode: 'CLI001',
        companyName: 'Tech Solutions Pvt Ltd',
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@techsolutions.com',
        phone: '+91 9876543210',
        city: 'Mumbai',
        state: 'Maharashtra',
        isActive: true
      },
      {
        id: '2',
        clientCode: 'CLI002',
        companyName: 'Digital Marketing Agency',
        contactPerson: 'Priya Sharma',
        email: 'priya@digitalmarketing.com',
        phone: '+91 9876543211',
        city: 'Andheri',
        state: 'Maharashtra',
        isActive: true
      },
      {
        id: '3',
        clientCode: 'CLI003',
        companyName: 'Manufacturing Corp',
        contactPerson: 'Amit Patel',
        email: 'amit@manufacturing.com',
        phone: '+91 9876543212',
        city: 'Pune',
        state: 'Maharashtra',
        isActive: false
      },
      {
        id: '4',
        clientCode: 'CLI004',
        companyName: 'Software Development Inc',
        contactPerson: 'Neha Singh',
        email: 'neha@softwaredev.com',
        phone: '+91 9876543213',
        city: 'Delhi',
        state: 'Delhi',
        isActive: true
      },
      {
        id: '5',
        clientCode: 'CLI005',
        companyName: 'Consulting Services',
        contactPerson: 'Vikram Mehta',
        email: 'vikram@consulting.com',
        phone: '+91 9876543214',
        city: 'Bangalore',
        state: 'Karnataka',
        isActive: true
      }
    ]
    setClients(mockClients)
    setFilteredClients(mockClients)
  }, [])

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client => 
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const handleRefreshClients = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setMessage({ type: 'success', text: 'Client list refreshed successfully!' })
    }, 1000)
  }

  const handleResendCredentials = async () => {
    if (!selectedClient) return

    setSending(true)

    try {
      // In production, this would call the API
      // const response = await fetch('/api/admin/resend-credentials', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ clientId: selectedClient.id })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setMessage({ 
        type: 'success', 
        text: `Login credentials have been sent successfully to ${selectedClient.email}` 
      })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send credentials. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <Mail className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div className="flex-1">{message.text}</div>
            <button 
              onClick={() => setMessage(null)}
              className="text-lg font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Search */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Search Client
            </h3>
            <button
              onClick={handleRefreshClients}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Enter client name and refresh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
            />
          </div>

          {/* Client List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredClients.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No clients found</p>
                <p className="text-sm mt-2">Try searching with a different term</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedClient?.id === client.id 
                      ? 'bg-teal-100 border-2 border-teal-500' 
                      : 'bg-white border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-lg">{client.companyName}</p>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {client.clientCode}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <strong>Contact:</strong> {client.contactPerson}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Email:</strong> {client.email}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Location:</strong> {client.city}, {client.state}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          client.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">{client.phone}</span>
                      </div>
                    </div>
                    <Mail className="h-5 w-5 text-teal-400 ml-2" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resend Action */}
        <div className="bg-white rounded-lg border-2 border-teal-200 p-6">
          {selectedClient ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-teal-700">Resend Login Credentials</h3>
                
                {/* Selected Client Details */}
                <div className="bg-teal-50 rounded-lg p-4 mb-6 border border-teal-200">
                  <h4 className="font-medium mb-3 text-teal-800">Selected Client:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{selectedClient.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Contact Person:</span>
                      <span className="font-medium">{selectedClient.contactPerson}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-teal-700">{selectedClient.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Client Code:</span>
                      <span className="font-medium">{selectedClient.clientCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedClient.city}, {selectedClient.state}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        selectedClient.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedClient.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>What will be sent:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Client portal login credentials</li>
                        <li>Website URL and access instructions</li>
                        <li>Contact information for support</li>
                        <li>User guide for first-time login</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Warning for inactive clients */}
                {!selectedClient.isActive && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Note:</strong> This client account is currently inactive. The credentials will be sent, but the client may not be able to login until the account is reactivated.
                      </div>
                    </div>
                  </div>
                )}

                {/* Resend Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleResendCredentials}
                    disabled={sending}
                    className="flex items-center space-x-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                  >
                    {sending ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Sending Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Resend Login ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-3">Recent Email Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Last credentials sent:</span>
                      <span className="font-medium">2 weeks ago</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Email delivery status:</span>
                      <span className="text-green-600 font-medium">Delivered</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Last login attempt:</span>
                      <span className="font-medium">5 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Mail className="h-16 w-16 mx-auto text-gray-300 mb-6" />
              <p className="text-xl font-medium mb-2">No Client Selected</p>
              <p className="text-gray-400 mb-6">
                Search and select a client from the list to resend their login credentials
              </p>
              
              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h4 className="font-medium text-gray-700 mb-3">How to use:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Enter client name in the search box</li>
                  <li>Click "Refresh" to load matching clients</li>
                  <li>Select the client from the list</li>
                  <li>Click "Resend Login ID" to send credentials</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleRefreshClients}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-teal-600" />
            <span>Refresh Client List</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>Bulk Email Send</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <User className="h-5 w-5 text-purple-600" />
            <span>Client Management</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-teal-600">{clients.length}</div>
          <div className="text-gray-600 text-sm">Total Clients</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {clients.filter(c => c.isActive).length}
          </div>
          <div className="text-gray-600 text-sm">Active Clients</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-gray-600 text-sm">Emails Sent Today</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">98%</div>
          <div className="text-gray-600 text-sm">Delivery Rate</div>
        </div>
      </div>
    </div>
  )
}