import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingChanges, setPendingChanges] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.api.baseUrl}/api/users/all`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(response.data);
      setPendingChanges({}); // Reset pending changes after fetch
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const queueChange = (userId, property, currentValue) => {
    setPendingChanges(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [property]: !currentValue
      }
    }));
    setSuccess(''); // Clear any previous success message
  };

  const saveChanges = async () => {
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Process all pending changes
      for (const [userId, changes] of Object.entries(pendingChanges)) {
        for (const [property, newValue] of Object.entries(changes)) {
          await axios.put(
            `http://localhost:3000/api/users/${userId}/toggle/${property}`,
            {},
            { headers: { 'x-auth-token': token } }
          );
        }
      }
      
      await fetchUsers(); // Refresh the list
      setSuccess('Changes saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to save changes');
      console.error('Error saving changes:', error);
    }
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          User Management
        </h2>
        <p className="mt-4 text-lg/8 text-gray-600">
          Manage user accounts, permissions, and access controls for Next Stop.
        </p>
      </div>

      <div className="mx-auto max-w-4xl mt-20">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Username</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    const userChanges = pendingChanges[user._id] || {};
                    const isDisabled = userChanges.isDisabled ?? user.isDisabled;
                    const isAdmin = userChanges.isAdmin ?? user.isAdmin;
                    
                    return (
                      <tr key={user._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <button
                            onClick={() => queueChange(user._id, 'isDisabled', isDisabled)}
                            className={`px-2 py-1 rounded ${
                              isDisabled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            } ${userChanges.isDisabled !== undefined ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                          >
                            {isDisabled ? 'Disabled' : 'Active'}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <button
                            onClick={() => queueChange(user._id, 'isAdmin', isAdmin)}
                            className={`px-2 py-1 rounded ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            } ${userChanges.isAdmin !== undefined ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                          >
                            {isAdmin ? 'Admin' : 'User'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveChanges}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 