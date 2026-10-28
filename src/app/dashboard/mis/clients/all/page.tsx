// Location: src/app/dashboard/mis/clients/all/page.tsx
// Description: All Clients MIS Report with Group and Client filters

'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AutocompleteInput from '@/components/mis/AutocompleteInput'
import ExportButton from '@/components/mis/ExportButton'

export default function AllClientsPage() {
  const [group, setGroup] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  
  const clientSuggestions = ['Bhavna Enterprises', 'Zydus Healthcare Ltd.', 'Bisleri International']

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/mis/clients/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, clientSearch })
      })
      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/mis/clients/all/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, clientSearch })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `all-clients-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/mis" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6">
          <ArrowLeft className="h-5 w-5" />
          Back to MIS
        </Link>
        
        <div className="bg-[#3d4977] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8">
            ALL CLIENT DETAILS
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Group</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <AutocompleteInput
              value={clientSearch}
              onChange={setClientSearch}
              suggestions={clientSuggestions}
              label="Client Name"
              placeholder="Search client..."
            />

            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-8 py-3 bg-white text-[#3d4977] rounded-md hover:bg-gray-100 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Loading...' : 'View Details'}
              </button>
            </div>
          </div>

          {data.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-end mb-4">
                <ExportButton onClick={exportToExcel} loading={loading} />
              </div>
              
              <div className="bg-white rounded-lg overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">SR.</th>
                      <th className="px-4 py-2 text-left">CLIENT NAME</th>
                      <th className="px-4 py-2 text-left">CITY</th>
                      <th className="px-4 py-2 text-left">CONTACT PERSON</th>
                      <th className="px-4 py-2 text-left">PHONE</th>
                      <th className="px-4 py-2 text-left">EMAIL</th>
                      <th className="px-4 py-2 text-left">PRINTERS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{row.clientName}</td>
                        <td className="px-4 py-2">{row.city}</td>
                        <td className="px-4 py-2">{row.contactPerson}</td>
                        <td className="px-4 py-2">{row.phone}</td>
                        <td className="px-4 py-2">{row.email}</td>
                        <td className="px-4 py-2">{row.printers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
