// Location: src/components/mis/DateRangePicker.tsx
// Description: Reusable date range picker component for MIS reports

'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface DateRangePickerProps {
  fromDate: string
  toDate: string
  onFromDateChange: (date: string) => void
  onToDateChange: (date: string) => void
  label?: string
}

export default function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  label = 'Date Range'
}: DateRangePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs text-gray-300 mb-1">From</label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-300 mb-1">To</label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
