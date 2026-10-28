'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import pendingWorkConfig from '@/config/pending-work-config'

export default function PendingWorkView() {
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list')
  const [partners, setPartners] = useState<any[]>([])
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [pendingWork, setPendingWork] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    setLoading(true)
    try {
      // In production, this would call the API
      // const res = await fetch('/api/pending-work')
      // const data = await res.json()
      
      // For now, use sample data
      setPartners(pendingWorkConfig.samplePartners)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePartnerClick = (partner: any) => {
    setSelectedPartner(partner)
    
    // Get pending work for this partner
    const work = pendingWorkConfig.samplePendingWork[partner.id as keyof typeof pendingWorkConfig.samplePendingWork] || []
    setPendingWork(work)
    
    setViewMode('details')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedPartner(null)
    setPendingWork([])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">
          PENDING WORK
        </h1>
        <p className="text-white text-center mb-6 opacity-90">
          Click on a partner to view their pending work details
        </p>

        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading partners...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SR</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Partner Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Person</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pending Work</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Work</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner, idx) => (
                    <tr key={partner.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handlePartnerClick(partner)}
                          className="text-blue-600 underline hover:text-blue-800 font-medium">
                          {partner.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">{partner.contactPerson}</td>
                      <td className="px-6 py-4 text-sm">{partner.contactNumber}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                          {partner.pendingCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{partner.totalWork}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                          {partner.completedWork}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Details View
  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
          </button>
          <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
            {selectedPartner?.name.toUpperCase()}
          </h1>
        </div>

        {/* Partner Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Contact Person</p>
              <p className="font-semibold text-gray-800">{selectedPartner?.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact Number</p>
              <p className="font-semibold text-gray-800">{selectedPartner?.contactNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-800">{selectedPartner?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Work</p>
              <p className="font-semibold text-red-600 text-lg">{selectedPartner?.pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Pending Work List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Work Details</h2>
          
          {pendingWork.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No pending work for this partner</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWork.map((work) => (
                <div key={work.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{work.workType}</h3>
                      <p className="text-gray-600 text-sm mt-1">{work.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(work.priority)}`}>
                        {work.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(work.status)}`}>
                        {work.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Assigned</p>
                        <p className="font-medium text-gray-800">{work.assignedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-medium text-gray-800">{work.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Work ID</p>
                        <p className="font-medium text-gray-800">#{work.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
