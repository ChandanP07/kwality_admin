// Location: src/components/mis/MonthYearPicker.tsx
// Description: Month and Year dropdown selectors for MIS reports

'use client'

interface MonthYearPickerProps {
  fromMonth: string
  fromYear: string
  toMonth: string
  toYear: string
  onFromMonthChange: (month: string) => void
  onFromYearChange: (year: string) => void
  onToMonthChange: (month: string) => void
  onToYearChange: (year: string) => void
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString())

export default function MonthYearPicker({
  fromMonth,
  fromYear,
  toMonth,
  toYear,
  onFromMonthChange,
  onFromYearChange,
  onToMonthChange,
  onToYearChange
}: MonthYearPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">From</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={fromMonth}
            onChange={(e) => onFromMonthChange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={fromYear}
            onChange={(e) => onFromYearChange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">To</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={toMonth}
            onChange={(e) => onToMonthChange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={toYear}
            onChange={(e) => onToYearChange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
