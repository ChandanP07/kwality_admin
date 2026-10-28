// components/admin/EditCityComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Edit2, Save, X, MapPin, Trash2, Plus } from 'lucide-react'

interface City {
  id: string
  name: string
  state: string
  country: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export function EditCityComponent() {
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<City | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load cities on component mount
  useEffect(() => {
    loadCities()
  }, [])

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(cities)
    } else {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered)
    }
  }, [searchTerm, cities])

  const loadCities = async () => {
    try {
      const response = await fetch('/api/admin/cities')
      const data = await response.json()
      
      if (response.ok) {
        setCities(data.cities || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load cities' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCity = (city: City) => {
    setSelectedCity(city)
    setEditData({ ...city })
    setEditMode(false)
  }

  const handleSaveChanges = async () => {
    if (!editData) return

    try {
      const response = await fetch('/api/admin/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'City updated successfully!' })
        setSelectedCity(editData)
        setEditMode(false)
        loadCities() // Refresh the city list
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update city' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    }
  }

  const handleDeleteCity = async () => {
    if (!selectedCity) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/cities?id=${selectedCity.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'City deleted successfully!' })
        setSelectedCity(null)
        setShowDeleteDialog(false)
        loadCities()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete city' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setDeleting(false)
    }
  }

  // Group cities by state for better organization
  const citiesByState = filteredCities.reduce((acc, city) => {
    if (!acc[city.state]) {
      acc[city.state] = []
    }
    acc[city.state].push(city)
    return acc
  }, {} as Record<string, City[]>)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading cities...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-start">
            <MapPin className={`h-5 w-5 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'} mr-2 mt-0.5`} />
            <div className="flex-1">{message.text}</div>
            <button 
              onClick={() => setMessage(null)}
              className="text-lg font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City List */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Select City/State to Edit
            </h3>
            <div className="text-sm text-gray-600">
              {filteredCities.length} cities
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cities, states, or countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* City List - Grouped by State */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.keys(citiesByState).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No cities found</p>
            ) : (
              Object.entries(citiesByState).map(([state, stateCities]) => (
                <div key={state} className="space-y-2">
                  <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
                    {state} ({stateCities.length})
                  </h4>
                  {stateCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCity?.id === city.id 
                          ? 'bg-purple-100 border-2 border-purple-500' 
                          : 'bg-white border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-gray-600">{city.state}, {city.country}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              city.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {city.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <Edit2 className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* City Details */}
        <div className="bg-white rounded-lg border p-6">
          {selectedCity ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">City Details</h3>
                <div className="flex space-x-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setEditData({ ...selectedCity })
                        }}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editMode && editData ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City Name *
                    </label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={editData.state || ''}
                      onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={editData.country || ''}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isActive || false}
                        onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active City</span>
                    </label>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">City Name</p>
                      <p className="text-lg">{selectedCity.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="text-lg">{selectedCity.state}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Country</p>
                      <p className="text-lg">{selectedCity.country}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                        selectedCity.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCity.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {selectedCity.createdAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-lg">
                        {new Date(selectedCity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">No City Selected</p>
              <p>Select a city from the list to view and edit details</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Delete City</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedCity.name}, {selectedCity.state}</strong>?
                <br /><br />
                This action cannot be undone and may affect existing clients using this city.
              </p>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCity}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}