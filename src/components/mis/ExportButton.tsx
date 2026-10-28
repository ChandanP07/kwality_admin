// Location: src/components/mis/ExportButton.tsx
// Description: Button component for exporting data to Excel

'use client'

import { Download, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  label?: string
}

export default function ExportButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Export to Excel'
}: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          {label}
        </>
      )}
    </button>
  )
}
