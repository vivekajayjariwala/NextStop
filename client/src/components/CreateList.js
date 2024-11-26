import { useState } from 'react'
import { NewListCard } from './NewListCard'
import { useAuth } from '../context/AuthContext'
import { sanitizeFormData } from '../utils/sanitizer';

export function CreateList({ selectedDestinations, onRemoveDestination, onListCreated }) {
  const { user } = useAuth();
  const [listName, setListName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!listName.trim()) {
      setError('List name is required')
      return
    }
    
    if (selectedDestinations.length === 0) {
      setError('Please add at least one destination to the list')
      return
    }

    try {
      const token = localStorage.getItem('token');
      const sanitizedData = sanitizeFormData({
        listName: listName.trim(),
        description,
        isPublic,
        destinations: selectedDestinations.map(dest => dest._id)
      });

      const response = await fetch('http://localhost:3000/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create list');
      }

      setSuccessMessage(`"${listName}" was successfully created!`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      setListName('')
      setDescription('')
      setIsPublic(false)
      onListCreated();
      setError('');
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mt-12 max-w-xl mx-auto text-center">
      <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Create a new list</h2>
      <p className="mt-4 text-lg text-gray-600">Save your favorite destinations in a personalized collection.</p>
      
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
        <div>
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700">
            List Name *
          </label>
          <input
            type="text"
            id="listName"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Make this list public
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Destinations *</p>
          {selectedDestinations.length === 0 ? (
            <p className="text-sm text-gray-500">No destinations selected</p>
          ) : (
            selectedDestinations.map(dest => (
              <NewListCard
                key={dest._id}
                destination={dest}
                onRemove={onRemoveDestination}
              />
            ))
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
        >
          Create List
        </button>
      </form>
    </div>
  )
} 