// Location: src/app/dashboard/chalan/page.tsx
'use client'

import Link from 'next/link'
import { Send, Hash, FileText, DollarSign, Receipt, FileCheck, Settings, CreditCard, FileQuestion, AlertTriangle } from 'lucide-react'

const categories = [
  {
    title: 'SEND BILLS',
    icon: Send,
    color: 'from-blue-500 to-blue-600',
    screens: [
      { name: 'Edit Monthly Bill', path: '/dashboard/chalan/send-bills/edit' },
      { name: 'Courier', path: '/dashboard/chalan/send-bills/courier' },
      { name: 'Email', path: '/dashboard/chalan/send-bills/email' }
    ]
  },
  {
    title: 'PAGE COUNT',
    icon: Hash,
    color: 'from-green-500 to-green-600',
    screens: [
      { name: 'Page Count All', path: '/dashboard/chalan/page-count/all' },
      { name: 'Verify Count', path: '/dashboard/chalan/page-count/verify' },
      { name: 'Partner Work', path: '/dashboard/chalan/page-count/partner-work' },
      { name: 'Reset Count', path: '/dashboard/chalan/page-count/reset' },
      { name: 'Opening Count', path: '/dashboard/chalan/page-count/opening' },
      { name: 'Calculations', path: '/dashboard/chalan/page-count/calculations' },
      { name: 'View Page Count', path: '/dashboard/chalan/page-count/view' },
      { name: 'Remove Count', path: '/dashboard/chalan/page-count/remove' },
      { name: 'Print Report', path: '/dashboard/chalan/page-count/print-report' },
      { name: 'Zero Count Mail', path: '/dashboard/chalan/page-count/zero-mail' }
    ]
  },
  {
    title: 'TALLY EXPORTS',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    screens: [
      { name: 'Printer Transfer', path: '/dashboard/chalan/tally-exports/printer-transfer' }
    ]
  },
  {
    title: 'TALLY LEDGER',
    icon: FileCheck,
    color: 'from-orange-500 to-orange-600',
    screens: [
      { name: 'Tally Ledger', path: '/dashboard/chalan/tally-ledger' }
    ]
  },
  {
    title: 'TALLY PAYMENT',
    icon: DollarSign,
    color: 'from-teal-500 to-teal-600',
    screens: [
      { name: 'View', path: '/dashboard/chalan/tally-payment/view' },
      { name: 'Pending', path: '/dashboard/chalan/tally-payment/pending' },
      { name: 'Email', path: '/dashboard/chalan/tally-payment/email' }
    ]
  },
  {
    title: 'e-INVOICE',
    icon: Receipt,
    color: 'from-red-500 to-red-600',
    screens: [
      { name: 'Pending Import', path: '/dashboard/chalan/einvoice/pending-import' },
      { name: 'Tally 2 Soft', path: '/dashboard/chalan/einvoice/tally2soft' },
      { name: 'Pending IRN', path: '/dashboard/chalan/einvoice/pending-irn' },
      { name: 'Multi Print', path: '/dashboard/chalan/einvoice/multi-print' }
    ]
  },
  {
    title: 'TALLY UPDATE',
    icon: Settings,
    color: 'from-yellow-500 to-yellow-600',
    screens: [
      { name: 'Tally Update', path: '/dashboard/chalan/tally-update' }
    ]
  },
  {
    title: 'BILL UPDATES',
    icon: FileText,
    color: 'from-indigo-500 to-indigo-600',
    screens: [
      { name: 'Stop Bill Manual', path: '/dashboard/chalan/bill-updates/stop-manual' },
      { name: 'Stop Bill Auto', path: '/dashboard/chalan/bill-updates/stop-auto' },
      { name: 'Rate Update', path: '/dashboard/chalan/bill-updates/rate' },
      { name: 'GST Update', path: '/dashboard/chalan/bill-updates/gst' },
      { name: 'Tally Name', path: '/dashboard/chalan/bill-updates/tally-name' },
      { name: 'Last Bill No', path: '/dashboard/chalan/bill-updates/last-bill' }
    ]
  },
  {
    title: 'BILLING',
    icon: CreditCard,
    color: 'from-pink-500 to-pink-600',
    screens: [
      { name: 'Monthly Bill', path: '/dashboard/chalan/billing/monthly' },
      { name: 'Current Bill', path: '/dashboard/chalan/billing/current' },
      { name: 'Open Bill', path: '/dashboard/chalan/billing/open' },
      { name: 'Tally Bill', path: '/dashboard/chalan/billing/tally' }
    ]
  },
  {
    title: 'BILL QUERY',
    icon: FileQuestion,
    color: 'from-cyan-500 to-cyan-600',
    screens: [
      { name: 'Bill Query', path: '/dashboard/chalan/bill-query' }
    ]
  },
  {
    title: 'PENDING GST',
    icon: AlertTriangle,
    color: 'from-gray-600 to-gray-700',
    screens: [
      { name: 'Pending GST', path: '/dashboard/chalan/pending-gst' }
    ]
  }
]

export default function ChalanDashboard() {
  const totalScreens = categories.reduce((sum, cat) => sum + cat.screens.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          CHALAN/BILL MANAGEMENT
        </h1>
        <p className="text-gray-600 text-lg">
          Complete Billing System - {totalScreens} Screens Available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.title} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${category.color} p-4`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                </div>
                <p className="text-white text-sm mt-1 opacity-90">{category.screens.length} {category.screens.length === 1 ? 'Screen' : 'Screens'}</p>
              </div>
              <div className="p-4">
                {category.screens.map((screen) => (
                  <Link key={screen.path} href={screen.path} className="block px-4 py-3 hover:bg-gray-50 rounded-md transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{screen.name}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="mt-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">11</p>
              <p className="text-gray-600 text-sm mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{totalScreens}</p>
              <p className="text-gray-600 text-sm mt-1">Total Screens</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">156+</p>
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
