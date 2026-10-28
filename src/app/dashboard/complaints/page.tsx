'use client'
import Link from 'next/link'
import { Clock, DollarSign, Search, CheckCircle } from 'lucide-react'

const modules = [
  { title: 'Pending Complaints', icon: Clock, path: '/dashboard/complaints/pending', color: 'from-blue-500 to-blue-600', desc: 'Click engineer to view details' },
  { title: 'Pending Bill', icon: DollarSign, path: '/dashboard/complaints/pending-bill', color: 'from-green-500 to-green-600', desc: 'Click complaint ID to view' },
  { title: 'Complaint Query', icon: Search, path: '/dashboard/complaints/complaint-query', color: 'from-purple-500 to-purple-600', desc: 'Search by complaint number' },
  { title: 'Done Complaints', icon: CheckCircle, path: '/dashboard/complaints/done', color: 'from-orange-500 to-orange-600', desc: 'View completed complaints' }
]

export default function ComplaintsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">COMPLAINT MANAGEMENT SYSTEM</h1>
        <p className="text-gray-600 text-lg">Complete Complaint Operations - {modules.length} Modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
