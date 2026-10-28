'use client'
import Link from 'next/link'
import { Clock, DollarSign } from 'lucide-react'

const modules = [
  { 
    title: 'Pending Marketing', 
    icon: Clock, 
    path: '/dashboard/marketing/pending', 
    color: 'from-blue-500 to-blue-600',
    desc: 'Click name for details - Click contact to update - Send quotations'
  },
  { 
    title: 'Marketing Rates', 
    icon: DollarSign, 
    path: '/dashboard/marketing/rates', 
    color: 'from-green-500 to-green-600',
    desc: 'View and manage marketing rates'
  }
]

export default function MarketingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">MARKETING MANAGEMENT SYSTEM</h1>
        <p className="text-gray-600 text-lg">Complete Marketing Operations - {modules.length} Modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                <p className="text-gray-600 mb-4">{m.desc}</p>
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
