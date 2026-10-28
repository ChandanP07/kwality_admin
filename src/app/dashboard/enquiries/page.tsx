'use client'

// app/dashboard/enquiries/page.tsx
// Admin view of all enquiries submitted via the client app's landing page.
// Admin can update status to track the sales pipeline.

import { useState, useEffect, useCallback } from 'react'
import { Mail, Search, RefreshCw, X, Phone, Building2, Printer } from 'lucide-react'

interface Enquiry {
  id: string
  createdAt: string
  name: string
  email: string
  phone: string
  company: string
  printerName: string
  message: string
  status: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:       { label: 'New',       color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-800' },
  closed:    { label: 'Closed',    color: 'bg-gray-100 text-gray-600' },
}

const STATUSES = Object.keys(STATUS_CONFIG)

export default function EnquiriesPage() {
  const [enquiries, setEnquiries]   = useState<Enquiry[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [selected, setSelected]     = useState<Enquiry | null>(null)
  const [updating, setUpdating]     = useState<string | null>(null)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search)       params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admin/enquiries?${params}`)
      if (res.ok) setEnquiries(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    const t = setTimeout(fetchEnquiries, 300)
    return () => clearTimeout(t)
  }, [fetchEnquiries])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      }
    } finally {
      setUpdating(null)
    }
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = enquiries.filter(e => e.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="h-6 w-6 text-indigo-600" />
          Enquiries
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Leads from the client portal landing page — {enquiries.length} total
        </p>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-4 gap-4">
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setStatus(statusFilter === s ? '' : s)}
              className={`rounded-xl p-4 text-left border-2 transition-all ${
                statusFilter === s ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-white hover:border-gray-200'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{counts[s] ?? 0}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${cfg.color}`}>
                {cfg.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatus('') }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Two-column layout: list + detail */}
      <div className="flex gap-4" style={{ minHeight: 480 }}>
        {/* List */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No enquiries yet</p>
              <p className="text-gray-400 text-xs mt-1">Leads from the landing page will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
              {enquiries.map(e => {
                const cfg = STATUS_CONFIG[e.status] ?? STATUS_CONFIG.new
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${selected?.id === e.id ? 'bg-indigo-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{e.name}</p>
                        <p className="text-sm text-gray-500 truncate">{e.company || e.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {e.printerName && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Printer className="h-3 w-3" /> {e.printerName}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="w-96 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Enquiry Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selected.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selected.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-indigo-600 hover:underline truncate">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href={`tel:${selected.phone}`} className="hover:underline">{selected.phone}</a>
                  </div>
                  {selected.company && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                      {selected.company}
                    </div>
                  )}
                  {selected.printerName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Printer className="h-4 w-4 text-gray-400 shrink-0" />
                      Interested in: {selected.printerName}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Status update */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s]
                    const isActive = selected.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={isActive || updating === selected.id}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                          isActive
                            ? `${cfg.color} border-transparent cursor-default`
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {updating === selected.id && !isActive ? '...' : cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-96 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Mail className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Select an enquiry to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}