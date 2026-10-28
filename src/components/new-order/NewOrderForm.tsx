'use client'
import { useState, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import newOrderConfig from '@/config/new-order-config'

export default function NewOrderForm() {
  // Form state - all 11 fields
  const [clientName, setClientName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [branch, setBranch] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [orderType, setOrderType] = useState('')
  const [printerModel, setPrinterModel] = useState('')
  const [type, setType] = useState('')
  const [cartridgeModelType, setCartridgeModelType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [comments, setComments] = useState('')

  // Autocomplete state
  const [showClientSuggestions, setShowClientSuggestions] = useState(false)
  const [clientSuggestions, setClientSuggestions] = useState<string[]>([])
  
  // Searchable printer model state
  const [printerSearch, setPrinterSearch] = useState('')
  const [showPrinterSuggestions, setShowPrinterSuggestions] = useState(false)
  const [printerSuggestions, setPrinterSuggestions] = useState<string[]>([])

  // Cascading dropdown data
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableBranches, setAvailableBranches] = useState<string[]>([])

  // Loading state
  const [loading, setLoading] = useState(false)

  // Update client suggestions
  useEffect(() => {
    if (clientName) {
      const filtered = newOrderConfig.clientSuggestions.filter(c => 
        c.toLowerCase().includes(clientName.toLowerCase())
      )
      setClientSuggestions(filtered)
    } else {
      setClientSuggestions(newOrderConfig.clientSuggestions)
    }
  }, [clientName])

  // Update cities when state changes
  useEffect(() => {
    if (state) {
      const cities = newOrderConfig.citiesByState[state as keyof typeof newOrderConfig.citiesByState] || []
      setAvailableCities(cities)
      setCity('') // Reset city
      setBranch('') // Reset branch
    }
  }, [state])

  // Update branches when city changes
  useEffect(() => {
    if (city) {
      const branches = newOrderConfig.branchesByCity[city as keyof typeof newOrderConfig.branchesByCity] 
        || newOrderConfig.branchesByCity.default
      setAvailableBranches(branches)
      setBranch('') // Reset branch
    }
  }, [city])

  // Update printer suggestions
  useEffect(() => {
    if (printerSearch) {
      const filtered = newOrderConfig.printerModels.filter(p => 
        p.toLowerCase().includes(printerSearch.toLowerCase())
      )
      setPrinterSuggestions(filtered)
    } else {
      setPrinterSuggestions(newOrderConfig.printerModels)
    }
  }, [printerSearch])

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      alert('Please enter valid quantity')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        clientName, state, city, branch, contactPerson, contactNumber,
        orderType, printerModel, type, cartridgeModelType, quantity, poNumber, comments
      }

      const res = await fetch('/api/new-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await res.json()
      
      if (result.success) {
        alert('Order submitted successfully to system & database!')
        // Reset form
        setClientName(''); setState(''); setCity(''); setBranch('')
        setContactPerson(''); setContactNumber(''); setOrderType('')
        setPrinterModel(''); setType(''); setCartridgeModelType('')
        setQuantity(''); setPoNumber(''); setComments('')
        setPrinterSearch('')
      } else {
        alert('Failed to submit order')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">NEW ORDER</h1>
      <p className="text-white text-center mb-6 opacity-90">Multi-step order form - Submit to system & database</p>

      <div className="max-w-3xl mx-auto bg-[#2d3967] p-8 rounded-lg shadow-xl space-y-6">
        
        {/* Step 1: Client Name - Autocomplete */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-medium">Client Name *</label>
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2.5 border">
              <Search className="w-4 h-4 text-gray-500" />
              <input type="text" value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onFocus={() => setShowClientSuggestions(true)}
                onBlur={() => setTimeout(() => setShowClientSuggestions(false), 200)}
                placeholder="Search and select client"
                className="flex-1 border-none outline-none" />
            </div>
            {showClientSuggestions && clientSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border">
                {clientSuggestions.map((client, idx) => (
                  <div key={idx} onClick={() => { setClientName(client); setShowClientSuggestions(false) }}
                    className="px-4 py-2.5 hover:bg-pink-100 cursor-pointer">{client}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: State - Shows after client selected */}
        {clientName && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">State (India Only) *</label>
            <div className="relative">
              <select value={state} onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select State</option>
                {newOrderConfig.states.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 3: City - Shows after state selected */}
        {state && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">City *</label>
            <div className="relative">
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select City</option>
                {availableCities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 4: Branch - Shows after city selected */}
        {city && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Branch *</label>
            <div className="relative">
              <select value={branch} onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Branch</option>
                {availableBranches.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 5: Contact Person - Shows after branch selected */}
        {branch && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Contact Person *</label>
            <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Enter contact person name"
              className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        {/* Step 6: Contact Number & Order Type - Shows after contact person entered */}
        {contactPerson && (
          <>
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Contact Number *</label>
              <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Order Type *</label>
              <div className="relative">
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                  <option value="">Select Order Type</option>
                  {newOrderConfig.orderTypes.map((ot, idx) => <option key={idx} value={ot}>{ot}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Step 7: Printer Model - Searchable - Shows after order type selected */}
        {orderType && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Printer / Cartridge Model *</label>
            <div className="relative">
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2.5 border">
                <Search className="w-4 h-4 text-gray-500" />
                <input type="text" value={printerSearch}
                  onChange={(e) => { setPrinterSearch(e.target.value); setPrinterModel('') }}
                  onFocus={() => setShowPrinterSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPrinterSuggestions(false), 200)}
                  placeholder="Search printer model"
                  className="flex-1 border-none outline-none" />
              </div>
              {showPrinterSuggestions && printerSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border">
                  {printerSuggestions.map((model, idx) => (
                    <div key={idx} onClick={() => { setPrinterModel(model); setPrinterSearch(model); setShowPrinterSuggestions(false) }}
                      className="px-4 py-2.5 hover:bg-pink-100 cursor-pointer">{model}</div>
                  ))}
                </div>
              )}
            </div>
            {printerModel && <p className="text-green-400 text-sm">Selected: {printerModel}</p>}
          </div>
        )}

        {/* Step 8: Type BLACK or COLOR - Shows after printer model selected */}
        {printerModel && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Type *</label>
            <div className="relative">
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Type</option>
                {newOrderConfig.types.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 9: Cartridge Model Type - Shows after type selected */}
        {type && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Cartridge Model Type *</label>
            <div className="relative">
              <select value={cartridgeModelType} onChange={(e) => setCartridgeModelType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Cartridge Model Type</option>
                {newOrderConfig.cartridgeModelTypes.map((cmt, idx) => <option key={idx} value={cmt}>{cmt}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 10: Quantity, PO Number, Comments - Shows after cartridge type selected */}
        {cartridgeModelType && (
          <>
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Quantity *</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity" min="1"
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">PO Number</label>
              <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)}
                placeholder="Enter PO number (optional)"
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Comments</label>
              <textarea value={comments} onChange={(e) => setComments(e.target.value)}
                placeholder="Leave any comments (optional)" rows={3}
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fadeIn">
              <button onClick={handleSubmit} disabled={loading}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-md disabled:opacity-50 transition-colors">
                {loading ? 'Submitting...' : 'Submit Order'}
              </button>
              <p className="text-white text-sm text-center mt-2 opacity-75">
                Submits order to system & database
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
