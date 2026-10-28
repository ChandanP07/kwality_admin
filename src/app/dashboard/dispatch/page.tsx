'use client'
import Link from 'next/link'
import { Truck, Package, FileText, Search, Box, CreditCard, ClipboardCheck, FileSpreadsheet, Warehouse, RotateCcw, Eye, Wrench, CheckCircle } from 'lucide-react'

const modules = [
  { title: 'Pending Dispatch', icon: Truck, path: '/dashboard/dispatch/pending-dispatch', color: 'from-blue-500 to-blue-600' },
  { title: 'Pending Delivery', icon: Package, path: '/dashboard/dispatch/pending-delivery', color: 'from-green-500 to-green-600' },
  { title: 'Hard Copy', icon: FileText, path: '/dashboard/dispatch/hard-copy', color: 'from-purple-500 to-purple-600' },
  { title: 'Order Query', icon: Search, path: '/dashboard/dispatch/order-query', color: 'from-orange-500 to-orange-600' },
  { title: 'Empty Cartridge', icon: Box, path: '/dashboard/dispatch/empty-cartridge', color: 'from-red-500 to-red-600' },
  { title: 'Empty Payment', icon: CreditCard, path: '/dashboard/dispatch/empty-payment', color: 'from-indigo-500 to-indigo-600' },
  { title: 'Pending POD', icon: ClipboardCheck, path: '/dashboard/dispatch/pending-pod', color: 'from-teal-500 to-teal-600' },
  { title: 'POD Details', icon: FileSpreadsheet, path: '/dashboard/dispatch/pod-details', color: 'from-pink-500 to-pink-600' },
  { title: 'Godowns Dispatch', icon: Warehouse, path: '/dashboard/dispatch/godowns/dispatch', color: 'from-cyan-500 to-cyan-600' },
  { title: 'Godowns Return', icon: RotateCcw, path: '/dashboard/dispatch/godowns/return', color: 'from-yellow-500 to-yellow-600' },
  { title: 'View Stock', icon: Eye, path: '/dashboard/dispatch/godowns/view-stock', color: 'from-lime-500 to-lime-600' },
  { title: 'Repair Pending', icon: Wrench, path: '/dashboard/dispatch/repair/pending', color: 'from-rose-500 to-rose-600' },
  { title: 'Repair Done', icon: CheckCircle, path: '/dashboard/dispatch/repair/done', color: 'from-emerald-500 to-emerald-600' }
]

export default function DispatchDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">DISPATCH MANAGEMENT SYSTEM</h1>
        <p className="text-gray-600 text-lg">Complete Dispatch Operations - {modules.length} Modules</p>
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
