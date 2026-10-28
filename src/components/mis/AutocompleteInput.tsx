// Location: src/components/mis/AutocompleteInput.tsx
// Description: Autocomplete search input with dropdown suggestions

'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  label: string
  placeholder?: string
}

export default function AutocompleteInput({
  value,
  onChange,
  suggestions,
  label,
  placeholder = 'Search...'
}: AutocompleteInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }
  }, [value, suggestions])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-white mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && setShowSuggestions(filteredSuggestions.length > 0)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                onChange(suggestion)
                setShowSuggestions(false)
              }}
              className="px-4 py-2 hover:bg-pink-100 cursor-pointer transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
