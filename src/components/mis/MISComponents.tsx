// Location: src/components/mis/MISComponents.tsx
// Purpose: Reusable UI components for MIS reports

'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search, Download, ChevronDown } from 'lucide-react'

// Text Input Filter
interface TextFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextFilter({ label, value, onChange, placeholder }: TextFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  )
}

// Date Range Picker
interface DateRangePickerProps {
  fromDate: string
  toDate: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  label?: string
}

export function DateRangePicker({ 
  fromDate, 
  toDate, 
  onFromChange, 
  onToChange,
  label = 'Date Range'
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-300">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromChange(e.target.value)}
            className="flex-1 border-none outline-none text-sm"
          />
        </div>
        <span className="text-white text-sm font-medium">to</span>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-300">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToChange(e.target.value)}
            className="flex-1 border-none outline-none text-sm"
          />
        </div>
      </div>
    </div>
  )
}

// Autocomplete Filter
interface AutocompleteFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
  onSearch?: (query: string) => void
}

export function AutocompleteFilter({ 
  label, 
  value, 
  onChange, 
  suggestions,
  placeholder,
  onSearch
}: AutocompleteFilterProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      )
      setFiltered(filtered)
    } else {
      setFiltered(suggestions)
    }
  }, [value, suggestions])

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="relative">
        <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2.5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setShowSuggestions(true)
              onSearch?.(e.target.value)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="flex-1 border-none outline-none text-sm"
          />
        </div>
        
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(item)
                  setShowSuggestions(false)
                }}
                className="px-4 py-2.5 hover:bg-pink-100 cursor-pointer text-sm transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Dropdown Filter
interface DropdownFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

export function DropdownFilter({ label, value, onChange, options }: DropdownFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}

// Month/Year Picker
interface MonthYearPickerProps {
  month: string
  year: string
  onMonthChange: (value: string) => void
  onYearChange: (value: string) => void
  label?: string
}

export function MonthYearPicker({ 
  month, 
  year, 
  onMonthChange, 
  onYearChange,
  label = 'Month/Year'
}: MonthYearPickerProps) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Select Month</option>
            {months.map((m, idx) => (
              <option key={idx} value={(idx + 1).toString()}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        
        <div className="flex-1 relative">
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

// Export Button
interface ExportButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function ExportButton({ onClick, loading = false, disabled = false }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Exporting...' : 'Export to Excel'}
    </button>
  )
}

// View Details Button
interface ViewButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function ViewButton({ onClick, loading = false, disabled = false }: ViewButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
    >
      {loading ? 'Loading...' : 'View Details'}
    </button>
  )
}

// Data Table
interface Column {
  header: string
  key: string
  width?: number
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
}

export function DataTable({ columns, data, loading = false }: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading data...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-600 text-lg">No data found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                >
                  {row[col.key] !== null && row[col.key] !== undefined 
                    ? String(row[col.key]) 
                    : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Loading Spinner
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
}

// Error Message
interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-600 font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}