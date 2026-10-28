'use client'
import { useState, useEffect } from 'react'
import printerScreens from '@/config/printer-config'
import { TextInput, TextArea, Autocomplete, Dropdown, ActionBtn, DataTable } from './PrinterComponents'

export default function UniversalPrinterPage({ screenId }: { screenId: string }) {
  const config = printerScreens[screenId]
  
  if (!config) {
    return <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8"><h2 className="text-2xl font-bold text-red-600 mb-4">Screen Not Found</h2></div>
    </div>
  }

  const [filters, setFilters] = useState<Record<string, any>>({})
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions] = useState<Record<string, string[]>>({
    printerModel: ['HP LaserJet Pro', 'Canon PIXMA', 'Epson L3150', 'Brother HL-L2321D'],
    serialNumber: ['SN001', 'SN002', 'SN003'],
    clientName: ['ABC Corp', 'XYZ Ltd', 'Tech Solutions'],
    cartridgeModel: ['HP 679 Black', 'Canon 810 XL', 'Epson 003'],
    vendorName: ['Vendor A', 'Vendor B', 'Supplier X']
  })

  useEffect(() => {
    const init: Record<string, any> = {}
    config.filters?.forEach((f: any) => {
      init[f.name] = f.type === 'dropdown' && f.options ? '' : ''
    })
    setFilters(init)
  }, [config])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)) })
      
      const res = await fetch(`/api/printers/${config.id.replace('printers-', '')}?${params}`)
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
    if (action === 'query' || action === 'search' || action === 'refresh' || action === 'load') {
      await fetchData()
    } else {
      alert(`Action: ${action} - Implement save logic`)
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
            if (f.type === 'textarea') 
              return <div key={f.name} className="md:col-span-2"><TextArea label={f.label} value={filters[f.name] || ''} onChange={(v: string) => setFilters({...filters, [f.name]: v})} placeholder={f.placeholder} /></div>
            if (f.type === 'autocomplete') 
              return <Autocomplete key={f.name} label={f.label} value={filters[f.name] || ''} onChange={(v: string) => setFilters({...filters, [f.name]: v})} suggestions={suggestions[f.name] || []} placeholder={f.placeholder} />
            if (f.type === 'dropdown' && f.options) 
              return <Dropdown key={f.name} label={f.label} value={filters[f.name] || ''} onChange={(v: string) => setFilters({...filters, [f.name]: v})} options={f.options} />
            return null
          })}
        </div>

        {config.actions && (
          <div className="mt-6 flex gap-4 flex-wrap">
            {config.actions.map((a: any, i: number) => (
              <ActionBtn key={i} onClick={() => handleAction(a.action)} label={a.label} loading={loading} 
                color={a.action === 'add' || a.action === 'update' || a.action === 'save' || a.action === 'addMapping' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} />
            ))}
          </div>
        )}
      </div>

      {config.columns && data.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <DataTable columns={config.columns} data={data} loading={loading} />
        </div>
      )}
    </div>
  )
}
