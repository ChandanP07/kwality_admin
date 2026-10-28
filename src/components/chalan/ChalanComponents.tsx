// Location: src/components/chalan/ChalanComponents.tsx
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search, Download, ChevronDown } from 'lucide-react'

export function TextFilter({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export function DateRangePicker({ fromDate, toDate, onFromChange, onToChange, label = 'Date Range' }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input type="date" value={fromDate} onChange={(e) => onFromChange(e.target.value)} className="flex-1 border-none outline-none" />
        </div>
        <span className="text-white">to</span>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input type="date" value={toDate} onChange={(e) => onToChange(e.target.value)} className="flex-1 border-none outline-none" />
        </div>
      </div>
    </div>
  )
}

export function AutocompleteFilter({ label, value, onChange, suggestions, placeholder }: any) {
  const [show, setShow] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const f = suggestions.filter((i: string) => i.toLowerCase().includes(value.toLowerCase()))
      setFiltered(f)
    } else {
      setFiltered(suggestions)
    }
  }, [value, suggestions])

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="relative">
        <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2.5 border">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => { onChange(e.target.value); setShow(true) }}
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 200)}
            placeholder={placeholder}
            className="flex-1 border-none outline-none"
          />
        </div>
        {show && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border">
            {filtered.map((item: string, idx: number) => (
              <div
                key={idx}
                onClick={() => { onChange(item); setShow(false) }}
                className="px-4 py-2.5 hover:bg-pink-100 cursor-pointer"
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

export function DropdownFilter({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
          {options.map((opt: string, idx: number) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}

export function MonthYearPicker({ month, year, onMonthChange, onYearChange, label = 'Month/Year' }: any) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="flex gap-3">
        <select value={month} onChange={(e) => onMonthChange(e.target.value)} className="flex-1 px-4 py-2.5 rounded-md bg-white border">
          <option value="">Select Month</option>
          {months.map((m, idx) => <option key={idx} value={(idx + 1).toString()}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => onYearChange(e.target.value)} className="flex-1 px-4 py-2.5 rounded-md bg-white border">
          <option value="">Select Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  )
}

export function ExportButton({ onClick, loading = false }: any) {
  return (
    <button onClick={onClick} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-50">
      <Download className="w-4 h-4" />
      {loading ? 'Exporting...' : 'Export to Excel'}
    </button>
  )
}

export function ViewButton({ onClick, loading = false }: any) {
  return (
    <button onClick={onClick} disabled={loading} className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-md disabled:opacity-50">
      {loading ? 'Loading...' : 'View Details'}
    </button>
  )
}

export function DataTable({ columns, data, loading = false }: any) {
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
            {columns.map((col: any) => (
              <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx: number) => (
            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
              {columns.map((col: any) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {row[col.key] !== null && row[col.key] !== undefined ? String(row[col.key]) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
