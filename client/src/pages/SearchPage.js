import { useState, useEffect } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { SearchResult } from '../components/SearchResult'
import { AdditionalSearchOptions } from '../components/AdditionalSearchOptions'
import { CreateList } from '../components/CreateList'
import { useAuth } from '../context/AuthContext'
import config from '../config/config';

export default function SearchPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const { isAuthenticated, user } = useAuth();
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [userListsCount, setUserListsCount] = useState(0);

  useEffect(() => {
    const fetchUserListsCount = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${config.api.baseUrl}/api/lists`, {
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
          const lists = await response.json();
          const userOwnedLists = lists.filter(list => list.userId._id === user._id);
          setUserListsCount(userOwnedLists.length);
        } catch (error) {
          console.error('Error fetching user lists:', error);
        }
      }
    };

    fetchUserListsCount();
  }, [isAuthenticated, user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setDropdownOpen(false)
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    
    const normalizedQuery = searchQuery.trim()
    
    try {
        const response = await fetch(
            `http://localhost:3000/api/destinations/search?` + 
            `field=${selectedCategory.toLowerCase()}&` +
            `${normalizedQuery ? `pattern=${encodeURIComponent(normalizedQuery)}&` : ''}` +
            `limit=${itemsPerPage}&` +
            `skip=${(currentPage - 1) * itemsPerPage}`
        )
        const data = await response.json()
        setSearchResults(data.results)
        setTotalResults(data.total)
    } catch (error) {
        console.error('Error fetching search results:', error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    handleSearch(new Event('submit'))
  }

  const handleAddToList = (destination) => {
    if (!selectedDestinations.find(d => d._id === destination._id)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  const handleRemoveFromList = (destinationId) => {
    setSelectedDestinations(selectedDestinations.filter(d => d._id !== destinationId));
  };

  const handleListCreated = () => {
    setSelectedDestinations([]);
  };

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Search a destination</h2>
        <p className="mt-4 text-lg text-gray-600">Type in a destination name, region, or country.</p>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-6">
          <div className="flex relative">
            <button 
              id="dropdown-button" 
              onClick={toggleDropdown} 
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600"
              type="button">
              {selectedCategory} 
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-12">
                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
                  {["All categories", "Name", "Country", "Region"].map((category) => (
                    <li key={category}>
                      <button 
                        type="button" 
                        onClick={() => handleCategorySelect(category)} 
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative w-full">
              <input 
                type="search" 
                id="search-dropdown" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600" 
                placeholder="Start typing..." 
              />
              <button 
                type="submit" 
                className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-green-600 rounded-r-lg border border-green-600 hover:bg-green-500 focus:ring-2 focus:ring-inset focus:ring-green-600">
                <MagnifyingGlassIcon className="w-6 h-5" aria-hidden="true" />
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 max-w-xl mx-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <SearchResult 
                key={result._id} 
                result={result}
                onAddToList={handleAddToList}
              />
            ))
          ) : (
            <p className="text-gray-500 mt-4">No results found. Start your search above.</p>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="mt-6 flex items-center justify-between max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="rounded border-gray-300 text-sm"
              >
                {[5, 10, 20, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 py-1">
                Page {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= totalResults}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="mt-32">
          {userListsCount >= 20 ? (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                You have reached your account limit of 20 lists, please delete one before making another one
              </p>
            </div>
          ) : (
            <CreateList
              selectedDestinations={selectedDestinations}
              onRemoveDestination={handleRemoveFromList}
              onListCreated={handleListCreated}
            />
          )}
        </div>
      )}
      
      <AdditionalSearchOptions />
    </div>
  )
}