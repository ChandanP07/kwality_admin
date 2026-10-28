'use client'
import { useState, useEffect } from 'react'
import { Search, Calendar } from 'lucide-react'

export function TextInput({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}

export function DateRange({ fromDate, toDate, onFromChange, onToChange, label = 'Date Range' }: any) {
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
                    <a href="#" onClick={() => onRowClick?.(row)} className="text-blue-600 underline hover:text-blue-800">{row[col.key] || '-'}</a>
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
