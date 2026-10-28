// Location: src/components/chalan/UniversalChalanPage.tsx
'use client'

import { useState, useEffect } from 'react'
import chalanScreens from '@/config/chalan-reports'
import {
  TextFilter, DateRangePicker, AutocompleteFilter, DropdownFilter,
  MonthYearPicker, ExportButton, ViewButton, DataTable
} from './ChalanComponents'

interface UniversalChalanPageProps {
  screenId: string
}

export default function UniversalChalanPage({ screenId }: UniversalChalanPageProps) {
  const screenConfig = chalanScreens[screenId]
  
  if (!screenConfig) {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Screen Not Found</h2>
          <p className="text-gray-600">The requested screen configuration could not be found.</p>
        </div>
      </div>
    )
  }

  const [filters, setFilters] = useState<Record<string, any>>({})
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})
  const [clientMap, setClientMap] = useState<Record<string, string>>({})

  // Load client names for autocomplete on mount
  useEffect(() => {
    const hasClientAutocomplete = screenConfig.filters.some(f => f.type === 'autocomplete' && f.name === 'client')
    if (!hasClientAutocomplete) return
    fetch('/api/chalan/clients')
      .then(r => r.json())
      .then(json => {
        if (json.names) setSuggestions(prev => ({ ...prev, client: json.names }))
        if (json.data) {
          const map: Record<string, string> = {}
          json.data.forEach((c: any) => { map[c.companyName] = c.id })
          setClientMap(map)
        }
      })
      .catch(console.error)
  }, [screenConfig])

  useEffect(() => {
    const initialFilters: Record<string, any> = {}
    screenConfig.filters.forEach(filter => {
      if (filter.type === 'dropdown' && filter.options) {
        initialFilters[filter.name] = filter.options[0]
      } else if (filter.type === 'monthyear') {
        initialFilters.month = ''
        initialFilters.year = ''
      } else if (filter.type === 'daterange') {
        initialFilters.fromDate = ''
        initialFilters.toDate = ''
      } else {
        initialFilters[filter.name] = ''
      }
    })
    
    if (screenConfig.fixedValues) {
      Object.assign(initialFilters, screenConfig.fixedValues)
    }
    
    setFilters(initialFilters)
  }, [screenConfig])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) return
        // If this is a client name, also send the resolved clientId
        if (key === 'client' && clientMap[String(value)]) {
          queryParams.append('clientId', clientMap[String(value)])
        }
        queryParams.append(key, String(value))
      })

      const path = screenConfig.screenPath 
        ? `/api/chalan/${screenConfig.categoryPath}/${screenConfig.screenPath}`
        : `/api/chalan/${screenConfig.categoryPath}`

      const response = await fetch(`${path}?${queryParams}`)
      
      if (!response.ok) throw new Error('Failed to fetch data')

      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value))
      })

      const path = screenConfig.screenPath 
        ? `/api/chalan/${screenConfig.categoryPath}/${screenConfig.screenPath}/export`
        : `/api/chalan/${screenConfig.categoryPath}/export`

      const response = await fetch(`${path}?${queryParams}`)
      
      if (!response.ok) throw new Error('Failed to export data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${screenConfig.title.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting:', error)
      setError('Failed to export data.')
    }
  }

  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">
        {screenConfig.title.toUpperCase()}
      </h1>

      {screenConfig.description && (
        <p className="text-white text-center mb-6 opacity-90">{screenConfig.description}</p>
      )}

      <div className="max-w-5xl mx-auto bg-[#2d3967] p-6 rounded-lg shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {screenConfig.filters.map((filter) => {
            if (filter.type === 'text') {
              return (
                <TextFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || ''}
                  onChange={(val: string) => updateFilter(filter.name, val)}
                  placeholder={filter.placeholder}
                />
              )
            }
            
            if (filter.type === 'daterange') {
              return (
                <DateRangePicker
                  key={filter.name}
                  fromDate={filters.fromDate || ''}
                  toDate={filters.toDate || ''}
                  onFromChange={(val: string) => updateFilter('fromDate', val)}
                  onToChange={(val: string) => updateFilter('toDate', val)}
                  label={filter.label}
                />
              )
            }
            
            if (filter.type === 'autocomplete') {
              return (
                <AutocompleteFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || ''}
                  onChange={(val: string) => updateFilter(filter.name, val)}
                  suggestions={suggestions[filter.name] || []}
                  placeholder={filter.placeholder}
                />
              )
            }
            
            if (filter.type === 'dropdown' && filter.options) {
              return (
                <DropdownFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || filter.options[0]}
                  onChange={(val: string) => updateFilter(filter.name, val)}
                  options={filter.options}
                />
              )
            }
            
            if (filter.type === 'monthyear') {
              return (
                <MonthYearPicker
                  key={filter.name}
                  month={filters.month || ''}
                  year={filters.year || ''}
                  onMonthChange={(val: string) => updateFilter('month', val)}
                  onYearChange={(val: string) => updateFilter('year', val)}
                  label={filter.label}
                />
              )
            }
            
            if (filter.type === 'textarea') {
              return (
                <div key={filter.name} className='flex flex-col gap-2'>
                  <label className='text-white text-sm font-medium'>{filter.label}</label>
                  <textarea
                    value={filters[filter.name] || ''}
                    onChange={(e) => updateFilter(filter.name, e.target.value)}
                    placeholder={filter.placeholder}
                    rows={3}
                    className='px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                  />
                </div>
              )
            }

            return null
          })}
        </div>

        <div className="mt-6">
          <ViewButton onClick={fetchData} loading={loading} />
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!error && data.length > 0 && screenConfig.columns && (
        <div className="max-w-7xl mx-auto">
          <DataTable columns={screenConfig.columns} data={data} loading={loading} />
          
          {screenConfig.exportType === 'csv' || screenConfig.exportType === 'excel' ? (
            <div className="mt-6 flex justify-center">
              <ExportButton onClick={exportData} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}