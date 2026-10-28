'use client'
import { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import newComplaintConfig from '@/config/new-complaint-config'

export default function NewComplaintForm() {
  // Form state - all 10 fields
  const [clientName, setClientName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [location, setLocation] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [printerModel, setPrinterModel] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [printerProblem, setPrinterProblem] = useState('')
  const [comments, setComments] = useState('')

  // Autocomplete state
  const [showClientSuggestions, setShowClientSuggestions] = useState(false)
  const [clientSuggestions, setClientSuggestions] = useState<string[]>([])

  // Cascading dropdown data
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [availableSerialNumbers, setAvailableSerialNumbers] = useState<string[]>([])

  // Modal state for printer details
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPrinterDetails, setSelectedPrinterDetails] = useState<any>(null)

  // Loading state
  const [loading, setLoading] = useState(false)

  // Update client suggestions
  useEffect(() => {
    if (clientName) {
      const filtered = newComplaintConfig.clientSuggestions.filter(c => 
        c.toLowerCase().includes(clientName.toLowerCase())
      )
      setClientSuggestions(filtered)
    } else {
      setClientSuggestions(newComplaintConfig.clientSuggestions)
    }
  }, [clientName])

  // Update cities when state changes
  useEffect(() => {
    if (state) {
      const cities = newComplaintConfig.citiesByState[state as keyof typeof newComplaintConfig.citiesByState] || []
      setAvailableCities(cities)
      setCity('') // Reset city
      setLocation('') // Reset location
    }
  }, [state])

  // Update locations when city changes
  useEffect(() => {
    if (city) {
      const locations = newComplaintConfig.locationsByCity[city as keyof typeof newComplaintConfig.locationsByCity] 
        || newComplaintConfig.locationsByCity.default
      setAvailableLocations(locations)
      setLocation('') // Reset location
    }
  }, [city])

  // Update serial numbers when printer model changes
  useEffect(() => {
    if (printerModel) {
      const serials = newComplaintConfig.serialNumbersByModel[printerModel as keyof typeof newComplaintConfig.serialNumbersByModel]
        || newComplaintConfig.serialNumbersByModel.default
      setAvailableSerialNumbers(serials)
      setSerialNumber('') // Reset serial number
    }
  }, [printerModel])

  const handleSerialNumberClick = (serial: string) => {
    const details = newComplaintConfig.printerDetailsBySerial[serial as keyof typeof newComplaintConfig.printerDetailsBySerial]
    if (details) {
      setSelectedPrinterDetails(details)
      setShowDetailsModal(true)
    } else {
      // Generic details if not found
      setSelectedPrinterDetails({
        serialNumber: serial,
        model: printerModel,
        location: `${city} - ${location}`,
        installDate: '2023-01-01',
        lastService: '2024-01-01',
        status: 'Active',
        pageCount: 0
      })
      setShowDetailsModal(true)
    }
  }

  const handleSubmit = async () => {
    if (!comments || comments.trim() === '') {
      alert('Please add comments before submitting')
      return
    }

    setLoading(true)
    try {
      const complaintData = {
        clientName, state, city, location, contactPerson, contactNumber,
        printerModel, serialNumber, printerProblem, comments
      }

      const res = await fetch('/api/new-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      })

      const result = await res.json()
      
      if (result.success) {
        alert('Complaint submitted successfully to system & database!')
        // Reset form
        setClientName(''); setState(''); setCity(''); setLocation('')
        setContactPerson(''); setContactNumber(''); setPrinterModel('')
        setSerialNumber(''); setPrinterProblem(''); setComments('')
      } else {
        alert('Failed to submit complaint')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d4977] p-8">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wide">NEW COMPLAINT</h1>
      <p className="text-white text-center mb-6 opacity-90">Multi-step complaint form - Submit to system & database</p>

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
                {newComplaintConfig.states.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
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

        {/* Step 4: Location - Shows after city selected */}
        {city && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Location *</label>
            <div className="relative">
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Location</option>
                {availableLocations.map((l, idx) => <option key={idx} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 5: Contact Person - Shows after location selected */}
        {location && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Contact Person *</label>
            <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Enter contact person name"
              className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        {/* Step 6: Contact Number & Printer Model - Shows after contact person entered */}
        {contactPerson && (
          <>
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Contact Number *</label>
              <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Printer Model *</label>
              <div className="relative">
                <select value={printerModel} onChange={(e) => setPrinterModel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                  <option value="">Select Printer Model</option>
                  {newComplaintConfig.printerModels.map((pm, idx) => <option key={idx} value={pm}>{pm}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Step 7: Serial Number - Shows after printer model selected */}
        {printerModel && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Serial Number *</label>
            <div className="relative">
              <select value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Serial Number</option>
                {availableSerialNumbers.map((sn, idx) => <option key={idx} value={sn}>{sn}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {serialNumber && (
              <button onClick={() => handleSerialNumberClick(serialNumber)}
                className="text-blue-400 underline hover:text-blue-300 text-sm mt-1 text-left">
                Click to view printer details
              </button>
            )}
          </div>
        )}

        {/* Step 8: Printer Problem - Shows after serial number selected */}
        {serialNumber && (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label className="text-white text-sm font-medium">Printer Problem *</label>
            <div className="relative">
              <select value={printerProblem} onChange={(e) => setPrinterProblem(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-white border appearance-none">
                <option value="">Select Problem</option>
                {newComplaintConfig.printerProblems.map((pp, idx) => <option key={idx} value={pp}>{pp}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step 9: Comments - Shows after printer problem selected */}
        {printerProblem && (
          <>
            <div className="flex flex-col gap-2 animate-fadeIn">
              <label className="text-white text-sm font-medium">Comments *</label>
              <textarea value={comments} onChange={(e) => setComments(e.target.value)}
                placeholder="Add detailed comments about the issue..." rows={4}
                className="px-4 py-2.5 rounded-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fadeIn">
              <button onClick={handleSubmit} disabled={loading}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-md disabled:opacity-50 transition-colors">
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <p className="text-white text-sm text-center mt-2 opacity-75">
                Submits complaint to system & database
              </p>
            </div>
          </>
        )}
      </div>

      {/* Printer Details Modal */}
      {showDetailsModal && selectedPrinterDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Printer Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Serial Number:</span>
                <span className="text-gray-800">{selectedPrinterDetails.serialNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Model:</span>
                <span className="text-gray-800">{selectedPrinterDetails.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Location:</span>
                <span className="text-gray-800">{selectedPrinterDetails.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Install Date:</span>
                <span className="text-gray-800">{selectedPrinterDetails.installDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Last Service:</span>
                <span className="text-gray-800">{selectedPrinterDetails.lastService}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">{selectedPrinterDetails.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold text-gray-600">Page Count:</span>
                <span className="text-gray-800">{selectedPrinterDetails.pageCount?.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => setShowDetailsModal(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}

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
