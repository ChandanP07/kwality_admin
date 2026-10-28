'use client'

import { useState, useEffect, useCallback } from 'react'
import complaintsScreens from '@/config/complaints-config'
import { TextInput, DateRange, ActionBtn, DataTable } from './ComplaintsComponents'
import { X, User, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'OPEN',        label: 'Open',        color: 'bg-blue-100 text-blue-800' },
  { value: 'ASSIGNED',    label: 'Assigned',    color: 'bg-yellow-100 text-yellow-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'RESOLVED',    label: 'Resolved',    color: 'bg-green-100 text-green-800' },
  { value: 'CLOSED',      label: 'Closed',      color: 'bg-gray-100 text-gray-700' },
]

export default function UniversalComplaintsPage({ screenId }: { screenId: string }) {
  const config = complaintsScreens[screenId]

  const [filters, setFilters]             = useState<Record<string, any>>({})
  const [data, setData]                   = useState<any[]>([])
  const [rawData, setRawData]             = useState<any[]>([]) // ungrouped for pending drill-down
  const [loading, setLoading]             = useState(false)
  const [selected, setSelected]           = useState<any | null>(null)  // complaint in modal
  const [drillDown, setDrillDown]         = useState<any | null>(null)  // engineer drill-down for pending
  const [updating, setUpdating]           = useState(false)
  const [updateForm, setUpdateForm]       = useState({
    status:       '',
    assignedToId: '',
    resolution:   '',
    callLog:      '',
    callDone:     false,
  })
  const [adminUsers, setAdminUsers]       = useState<any[]>([])

  if (!config) {
    return (
      <div className="min-h-screen bg-[#3d4977] p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600">Screen Not Found</h2>
        </div>
      </div>
    )
  }

  // Fetch admin/staff users for assignment dropdown
  useEffect(() => {
    fetch('/api/users?role=ADMIN,MANAGER,EMPLOYEE')
      .then(r => r.json())
      .then(d => setAdminUsers(Array.isArray(d) ? d : d.users ?? []))
      .catch(() => {})
  }, [])

  // Init filters
  useEffect(() => {
    const init: Record<string, any> = {}
    config.filters?.forEach((f: any) => {
      if (f.type === 'daterange') { init.fromDate = ''; init.toDate = '' }
      else init[f.name] = ''
    })
    setFilters(init)
  }, [config])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)) })

      const res    = await fetch(`/api/complaints/${screenId}?${params}`)
      const result = await res.json()
      setData(result.data  ?? [])
      setRawData(result.raw ?? result.data ?? [])
    } catch {
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [filters, screenId])

  const handleAction = async (action: string) => {
    if (['refresh', 'search', 'viewComplaints'].includes(action)) {
      await fetchData()
    }
  }

  // Row click — for pending screen show engineer's complaints, else open detail modal
  const handleRowClick = (row: any) => {
    if (screenId === 'pending' && row.complaints) {
      setDrillDown(row) // show engineer's complaint list
    } else {
      openModal(row)
    }
  }

  const openModal = (row: any) => {
    setSelected(row)
    setUpdateForm({
      status:       row.status      ?? '',
      assignedToId: row.engineerId  ?? '',
      resolution:   row.resolution  ?? '',
      callLog:      '',
      callDone:     false,
    })
  }

  const handleUpdate = async () => {
    if (!selected?.dbId) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/complaints/${selected.dbId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status:       updateForm.status       || undefined,
          assignedToId: updateForm.assignedToId || undefined,
          resolution:   updateForm.resolution   || undefined,
          callLog: updateForm.callLog.trim() ? {
            details:   updateForm.callLog,
            callDone:  updateForm.callDone,
          } : undefined,
        }),
      })

      if (res.ok) {
        setSelected(null)
        setDrillDown(null)
        await fetchData()
      } else {
        alert('Failed to update complaint')
      }
    } catch {
      alert('Network error')
    } finally {
      setUpdating(false)
    }
  }

  const statusColor = (s: string) =>
    STATUS_OPTIONS.find(o => o.value === s)?.color ?? 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">
        {config.title.toUpperCase()}
      </h1>
      {config.description && (
        <p className="text-white text-center mb-6 opacity-90">{config.description}</p>
      )}

      {/* ── Filters ── */}
      <div className="max-w-5xl mx-auto bg-[#2d3967] p-6 rounded-lg shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.filters?.map((f: any) => {
            if (f.type === 'text')
              return (
                <TextInput
                  key={f.name} label={f.label}
                  value={filters[f.name] || ''}
                  onChange={(v: string) => setFilters({ ...filters, [f.name]: v })}
                  placeholder={f.placeholder}
                />
              )
            if (f.type === 'daterange')
              return (
                <DateRange
                  key={f.name} label={f.label}
                  fromDate={filters.fromDate || ''} toDate={filters.toDate || ''}
                  onFromChange={(v: string) => setFilters({ ...filters, fromDate: v })}
                  onToChange={(v: string)   => setFilters({ ...filters, toDate: v })}
                />
              )
            return null
          })}
        </div>
        {config.actions && (
          <div className="mt-6 flex gap-4 flex-wrap">
            {config.actions.map((a: any, i: number) => (
              <ActionBtn
                key={i} label={a.label} loading={loading}
                onClick={() => handleAction(a.action)}
                color={a.action === 'viewComplaints'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Data table ── */}
      {data.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <DataTable
            columns={config.columns}
            data={data}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="max-w-xl mx-auto bg-white/10 rounded-xl p-8 text-center text-white">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No complaints found</p>
          <p className="text-sm opacity-70 mt-1">
            {screenId === 'pending' ? 'All caught up!' : 'Try adjusting your filters'}
          </p>
        </div>
      )}

      {/* ══ Engineer drill-down modal (pending screen) ══ */}
      {drillDown && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {drillDown.engineerName}'s Complaints
                </h2>
                <p className="text-sm text-gray-500">
                  {drillDown.totalComplaints} pending
                </p>
              </div>
              <button onClick={() => setDrillDown(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 divide-y">
              {drillDown.complaints.map((c: any) => (
                <button
                  key={c.dbId}
                  onClick={() => { setDrillDown(null); openModal(c) }}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-medium text-indigo-600">{c.complaintId}</p>
                      <p className="font-semibold text-gray-900 mt-0.5">{c.title}</p>
                      <p className="text-sm text-gray-500">{c.clientName} · {c.date}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ Complaint detail + update modal ══ */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <p className="font-mono text-xs text-indigo-600 font-medium">{selected.complaintId}</p>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 text-sm">
                <div><p className="text-gray-500">Client</p><p className="font-semibold text-gray-900">{selected.clientName}</p></div>
                <div><p className="text-gray-500">Category</p><p className="font-semibold text-gray-900">{selected.category}</p></div>
                <div><p className="text-gray-500">Priority</p><p className="font-semibold text-gray-900">{selected.priority}</p></div>
                <div><p className="text-gray-500">Reported</p><p className="font-semibold text-gray-900">{selected.date}</p></div>
                <div><p className="text-gray-500">Contact</p><p className="font-semibold text-gray-900">{selected.contactPerson}</p></div>
                <div><p className="text-gray-500">Phone</p><p className="font-semibold text-gray-900">{selected.contactNumber}</p></div>
              </div>

              {/* Description */}
              {selected.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.description}</p>
                </div>
              )}

              {/* Current status badge */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Status:</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(selected.status)}`}>
                  {selected.status}
                </span>
              </div>

              {/* ── Update form ── */}
              <div className="border border-indigo-100 rounded-xl p-4 space-y-4 bg-indigo-50/30">
                <p className="text-sm font-bold text-gray-700">Update Complaint</p>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Status</label>
                  <select
                    value={updateForm.status}
                    onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option value="">— Keep current —</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Assign engineer */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <User className="inline h-3 w-3 mr-1" />Assign To
                  </label>
                  <select
                    value={updateForm.assignedToId}
                    onChange={e => setUpdateForm({ ...updateForm, assignedToId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option value="">— Unassigned —</option>
                    {adminUsers.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name ?? u.username} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resolution */}
                {['RESOLVED', 'CLOSED'].includes(updateForm.status) && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      <CheckCircle className="inline h-3 w-3 mr-1" />Resolution Notes
                    </label>
                    <textarea
                      rows={2}
                      value={updateForm.resolution}
                      onChange={e => setUpdateForm({ ...updateForm, resolution: e.target.value })}
                      placeholder="Describe how the complaint was resolved..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none bg-white"
                    />
                  </div>
                )}

                {/* Call log */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <MessageSquare className="inline h-3 w-3 mr-1" />Add Call Log / Note
                  </label>
                  <textarea
                    rows={2}
                    value={updateForm.callLog}
                    onChange={e => setUpdateForm({ ...updateForm, callLog: e.target.value })}
                    placeholder="e.g. Called client, technician visit scheduled for tomorrow..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none bg-white"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateForm.callDone}
                      onChange={e => setUpdateForm({ ...updateForm, callDone: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-xs text-gray-600">Mark call as done</span>
                  </label>
                </div>
              </div>

              {/* Existing call logs */}
              {selected.callLogs?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <Clock className="inline h-3 w-3 mr-1" />Call Log History
                  </p>
                  <div className="space-y-2">
                    {selected.callLogs.map((log: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{log.loggedBy ?? 'Admin'}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(log.callDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-gray-600">{log.details}</p>
                        {log.callDone && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" /> Done
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {updating
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  : 'Save Changes'
                }
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}