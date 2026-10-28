'use client'
import { useState, useEffect } from 'react'
import marketingScreens from '@/config/marketing-config'
import { TextInput, TextArea, Dropdown, MultiSelect, ActionBtn, DataTable } from './MarketingComponents'

export default function UniversalMarketingPage({ screenId }: { screenId: string }) {
  const config = marketingScreens[screenId]
  
  if (!config) {
    return <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8"><h2 className="text-2xl font-bold text-red-600 mb-4">Screen Not Found</h2></div>
    </div>
  }

  const [filters, setFilters] = useState<Record<string, any>>({})
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'contact'>('list')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  
  // Details form states
  const [status, setStatus] = useState('')
  const [commitmentModel, setCommitmentModel] = useState('')
  const [selectedCartridges, setSelectedCartridges] = useState<string[]>([])
  const [quotationDetails, setQuotationDetails] = useState('')
  const [contactDetails, setContactDetails] = useState({
    contactNo: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    const init: Record<string, any> = {}
    config.filters?.forEach((f: any) => {
      init[f.name] = ''
    })
    setFilters(init)
  }, [config])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)) })
      
      const res = await fetch(`/api/marketing/${screenId}?${params}`)
      const result = await res.json()
      setData(result.data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    if (action === 'refresh') {
      await fetchData()
    } else if (action === 'sendQuotation') {
      alert(`Sending quotation to ${selectedRecord?.name}...`)
      // Reset and go back
      setViewMode('list')
      await fetchData()
    } else if (action === 'updateDetails') {
      alert('Updating details in system & database...')
      // Reset and go back
      setViewMode('list')
      await fetchData()
    } else if (action === 'changeContact') {
      alert('Updating contact details in system & database...')
      // Reset and go back
      setViewMode('list')
      await fetchData()
    }
  }

  const handleRowClick = (row: any, columnKey?: string) => {
    setSelectedRecord(row)
    
    if (columnKey === 'name') {
      // Click on name - show details view
      setStatus(row.status || '')
      setCommitmentModel('')
      setSelectedCartridges([])
      setQuotationDetails('')
      setViewMode('details')
    } else if (columnKey === 'contactNo') {
      // Click on contact number - show contact form
      setContactDetails({
        contactNo: row.contactNo || '',
        email: row.email || '',
        address: row.address || ''
      })
      setViewMode('contact')
    } else {
      alert(`Viewing: ${row.name || row.cartridgeModel}`)
    }
  }

  const handleBack = () => {
    setViewMode('list')
    setSelectedRecord(null)
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">{config.title.toUpperCase()}</h1>
        {config.description && <p className="text-white text-center mb-6 opacity-90">{config.description}</p>}

        <div className="max-w-5xl mx-auto bg-[#2d3967] p-6 rounded-lg shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.filters?.map((f: any) => (
              <TextInput key={f.name} label={f.label} value={filters[f.name] || ''} 
                onChange={(v: string) => setFilters({...filters, [f.name]: v})} placeholder={f.placeholder} />
            ))}
          </div>

          {config.actions && (
            <div className="mt-6 flex gap-4 flex-wrap">
              {config.actions.map((a: any, i: number) => (
                <ActionBtn key={i} onClick={() => handleAction(a.action)} label={a.label} loading={loading} 
                  color="bg-blue-600 hover:bg-blue-700" />
              ))}
            </div>
          )}
        </div>

        {config.columns && data.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <DataTable columns={config.columns} data={data} loading={loading} onRowClick={handleRowClick} />
          </div>
        )}
      </div>
    )
  }

  // Details View (for PENDING - click on name)
  if (viewMode === 'details' && selectedRecord) {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-yellow-400">{selectedRecord.name}</h1>
            <button onClick={handleBack} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              ← Back to List
            </button>
          </div>

          <div className="bg-[#2d3967] p-6 rounded-lg shadow-xl space-y-6">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div><strong>Contact:</strong> {selectedRecord.contactNo}</div>
              <div><strong>Company:</strong> {selectedRecord.company}</div>
            </div>

            <Dropdown label="Update Status" value={status} onChange={setStatus} 
              options={config.statusOptions || []} />

            <Dropdown label="Commitment Model" value={commitmentModel} onChange={setCommitmentModel} 
              options={config.commitmentModels || []} />

            {commitmentModel && (
              <MultiSelect label="Select Cartridge Models" value={selectedCartridges} 
                onChange={setSelectedCartridges} options={config.cartridgeModels || []} />
            )}

            {selectedCartridges.length > 0 && (
              <TextArea label="Quotation Details" value={quotationDetails} 
                onChange={setQuotationDetails} placeholder="Enter quotation details..." />
            )}

            <div className="flex gap-4">
              <ActionBtn onClick={() => handleAction('sendQuotation')} label="Send Quotation" 
                color="bg-green-600 hover:bg-green-700" />
              <ActionBtn onClick={() => handleAction('updateDetails')} label="Update Details" 
                color="bg-blue-600 hover:bg-blue-700" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Contact Update View (for PENDING - click on contact number)
  if (viewMode === 'contact' && selectedRecord) {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-yellow-400">Update Contact: {selectedRecord.name}</h1>
            <button onClick={handleBack} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              ← Back to List
            </button>
          </div>

          <div className="bg-[#2d3967] p-6 rounded-lg shadow-xl space-y-6">
            <TextInput label="Contact Number" value={contactDetails.contactNo} 
              onChange={(v: string) => setContactDetails({...contactDetails, contactNo: v})} 
              placeholder="Enter contact number" />

            <TextInput label="Email" value={contactDetails.email} 
              onChange={(v: string) => setContactDetails({...contactDetails, email: v})} 
              placeholder="Enter email" type="email" />

            <TextArea label="Address" value={contactDetails.address} 
              onChange={(v: string) => setContactDetails({...contactDetails, address: v})} 
              placeholder="Enter address" />

            <ActionBtn onClick={() => handleAction('changeContact')} label="Change" 
              color="bg-green-600 hover:bg-green-700" />
          </div>
        </div>
      </div>
    )
  }

  return null
}
