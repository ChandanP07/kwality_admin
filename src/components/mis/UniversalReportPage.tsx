// Location: src/components/mis/UniversalReportPage.tsx
// Purpose: Universal report page component that renders any MIS report

'use client'

import { useState, useEffect } from 'react'
import reports from '@/config/reports'
import {
  TextFilter,
  DateRangePicker,
  AutocompleteFilter,
  DropdownFilter,
  MonthYearPicker,
  ExportButton,
  ViewButton,
  DataTable,
  LoadingSpinner,
  ErrorMessage
} from './MISComponents'

interface UniversalReportPageProps {
  reportId: string
}

export default function UniversalReportPage({ reportId }: UniversalReportPageProps) {
  const reportConfig = reports[reportId]
  
  if (!reportConfig) {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Report Not Found</h2>
          <p className="text-gray-600">The requested report configuration could not be found.</p>
        </div>
      </div>
    )
  }

  const [filters, setFilters] = useState<Record<string, any>>({})
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})

  // Initialize filters
  useEffect(() => {
    const initialFilters: Record<string, any> = {}
    reportConfig.filters.forEach(filter => {
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
    setFilters(initialFilters)
  }, [reportConfig])

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (filterName: string, query: string) => {
    if (!query || query.length < 2) return
    
    try {
      const response = await fetch(`/api/mis/get-clients?query=${query}`)
      if (response.ok) {
        const result = await response.json()
        setSuggestions(prev => ({
          ...prev,
          [filterName]: result.data || []
        }))
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  // Fetch report data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value))
      })

      const response = await fetch(
        `/api/mis/${reportConfig.categoryPath}/${reportConfig.reportPath || ''}?${queryParams}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Export to Excel
  const exportToExcel = async () => {
    setExporting(true)
    
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value))
      })

      const response = await fetch(
        `/api/mis/${reportConfig.categoryPath}/${reportConfig.reportPath || ''}/export?${queryParams}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportConfig.exportFileName}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting:', error)
      setError('Failed to export data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">
        {reportConfig.title.toUpperCase()}
      </h1>

      {/* Filters Container */}
      <div className="max-w-5xl mx-auto bg-[#2d3967] p-6 rounded-lg shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportConfig.filters.map((filter) => {
            // Text Filter
            if (filter.type === 'text') {
              return (
                <TextFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || ''}
                  onChange={(val) => updateFilter(filter.name, val)}
                  placeholder={filter.placeholder}
                />
              )
            }
            
            // Date Range Filter
            if (filter.type === 'daterange') {
              return (
                <DateRangePicker
                  key={filter.name}
                  fromDate={filters.fromDate || ''}
                  toDate={filters.toDate || ''}
                  onFromChange={(val) => updateFilter('fromDate', val)}
                  onToChange={(val) => updateFilter('toDate', val)}
                  label={filter.label}
                />
              )
            }
            
            // Autocomplete Filter
            if (filter.type === 'autocomplete') {
              return (
                <AutocompleteFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || ''}
                  onChange={(val) => updateFilter(filter.name, val)}
                  suggestions={suggestions[filter.name] || []}
                  placeholder={filter.placeholder}
                  onSearch={(query) => fetchSuggestions(filter.name, query)}
                />
              )
            }
            
            // Dropdown Filter
            if (filter.type === 'dropdown' && filter.options) {
              return (
                <DropdownFilter
                  key={filter.name}
                  label={filter.label}
                  value={filters[filter.name] || filter.options[0]}
                  onChange={(val) => updateFilter(filter.name, val)}
                  options={filter.options}
                />
              )
            }
            
            // Month/Year Filter
            if (filter.type === 'monthyear') {
              return (
                <MonthYearPicker
                  key={filter.name}
                  month={filters.month || ''}
                  year={filters.year || ''}
                  onMonthChange={(val) => updateFilter('month', val)}
                  onYearChange={(val) => updateFilter('year', val)}
                  label={filter.label}
                />
              )
            }
            
            return null
          })}
        </div>

        {/* View Details Button */}
        <div className="mt-6">
          <ViewButton onClick={fetchData} loading={loading} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-8">
          <ErrorMessage message={error} onRetry={fetchData} />
        </div>
      )}

      {/* Data Table */}
      {!error && data.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <DataTable 
            columns={reportConfig.columns} 
            data={data}
            loading={loading}
          />
          
          {/* Export Button */}
          <div className="mt-6 flex justify-center">
            <ExportButton onClick={exportToExcel} loading={exporting} />
          </div>
        </div>
      )}

      {/* No Data Message (only show when not loading and no error) */}
      {!loading && !error && data.length === 0 && filters.fromDate && (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No data found for the selected filters</p>
        </div>
      )}
    </div>
  )
}