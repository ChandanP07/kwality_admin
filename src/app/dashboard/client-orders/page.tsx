'use client'

// app/dashboard/client-orders/page.tsx
// Admin view of all orders placed by client portal users.
// Admin can update status, add tracking number, mark as dispatched/delivered.

import { useState, useEffect, useCallback } from 'react'
import {
  Package, Search, Filter, RefreshCw, Eye, Truck,
  CheckCircle, Clock, XCircle, ChevronDown, X,
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  status: string
  priority: string
  productName: string
  serialNumber: string
  modelNumber: string
  type: string
  quantity: number
  contactPerson: string
  contactNumber: string
  poNumber: string | null
  notes: string | null
  client: { id: string; companyName: string; clientCode: string; phone: string }
  dispatches: { status: string; trackingNumber: string | null; courierCompany: string | null }[]
  location: { name: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800',
  CONFIRMED:  'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  READY:      'bg-purple-100 text-purple-800',
  DISPATCHED: 'bg-orange-100 text-orange-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
}

const ORDER_STATUSES = ['PENDING','CONFIRMED','PROCESSING','READY','DISPATCHED','DELIVERED','CANCELLED']

export default function ClientOrdersPage() {
  const [orders, setOrders]           = useState<Order[]>([])
  const [total, setTotal]             = useState(0)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updating, setUpdating]       = useState(false)
  const [updateForm, setUpdateForm]   = useState({
    status: '',
    trackingNumber: '',
    courierCompany: '',
    deliveryBoy: '',
    notes: '',
  })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search)       params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      params.set('limit', '100')

      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
        setTotal(data.total)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300)
    return () => clearTimeout(t)
  }, [fetchOrders])

  const openUpdate = (order: Order) => {
    setSelectedOrder(order)
    setUpdateForm({
      status:         order.status,
      trackingNumber: order.dispatches[0]?.trackingNumber ?? '',
      courierCompany: order.dispatches[0]?.courierCompany ?? '',
      deliveryBoy:    '',
      notes:          order.notes ?? '',
    })
    setShowUpdateModal(true)
  }

  const handleUpdate = async () => {
    if (!selectedOrder) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm),
      })
      if (res.ok) {
        setShowUpdateModal(false)
        fetchOrders()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  const pendingCount    = orders.filter(o => o.status === 'PENDING').length
  const dispatchedCount = orders.filter(o => o.status === 'DISPATCHED').length
  const deliveredCount  = orders.filter(o => o.status === 'DELIVERED').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600" />
            Client Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Orders placed by client portal users — {total} total
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending',    count: pendingCount,    icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Dispatched', count: dispatchedCount, icon: Truck,        color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Delivered',  count: deliveredCount,  icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50'  },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className={`text-sm font-medium ${color}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order, client, product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('') }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">Orders placed by clients will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order #', 'Date', 'Client', 'Product', 'Qty', 'Contact', 'Status', 'Tracking', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.client?.companyName}</p>
                      <p className="text-xs text-gray-400">{order.client?.clientCode}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{order.productName}</p>
                      <p className="text-xs text-gray-400">{order.serialNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{order.quantity}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{order.contactPerson}</p>
                      <p className="text-xs text-gray-400">{order.contactNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order.dispatches[0]?.trackingNumber ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openUpdate(order)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Eye className="h-3 w-3" /> Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Update Order</h2>
                <p className="text-sm text-gray-500 font-mono">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-500">Client</p><p className="font-medium">{selectedOrder.client?.companyName}</p></div>
                <div><p className="text-gray-500">Product</p><p className="font-medium">{selectedOrder.productName}</p></div>
                <div><p className="text-gray-500">Serial #</p><p className="font-mono text-xs">{selectedOrder.serialNumber}</p></div>
                <div><p className="text-gray-500">Quantity</p><p className="font-medium">{selectedOrder.quantity}</p></div>
                <div><p className="text-gray-500">Contact</p><p className="font-medium">{selectedOrder.contactPerson}</p></div>
                <div><p className="text-gray-500">Phone</p><p className="font-medium">{selectedOrder.contactNumber}</p></div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Status</label>
                <select
                  value={updateForm.status}
                  onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Tracking (shown when dispatched or above) */}
              {['DISPATCHED','DELIVERED'].includes(updateForm.status) && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking Number</label>
                    <input
                      type="text"
                      value={updateForm.trackingNumber}
                      onChange={e => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                      placeholder="e.g. DTDC1234567890"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Courier Company</label>
                      <input
                        type="text"
                        value={updateForm.courierCompany}
                        onChange={e => setUpdateForm({ ...updateForm, courierCompany: e.target.value })}
                        placeholder="e.g. DTDC, BlueDart"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Boy</label>
                      <input
                        type="text"
                        value={updateForm.deliveryBoy}
                        onChange={e => setUpdateForm({ ...updateForm, deliveryBoy: e.target.value })}
                        placeholder="Name"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Internal Notes</label>
                <textarea
                  value={updateForm.notes}
                  onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Add notes visible to admin only..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
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