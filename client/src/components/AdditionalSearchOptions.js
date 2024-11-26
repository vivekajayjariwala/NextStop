import { useState } from 'react'
import config from '../config/config';

export function AdditionalSearchOptions() {
  const [destinationDetails, setDestinationDetails] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [countries, setCountries] = useState(null)
  
  const getDestinationDetails = async (e) => {
    e.preventDefault()
    const destinationId = e.target.destinationId.value.trim()
    if (!destinationId) return
    
    try {
      const response = await fetch(`${config.api.baseUrl}/api/destinations/${destinationId}`)
      if (!response.ok) throw new Error('Destination not found')
      const data = await response.json()
      setDestinationDetails(data)
    } catch (error) {
      setDestinationDetails({ error: error.message })
    }
  }

  const getDestinationCoordinates = async (e) => {
    e.preventDefault()
    const destinationId = e.target.coordinateId.value.trim()
    if (!destinationId) return
    
    try {
      const response = await fetch(`http://localhost:3000/api/destinations/${destinationId}/coordinates`)
      if (!response.ok) throw new Error('Coordinates not found')
      const data = await response.json()
      setCoordinates(data)
    } catch (error) {
      setCoordinates({ error: error.message })
    }
  }

  const getAllCountries = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/destinations/countries')
      if (!response.ok) throw new Error('Countries not found')
      const data = await response.json()
      setCountries(data.countries)
    } catch (error) {
      setCountries({ error: error.message })
    }
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-center mb-8">Additional Search Options</h2>
      
      <div className="space-y-8 max-w-xl mx-auto">
        {/* Destination Details Search */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Get Destination Details</h3>
          <form onSubmit={getDestinationDetails} className="space-y-4">
            <input
              type="text"
              name="destinationId"
              placeholder="Enter Destination ID"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
          {destinationDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              {destinationDetails.error ? (
                <p className="text-red-600">{destinationDetails.error}</p>
              ) : (
                <div className="space-y-2">
                  <p><strong>Destination:</strong> {destinationDetails.Destination}</p>
                  <p><strong>Country:</strong> {destinationDetails.Country}</p>
                  <p><strong>Region:</strong> {destinationDetails.Region}</p>
                  <p><strong>Category:</strong> {destinationDetails.Category}</p>
                  <p><strong>Latitude:</strong> {destinationDetails.Latitude}</p>
                  <p><strong>Longitude:</strong> {destinationDetails.Longitude}</p>
                  <p><strong>Approximate Annual Tourists:</strong> {destinationDetails['Approximate Annual Tourists']}</p>
                  <p><strong>Currency:</strong> {destinationDetails.Currency}</p>
                  <p><strong>Majority Religion:</strong> {destinationDetails['Majority Religion']}</p>
                  <p><strong>Famous Foods:</strong> {destinationDetails['Famous Foods']}</p>
                  <p><strong>Language:</strong> {destinationDetails.Language}</p>
                  <p><strong>Best Time to Visit:</strong> {destinationDetails['Best Time to Visit']}</p>
                  <p><strong>Cost of Living:</strong> {destinationDetails['Cost of Living']}</p>
                  <p><strong>Safety:</strong> {destinationDetails.Safety}</p>
                  <p><strong>Cultural Significance:</strong> {destinationDetails['Cultural Significance']}</p>
                  <p><strong>Description:</strong> {destinationDetails.Description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coordinates Search */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Get Destination Coordinates</h3>
          <form onSubmit={getDestinationCoordinates} className="space-y-4">
            <input
              type="text"
              name="coordinateId"
              placeholder="Enter Destination ID"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
          {coordinates && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              {coordinates.error ? (
                <p className="text-red-600">{coordinates.error}</p>
              ) : (
                <div className="space-y-2">
                  <p><strong>Latitude:</strong> {coordinates.Latitude}</p>
                  <p><strong>Longitude:</strong> {coordinates.Longitude}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Countries List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Available Countries</h3>
          <button
            onClick={getAllCountries}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Show All Countries
          </button>
          {countries && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              {countries.error ? (
                <p className="text-red-600">{countries.error}</p>
              ) : (
                <p>{countries.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 