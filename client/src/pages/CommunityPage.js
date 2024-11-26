import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../context/AuthContext';
import { ListReviewForm } from '../components/ListReviewForm';
import { ListReviews } from '../components/ListReviews';
import { StarIcon } from '@heroicons/react/20/solid';
import config from '../config/config';

export default function CommunityPage() {
  const [publicLists, setPublicLists] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [expandedDestinations, setExpandedDestinations] = useState({});
  const [destinationsData, setDestinationsData] = useState({});
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const mapRefs = useRef({});
  const mapInstances = useRef({});

  useEffect(() => {
    fetchPublicLists();
  }, [isAuthenticated]);

  const fetchPublicLists = async () => {
    try {
      const endpoint = isAuthenticated 
        ? `${config.api.baseUrl}/api/lists`
        : `${config.api.baseUrl}/api/lists/public`;
      
      console.log('Fetching from endpoint:', endpoint);
        
      const response = await fetch(endpoint, {
        headers: isAuthenticated ? {
          'x-auth-token': localStorage.getItem('token')
        } : {}
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setPublicLists(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setError('Failed to load lists. Please try again later.');
      setPublicLists([]);
    }
  };

  const fetchDestinations = async (listName) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lists/${listName}/destinations`);
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      const data = await response.json();
      setDestinationsData(prev => ({
        ...prev,
        [listName]: data
      }));
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinationsData(prev => ({
        ...prev,
        [listName]: [] // Set empty array on error
      }));
    }
  };

  const toggleList = async (listName) => {
    if (!expandedLists[listName] && !destinationsData[listName]) {
      await fetchDestinations(listName);
    }
    setExpandedLists(prev => ({
      ...prev,
      [listName]: !prev[listName]
    }));
  };

  const toggleDestination = (destinationId) => {
    setExpandedDestinations(prev => ({
      ...prev,
      [destinationId]: !prev[destinationId]
    }));
  };

  // Add map initialization effect
  useEffect(() => {
    Object.entries(expandedDestinations).forEach(([destId, isExpanded]) => {
      if (isExpanded && mapRefs.current[destId] && !mapInstances.current[destId]) {
        const initMap = async () => {
          try {
            const response = await fetch(`http://localhost:3000/api/destinations/${destId}/coordinates`);
            const coords = await response.json();
            
            const map = L.map(mapRefs.current[destId]).setView([coords.Latitude, coords.Longitude], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap'
            }).addTo(map);
            
            L.marker([coords.Latitude, coords.Longitude]).addTo(map);
            mapInstances.current[destId] = map;
          } catch (error) {
            console.error('Error loading map:', error);
          }
        };
        
        initMap();
      }
    });

    // Cleanup function
    return () => {
      Object.entries(mapInstances.current).forEach(([destId, map]) => {
        if (!expandedDestinations[destId]) {
          map.remove();
          delete mapInstances.current[destId];
        }
      });
    };
  }, [expandedDestinations]);

  if (error) {
    return (
      <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Discover travel lists
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Explore curated destination lists shared by our community of travelers.
        </p>

        {publicLists.length === 0 ? (
          <p className="mt-8 text-gray-500">No lists available at the moment.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {publicLists
              .filter(list => list.isPublic)
              .sort((a, b) => new Date(b.lastEdited || b.createdAt) - new Date(a.lastEdited || a.createdAt))
              .slice(0, 10)
              .map((list) => (
                <div key={list._id} className="border rounded-lg bg-white shadow-sm">
                  <button
                    onClick={() => toggleList(list.listName)}
                    className="flex items-center justify-between w-full p-5 text-left"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{list.listName}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          Created by {list.userId?.username || 'Anonymous'} • 
                          {list.destinationIds?.length || 0} destinations
                        </p>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {list.averageRating > 0 
                              ? list.averageRating.toFixed(1) 
                              : 'No ratings'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedLists[list.listName] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedLists[list.listName] && (
                    <div className="p-5 border-t bg-gray-50">
                      {list.description && (
                        <p className="mb-4 text-gray-600">{list.description}</p>
                      )}
                      
                      <div className="space-y-3">
                        {destinationsData[list.listName]?.map((dest) => (
                          <div key={dest._id} className="border rounded-lg mb-4">
                            <button 
                              onClick={() => toggleDestination(dest._id)}
                              className="flex items-center justify-between w-full p-5 text-left font-medium text-gray-500 border-b border-gray-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                              <span>{dest.Destination} ({dest.Country}, {dest.Region})</span>
                              <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedDestinations[dest._id] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedDestinations[dest._id] && (
                              <div className="p-5 bg-gray-50 text-gray-700 space-y-2 text-left">
                                <p><strong>Destination:</strong> {dest.Destination}</p>
                                <p><strong>Country:</strong> {dest.Country}</p>
                                <p><strong>Region:</strong> {dest.Region}</p>
                                <p><strong>ID:</strong> {dest._id}</p>
                                <p><strong>Category:</strong> {dest.Category}</p>
                                <p><strong>Latitude:</strong> {dest.Latitude}</p>
                                <p><strong>Longitude:</strong> {dest.Longitude}</p>
                                <p><strong>Approximate Annual Tourists:</strong> {dest['Approximate Annual Tourists']}</p>
                                <p><strong>Currency:</strong> {dest.Currency}</p>
                                <p><strong>Majority Religion:</strong> {dest['Majority Religion']}</p>
                                <p><strong>Famous Foods:</strong> {dest['Famous Foods']}</p>
                                <p><strong>Language:</strong> {dest.Language}</p>
                                <p><strong>Best Time to Visit:</strong> {dest['Best Time to Visit']}</p>
                                <p><strong>Cost of Living:</strong> {dest['Cost of Living']}</p>
                                <p><strong>Safety:</strong> {dest.Safety}</p>
                                <p><strong>Cultural Significance:</strong> {dest['Cultural Significance']}</p>
                                <p><strong>Description:</strong> {dest.Description}</p>
                                <div 
                                  ref={el => mapRefs.current[dest._id] = el}
                                  className="w-full h-[300px] mt-4 rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Reviews</h4>
                        
                        {isAuthenticated && (
                          <ListReviewForm
                            listId={list._id}
                            onReviewSubmitted={fetchPublicLists}
                          />
                        )}

                        <div className="mt-6 space-y-4">
                          {(list.reviews || [])
                            .filter(review => !review.hidden || user?.isAdmin)
                            .map((review, index) => (
                              <div key={index} className="text-left bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      {review.userId?.username || 'Anonymous'}
                                    </span>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  {user?.isAdmin && (
                                    <button
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(
                                            `http://localhost:3000/api/lists/${list._id}/reviews/${review._id}/toggle-visibility`,
                                            {
                                              method: 'PUT',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                'x-auth-token': localStorage.getItem('token')
                                              }
                                            }
                                          );
                                          if (!response.ok) throw new Error('Failed to toggle review visibility');
                                          fetchPublicLists(); // Refresh the list after toggling
                                        } catch (error) {
                                          console.error('Error toggling review visibility:', error);
                                        }
                                      }}
                                      className={`px-2 py-1 text-sm rounded ${
                                        review.hidden
                                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                                      }`}
                                    >
                                      {review.hidden ? 'Show Review' : 'Hide Review'}
                                    </button>
                                  )}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
} 