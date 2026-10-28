// app/dashboard/clients/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Eye, 
  Building2, 
  FileText, 
  RotateCcw, 
  UserX,
  Search,
  Filter,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string;
  isActive: boolean;
  // Add other client properties as needed
}

const clientModules = [
  {
    id: 'client-details',
    title: 'Client Details',
    description: 'Manage client information and settings',
    icon: Users,
    color: 'bg-blue-500 hover:bg-blue-600',
    href: '/dashboard/clients/client-details'
  },
  {
    id: 'group-details',
    title: 'Group Details',
    description: 'Organize clients into groups',
    icon: Users,
    color: 'bg-teal-500 hover:bg-teal-600',
    href: '/dashboard/clients/group-details'
  },
  {
    id: 'agreement',
    title: 'Agreement',
    description: 'Manage client agreements and contracts',
    icon: FileText,
    color: 'bg-orange-500 hover:bg-orange-600',
    href: '/dashboard/clients/agreement'
  },
  {
    id: 'replacement',
    title: 'Replacement',
    description: 'Handle printer/service replacements',
    icon: RotateCcw,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    href: '/dashboard/clients/replacement'
  },
  {
    id: 'termination',
    title: 'Termination',
    description: 'Process client terminations',
    icon: UserX,
    color: 'bg-red-500 hover:bg-red-600',
    href: '/dashboard/clients/termination'
  }
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        // Ensure data is always an array
        setClients(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch clients')
        setClients([])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  // Safe calculations
  const activeClients = clients.filter(c => c.isActive)
  const activeClientsCount = activeClients.length
  const totalClientsCount = clients.length
  const activePercentage = totalClientsCount > 0 
    ? Math.round((activeClientsCount / totalClientsCount) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Client Management</h1>
              <p className="text-blue-100">
                Manage your clients, agreements, and relationships
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search Clients</span>
            </button>
            <button className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : totalClientsCount}
              </p>
              <p className="text-xs text-green-600">+12 this month</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : activeClientsCount}
              </p>
              <p className="text-xs text-green-600">
                {activePercentage}% active
              </p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Agreements</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-xs text-orange-600">Requires attention</p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹2.4L</p>
              <p className="text-xs text-green-600">+8.2% growth</p>
            </div>
            <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">₹</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientModules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.id} href={module.href}>
              <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-300">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${module.color} transition-colors`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {module.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <span className="text-blue-600 text-sm font-medium">
                    Open Module →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Recent Client Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Tech Solutions Pvt Ltd</p>
                <p className="text-sm text-gray-500">New client added</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Digital Marketing Agency</p>
                <p className="text-sm text-gray-500">Agreement signed</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">Manufacturing Corp</p>
                <p className="text-sm text-gray-500">Payment overdue</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium">Software Development Inc</p>
                <p className="text-sm text-gray-500">New branch added</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}