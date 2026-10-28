'use client'
import Link from 'next/link'
import { Plus, Edit, ShoppingCart, Eye, Search, Users, Package, ClipboardList, Building2 } from 'lucide-react'

const modules = [
  { title: 'New Model', icon: Plus, path: '/dashboard/printers/new-model', color: 'from-blue-500 to-blue-600' },
  { title: 'Edit Model', icon: Edit, path: '/dashboard/printers/edit-model', color: 'from-green-500 to-green-600' },
  { title: 'Printer Purchase', icon: ShoppingCart, path: '/dashboard/printers/printer-purchase', color: 'from-purple-500 to-purple-600' },
  { title: 'View or Edit Printer', icon: Eye, path: '/dashboard/printers/view-edit-printer', color: 'from-orange-500 to-orange-600' },
  { title: 'Printer Query', icon: Search, path: '/dashboard/printers/printer-query', color: 'from-red-500 to-red-600' },
  { title: 'Edit Client Printer', icon: Users, path: '/dashboard/printers/edit-client-printer', color: 'from-indigo-500 to-indigo-600' },
  { title: 'Stock', icon: Package, path: '/dashboard/printers/stock', color: 'from-teal-500 to-teal-600' },
  { title: 'Add Request', icon: ClipboardList, path: '/dashboard/printers/printer-request/add', color: 'from-pink-500 to-pink-600' },
  { title: 'View Request', icon: ClipboardList, path: '/dashboard/printers/printer-request/view', color: 'from-cyan-500 to-cyan-600' },
  { title: 'Add Vendor', icon: Building2, path: '/dashboard/printers/vendor/add', color: 'from-yellow-500 to-yellow-600' },
  { title: 'Update Vendor', icon: Building2, path: '/dashboard/printers/vendor/update', color: 'from-gray-600 to-gray-700' }
]

export default function PrintersDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">PRINTER MANAGEMENT SYSTEM</h1>
        <p className="text-gray-600 text-lg">Complete Printer Management - {modules.length} Modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {modules.map((m) => {
          const Icon = m.icon
          return (
            <Link key={m.path} href={m.path} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className={`bg-gradient-to-r ${m.color} p-6`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8 text-white" />
                  <h2 className="text-xl font-bold text-white">{m.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Open Module</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
