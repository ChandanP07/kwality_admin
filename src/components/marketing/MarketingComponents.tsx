'use client'
import { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'

export function TextInput({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}

export function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}

export function Dropdown({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} 
          className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
          <option value="">Select {label}</option>
          {options.map((opt: string, idx: number) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}

export function MultiSelect({ label, value, onChange, options }: any) {
  const [selected, setSelected] = useState<string[]>(value || [])
  
  const toggleSelection = (item: string) => {
    const newSelected = selected.includes(item)
      ? selected.filter(s => s !== item)
      : [...selected, item]
    setSelected(newSelected)
    onChange(newSelected)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="bg-white rounded-md p-2 border">
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selected.map((item, idx) => (
              <div key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm">{item}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSelection(item)} />
              </div>
            ))}
          </div>
        )}
        <div className="max-h-40 overflow-y-auto">
          {options.map((opt: string, idx: number) => (
            <div key={idx} 
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selected.includes(opt) ? 'bg-blue-50' : ''}`}
              onClick={() => toggleSelection(opt)}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.includes(opt)} onChange={() => {}} className="cursor-pointer" />
                <span>{opt}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ActionBtn({ onClick, label, loading, color = 'bg-green-600 hover:bg-green-700' }: any) {
  return (
    <button onClick={onClick} disabled={loading} 
      className={`px-6 py-3 ${color} text-white rounded-md font-medium disabled:opacity-50 transition-colors`}>
      {loading ? 'Processing...' : label}
    </button>
  )
}

export function DataTable({ columns, data, loading, onRowClick }: any) {
  if (loading) return <div className="bg-white rounded-lg p-12 text-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div><p className="mt-4 text-gray-600">Loading...</p></div>
  if (!data || data.length === 0) return <div className="bg-white rounded-lg p-12 text-center"><p className="text-gray-600 text-lg">No data found</p></div>

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2">
          <tr>
            {columns.map((col: any) => (
              <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx: number) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              {columns.map((col: any) => (
                <td key={col.key} className="px-4 py-3 text-sm">
                  {col.type === 'link' ? (
                    <a href="#" onClick={() => onRowClick?.(row, col.key)} className="text-blue-600 underline hover:text-blue-800">{row[col.key] || '-'}</a>
                  ) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
