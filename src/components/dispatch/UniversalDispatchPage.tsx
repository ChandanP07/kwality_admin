'use client'
import { useState, useEffect } from 'react'
import dispatchScreens from '@/config/dispatch-config'
import { TextInput, Autocomplete, DateRange, ActionBtn, DataTable } from './DispatchComponents'

export default function UniversalDispatchPage({ screenId }: { screenId: string }) {
  const config = dispatchScreens[screenId]
  
  if (!config) {
    return <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8"><h2 className="text-2xl font-bold text-red-600 mb-4">Screen Not Found</h2></div>
    </div>
  }

  const [filters, setFilters] = useState<Record<string, any>>({})
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions] = useState<Record<string, string[]>>({
    clientName: ['Restaurant Brands Asia Limited', 'ABC Corp', 'XYZ Ltd'],
    godownName: ['Godown A', 'Godown B', 'Godown C'],
    cartridgeModel: ['HP 679 Black', 'Canon 810 XL', 'Epson 003'],
    orderId: ['E89072', 'E89308', 'O12345']
  })

  useEffect(() => {
    const init: Record<string, any> = {}
    config.filters?.forEach((f: any) => {
      if (f.type === 'daterange') {
        init.fromDate = ''
        init.toDate = ''
      } else {
        init[f.name] = ''
      }
    })
    setFilters(init)
  }, [config])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)) })
      
      const res = await fetch(`/api/dispatch/${screenId}?${params}`)
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
    if (action === 'refresh' || action === 'viewStock' || action === 'submit') {
      await fetchData()
    } else if (action === 'add') {
      alert('Add to system & database - Implement save logic')
    } else if (action === 'exportExcel') {
      alert('Generating Excel with 20+ columns...')
    } else if (action === 'updateForm') {
      alert('Opening update form...')
    } else {
      alert(`Action: ${action}`)
    }
  }

  const handleRowClick = (row: any, action?: string) => {
    if (action === 'cancel') {
      alert('Cancelling appointment...')
    } else if (action === 'dispatch') {
      alert('Dispatching person to resolve...')
    } else if (action === 'viewDetails') {
      alert('Showing repair details...')
    } else if (action === 'scan') {
      alert('Showing signed/stamped invoice image...')
    } else if (action === 'upload') {
      alert('Upload image to system...')
    } else {
      alert(`Viewing details for: ${row.orderId || row.clientName || row.orderNumber}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">{config.title.toUpperCase()}</h1>
      {config.description && <p className="text-white text-center mb-6 opacity-90">{config.description}</p>}

      <div className="max-w-5xl mx-auto bg-[#2d3967] p-6 rounded-lg shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.filters?.map((f: any) => {
            if (f.type === 'text' || f.type === 'number') 
              return <TextInput key={f.name} label={f.label} value={filters[f.name] || ''} onChange={(v: string) => setFilters({...filters, [f.name]: v})} placeholder={f.placeholder} type={f.type} />
            if (f.type === 'autocomplete') 
              return <Autocomplete key={f.name} label={f.label} value={filters[f.name] || ''} onChange={(v: string) => setFilters({...filters, [f.name]: v})} suggestions={suggestions[f.name] || []} placeholder={f.placeholder} />
            if (f.type === 'daterange') 
              return <DateRange key={f.name} fromDate={filters.fromDate || ''} toDate={filters.toDate || ''} onFromChange={(v: string) => setFilters({...filters, fromDate: v})} onToChange={(v: string) => setFilters({...filters, toDate: v})} label={f.label} />
            return null
          })}
        </div>

        {config.actions && (
          <div className="mt-6 flex gap-4 flex-wrap">
            {config.actions.map((a: any, i: number) => (
              <ActionBtn key={i} onClick={() => handleAction(a.action)} label={a.label} loading={loading} 
                color={a.action === 'add' || a.action === 'submit' || a.action === 'exportExcel' || a.action === 'updateForm' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} />
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
