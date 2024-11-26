import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAuth } from '../context/AuthContext'
import config from '../config/config'

export function SearchResult({ result, onAddToList }) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const toggleAccordion = () => setIsOpen(!isOpen)

  const handleDDGSearch = () => {
    const searchQuery = encodeURIComponent(`${result.Destination} ${result.Country}`);
    window.open(`https://duckduckgo.com/?q=${searchQuery}`, '_blank');
  };

  useEffect(() => {
    if (isOpen && mapRef.current && !mapInstanceRef.current) {
      const initMap = async () => {
        try {
          const response = await fetch(`${config.api.baseUrl}/api/destinations/${result._id}/coordinates`)
          const coords = await response.json()
          
          const map = L.map(mapRef.current).setView([coords.Latitude, coords.Longitude], 13)
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map)
          
          L.marker([coords.Latitude, coords.Longitude]).addTo(map)
          mapInstanceRef.current = map
        } catch (error) {
          console.error('Error loading map:', error)
        }
      }
      
      initMap()
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isOpen, result._id])

  return (
    <div className="border rounded-lg mb-4">
      <button 
        onClick={toggleAccordion}
        className="flex items-center justify-between w-full p-5 text-left font-medium text-gray-500 border-b border-gray-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        <span>{result.Destination} ({result.Country}, {result.Region})</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-5 bg-gray-50 text-gray-700 space-y-2 text-left">
          <p><strong>Destination:</strong> {result.Destination}</p>
          <p><strong>Country:</strong> {result.Country}</p>
          <p><strong>Region:</strong> {result.Region}</p>
          <p><strong>ID:</strong> {result._id}</p>
          <p><strong>Category:</strong> {result.Category}</p>
          <p><strong>Latitude:</strong> {result.Latitude}</p>
          <p><strong>Longitude:</strong> {result.Longitude}</p>
          <p><strong>Approximate Annual Tourists:</strong> {result['Approximate Annual Tourists']}</p>
          <p><strong>Currency:</strong> {result.Currency}</p>
          <p><strong>Majority Religion:</strong> {result['Majority Religion']}</p>
          <p><strong>Famous Foods:</strong> {result['Famous Foods']}</p>
          <p><strong>Language:</strong> {result.Language}</p>
          <p><strong>Best Time to Visit:</strong> {result['Best Time to Visit']}</p>
          <p><strong>Cost of Living:</strong> {result['Cost of Living']}</p>
          <p><strong>Safety:</strong> {result.Safety}</p>
          <p><strong>Cultural Significance:</strong> {result['Cultural Significance']}</p>
          <p><strong>Description:</strong> {result.Description}</p>
          <div 
            ref={mapRef} 
            className="w-full h-[300px] mt-4 rounded-lg"
          />
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDDGSearch}
              className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Search on DuckDuckGo
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => onAddToList(result)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Add to List
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
