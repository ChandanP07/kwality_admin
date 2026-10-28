// Location: src/app/dashboard/mis/page.tsx
// Purpose: Main MIS dashboard with navigation to all 11 report categories

'use client'

import Link from 'next/link'
import { 
  Users, UserCheck, CreditCard, Wallet, ShoppingCart, 
  Package, Send, Archive, TrendingUp, AlertCircle,
  ClipboardList, Hash, Factory, Printer
} from 'lucide-react'

const categories = [
  {
    title: 'CLIENT DETAILS',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    reports: [
      { name: 'All Clients', path: '/dashboard/mis/client-details/all-clients' },
      { name: 'Present Clients', path: '/dashboard/mis/client-details/present-clients' },
      { name: 'Payments', path: '/dashboard/mis/client-details/payments' },
      { name: 'CR/DR', path: '/dashboard/mis/client-details/cr-dr' }
    ]
  },
  {
    title: 'EMPLOYEE DETAILS',
    icon: UserCheck,
    color: 'from-green-500 to-green-600',
    reports: [
      { name: 'Employee MIS', path: '/dashboard/mis/employee-details' }
    ]
  },
  {
    title: 'PURCHASE DETAILS',
    icon: ShoppingCart,
    color: 'from-purple-500 to-purple-600',
    reports: [
      { name: 'All Purchases', path: '/dashboard/mis/purchase-details/all' },
      { name: 'Printer Purchases', path: '/dashboard/mis/purchase-details/printers' },
      { name: 'Printer Parts', path: '/dashboard/mis/purchase-details/printer-parts' }
    ]
  },
  {
    title: 'DISPATCH DETAILS',
    icon: Send,
    color: 'from-orange-500 to-orange-600',
    reports: [
      { name: 'Client Wise', path: '/dashboard/mis/dispatch-details/client' },
      { name: 'Franchise Wise', path: '/dashboard/mis/dispatch-details/franchise' },
      { name: 'Cartridge Wise', path: '/dashboard/mis/dispatch-details/cartridge' },
      { name: 'Month Wise', path: '/dashboard/mis/dispatch-details/month-wise' },
      { name: 'Boy Wise', path: '/dashboard/mis/dispatch-details/boy-wise' },
      { name: 'Challan Wise', path: '/dashboard/mis/dispatch-details/challan-wise' },
      { name: 'Order-Bill', path: '/dashboard/mis/dispatch-details/order-bill' },
      { name: 'Courier Details', path: '/dashboard/mis/dispatch-details/courier-details' }
    ]
  },
  {
    title: 'EMPTY DETAILS',
    icon: Archive,
    color: 'from-red-500 to-red-600',
    reports: [
      { name: 'Client Wise', path: '/dashboard/mis/empty-details/client-wise' },
      { name: 'Cart Wise', path: '/dashboard/mis/empty-details/cart-wise' },
      { name: 'Replacements', path: '/dashboard/mis/empty-details/replacements' }
    ]
  },
  {
    title: 'SALES MIS',
    icon: TrendingUp,
    color: 'from-teal-500 to-teal-600',
    reports: [
      { name: 'Monthly Sales', path: '/dashboard/mis/sales-mis/monthly-sales' },
      { name: 'Sales Register', path: '/dashboard/mis/sales-mis/sales-register' },
      { name: 'Bill Entries', path: '/dashboard/mis/sales-mis/bill-entries' },
      { name: 'Per Page MIS', path: '/dashboard/mis/sales-mis/per-page' },
      { name: 'Collection', path: '/dashboard/mis/sales-mis/collection' }
    ]
  },
  {
    title: 'COMPLAINT DETAILS',
    icon: AlertCircle,
    color: 'from-yellow-500 to-yellow-600',
    reports: [
      { name: 'Complaints', path: '/dashboard/mis/complaint-details' }
    ]
  },
  {
    title: 'ORDER DETAILS',
    icon: ClipboardList,
    color: 'from-indigo-500 to-indigo-600',
    reports: [
      { name: 'All Orders', path: '/dashboard/mis/order-details' }
    ]
  },
  {
    title: 'ORDER COUNT',
    icon: Hash,
    color: 'from-pink-500 to-pink-600',
    reports: [
      { name: 'Order Count', path: '/dashboard/mis/order-count' }
    ]
  },
  {
    title: 'FACTORY DETAILS',
    icon: Factory,
    color: 'from-gray-600 to-gray-700',
    reports: [
      { name: 'Cartridge Stock', path: '/dashboard/mis/factory-details/cartridge-stock' },
      { name: 'Stock by Workman', path: '/dashboard/mis/factory-details/stock-by-workman' },
      { name: 'Productions', path: '/dashboard/mis/factory-details/productions' },
      { name: 'Rejections', path: '/dashboard/mis/factory-details/rejections' },
      { name: 'Material Purchase', path: '/dashboard/mis/factory-details/material-purchase' },
      { name: 'Material Usage', path: '/dashboard/mis/factory-details/material-usage' },
      { name: 'Material to Cartridge', path: '/dashboard/mis/factory-details/material-to-cartridge' }
    ]
  },
  {
    title: 'PRINTER DETAILS',
    icon: Printer,
    color: 'from-cyan-500 to-cyan-600',
    reports: [
      { name: 'All Client Printers', path: '/dashboard/mis/printer-details/all-client' },
      { name: 'Purchase Details', path: '/dashboard/mis/printer-details/purchase' },
      { name: 'Outstation', path: '/dashboard/mis/printer-details/outstation' },
      { name: 'Local', path: '/dashboard/mis/printer-details/local' },
      { name: 'Per Page', path: '/dashboard/mis/printer-details/per-page' },
      { name: 'Stock', path: '/dashboard/mis/printer-details/stock' },
      { name: 'All Printers', path: '/dashboard/mis/printer-details/all-printer' },
      { name: "Client's Printers", path: '/dashboard/mis/printer-details/clients-printer' }
    ]
  }
]

export default function MISDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          MIS REPORTS
        </h1>
        <p className="text-gray-600 text-lg">
          Management Information System - {categories.reduce((sum, cat) => sum + cat.reports.length, 0)} Reports Available
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div 
              key={category.title} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} p-4`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                </div>
                <p className="text-white text-sm mt-1 opacity-90">
                  {category.reports.length} {category.reports.length === 1 ? 'Report' : 'Reports'}
                </p>
              </div>
              
              {/* Reports List */}
              <div className="p-4">
                {category.reports.map((report) => (
                  <Link
                    key={report.path}
                    href={report.path}
                    className="block px-4 py-3 hover:bg-gray-50 rounded-md transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                        {report.name}
                      </span>
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">11</p>
              <p className="text-gray-600 text-sm mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">42</p>
              <p className="text-gray-600 text-sm mt-1">Total Reports</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">84</p>
              <p className="text-gray-600 text-sm mt-1">API Endpoints</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">100%</p>
              <p className="text-gray-600 text-sm mt-1">Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}