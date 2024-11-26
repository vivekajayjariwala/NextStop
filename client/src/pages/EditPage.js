import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import config from '../config/config';
import { sanitizeFormData } from '../utils/sanitizer';

export default function EditPage() {
  const [userLists, setUserLists] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserLists();
  }, [isAuthenticated, navigate]);

  const fetchUserLists = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/lists`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setUserLists(data.filter(list => list.userId._id === JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id));
    } catch (error) {
      setError('Failed to fetch lists');
    }
  };

  const toggleList = (listId) => {
    setExpandedLists(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
    
    // Initialize form data for this list if it doesn't exist
    if (!formData[listId]) {
      const list = userLists.find(l => l._id === listId);
      setFormData(prev => ({
        ...prev,
        [listId]: {
          listName: list.listName,
          description: list.description || '',
          isPublic: list.isPublic,
          destinationIds: list.destinationIds.join(', ')
        }
      }));
    }
  };

  const handleInputChange = (listId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (listId, e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const list = userLists.find(l => l._id === listId);
    const formDataForList = formData[listId];

    try {
      const sanitizedData = sanitizeFormData({
        listName: formDataForList.listName,
        description: formDataForList.description,
        isPublic: formDataForList.isPublic,
        destinationIds: formDataForList.destinationIds.split(',').map(id => id.trim())
      });

      const response = await fetch(`${config.api.baseUrl}/api/lists/${list.listName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(sanitizedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update list');
      }
      
      const data = await response.json();
      
      // Update the local state with the new data
      setUserLists(prevLists => 
        prevLists.map(l => 
          l._id === listId ? { ...l, ...data.list } : l
        )
      );
      
      // Set success message with list name
      setSuccess(`"${formDataForList.listName}" updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;

    const list = userLists.find(l => l._id === listId);

    try {
      const response = await fetch(`http://localhost:3000/api/lists/${list.listName}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to delete list');

      setSuccess(`"${list.listName}" deleted successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setExpandedLists(prev => {
        const newState = { ...prev };
        delete newState[listId];
        return newState;
      });
      fetchUserLists();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Manage Your Lists
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Edit and organize your travel destination lists.
        </p>
        
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}

        <div className="mt-8 space-y-4">
          {userLists.map(list => (
            <div key={list._id} className="border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => toggleList(list._id)}
                className="flex items-center justify-between w-full p-5 text-left"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{list.listName}</h3>
                  <p className="text-sm text-gray-500">
                    {list.isPublic ? 'Public' : 'Private'} • 
                    {list.destinationIds.length} destinations
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {list.lastEdited 
                      ? `Last edited: ${new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }).format(new Date(list.lastEdited))}`
                      : 'Never edited'}
                  </p>
                </div>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedLists[list._id] ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedLists[list._id] && formData[list._id] && (
                <form 
                  onSubmit={(e) => handleSubmit(list._id, e)}
                  className="p-5 border-t bg-gray-50 space-y-4"
                >
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">
                      List Name
                    </label>
                    <input
                      type="text"
                      value={formData[list._id].listName}
                      onChange={(e) => handleInputChange(list._id, 'listName', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData[list._id].description}
                      onChange={(e) => handleInputChange(list._id, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      rows={3}
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">
                      Destination IDs (comma-separated)
                    </label>
                    <textarea
                      value={formData[list._id].destinationIds}
                      onChange={(e) => handleInputChange(list._id, 'destinationIds', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      rows={2}
                      placeholder="Enter destination IDs separated by commas"
                    />
                  </div>

                  <div className="text-left">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[list._id].isPublic}
                        onChange={(e) => handleInputChange(list._id, 'isPublic', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Make this list public</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(list._id)}
                      className="flex-1 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Delete List
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 