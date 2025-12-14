import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderManagement from '../components/OrderManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('sweets');
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSweet, setEditingSweet] = useState(null);
  const [username, setUsername] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAddSweetForm, setShowAddSweetForm] = useState(false);
  const [newSweet, setNewSweet] = useState({
    sweet_name: '',
    category: '',
    weight: '',
    flavor: '',
    location: '',
    shop_address: '',
    price: '',
    type: '',
    sold: false,
    image: '',
  });

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
    city: ''
  });

  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      location: '',
      city: ''
    });
  };

  const handleAddSweetToggle = () => {
    setShowAddSweetForm(!showAddSweetForm);
  };

  const validateSweet = (sweet) => {
    if (sweet.sweet_name.length > 100) {
      alert("Sweet name cannot be more than 100 characters.");
      return false;
    }

    if (sweet.weight < 10 || sweet.weight > 10000) {
      alert("Weight must be between 10g and 10000g.");
      return false;
    }

    const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)|.*)$/i;
    if (!imageUrlPattern.test(sweet.image)) {
      alert("Image URL must be a valid URL.");
      return false;
    }

    return true;
  };

  const handleAddSweetSubmit = async () => {
    if (!validateSweet(newSweet)) return;

    try {
      const response = await fetch('http://localhost:3001/api/addsweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSweet),
      });

      if (response.ok) {
        setShowAddSweetForm(false);
        fetchSweets();
      } else {
        const errorData = await response.json();
        alert(`Error adding sweet: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding sweet:', error);
      alert('An unexpected error occurred.');
    }
  };

  const fetchSweets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sweets');
      const data = await response.json();
      setSweets(data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'adminPassword' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.username) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  useEffect(() => {
    fetchSweets();
    fetchAdminInfo();
  }, []);

  const handleEdit = (sweet) => {
    setEditingSweet({ ...sweet });
  };

  const handleSave = async () => {
    if (!validateSweet(editingSweet)) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/sweets/${editingSweet.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingSweet),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;

        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            errorData = { message: 'Invalid JSON response from server' };
          }
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          errorData = { message: errorText || `HTTP error ${response.status}` };
        }

        console.error('Error updating sweet:', errorData.message);
        alert(`Error updating sweet: ${errorData.message}`);
        return;
      }

      setEditingSweet(null);
      fetchSweets();
    } catch (error) {
      console.error('Error during fetch or update:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleDelete = async (sweetId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this sweet?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/sweets/${sweetId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSweets();
        } else {
          const errorData = await response.json();
          alert(`Error deleting sweet: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting sweet:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Filter sweets based on selected filters
  const filteredSweets = sweets.filter(sweet => {
    return (
      (filters.category === '' || sweet.category === filters.category) &&
      (filters.status === '' ||
        (filters.status === 'available' && !sweet.sold) ||
        (filters.status === 'sold' && sweet.sold)
      ) &&
      (filters.location === '' || sweet.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.city === '' || sweet.location === filters.city)
    );
  });

  const totalSweets = sweets.length;
  const availableSweets = sweets.filter(sweet => !sweet.sold).length;
  const soldSweets = sweets.filter(sweet => sweet.sold).length;
  const categories = [...new Set(sweets.map(sweet => sweet.category))];
  const cities = [...new Set(sweets.map(sweet => sweet.location))];

  const SweetTable = ({ sweets, title }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="px-6 py-3 text-left">Sweet Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Weight</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.id} className="border-b dark:border-gray-700 dark:text-white">
                <td className="px-6 py-4">{sweet.sweet_name}</td>
                <td className="px-6 py-4">{sweet.category}</td>
                <td className="px-6 py-4">{sweet.weight}g</td>
                <td className="px-6 py-4">{sweet.location}</td>
                <td className="px-6 py-4 flex items-center">
                  <span className="mr-1">₹</span>{sweet.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">{sweet.type}</td>
                <td className="px-6 py-4">{sweet.sold ? 'Sold' : 'Available'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(sweet)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sweet.id)}
                    className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hello {username}, Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('sweets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sweets'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
          >
            Sweets Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
          >
            Orders Management
          </button>
        </nav>
      </div>

      {activeTab === 'sweets' && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg font-semibold dark:text-white">Total Sweets</p>
              <p className="text-2xl font-bold dark:text-white">{totalSweets}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg font-semibold dark:text-white">Available Sweets</p>
              <p className="text-2xl font-bold text-green-600">{availableSweets}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg font-semibold dark:text-white">Sold Sweets</p>
              <p className="text-2xl font-bold text-blue-600">{soldSweets}</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium dark:text-white">Category</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={filters.category}
                  onChange={e => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {loading ? (
                    <option value="">Loading...</option>
                  ) : (
                    categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white">City</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={filters.city}
                  onChange={e => setFilters({ ...filters, city: e.target.value })}
                >
                  <option value="">All Cities...</option>
                  {loading ? (
                    <option value="">Loading...</option>
                  ) : (
                    cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Reset Filters
                </button>
              </div>

            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleAddSweetToggle}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Sweet
            </button>
          </div>

          {/* Available Sweets Section */}
          <SweetTable
            sweets={filteredSweets.filter(sweet => !sweet.sold)}
            title="Available Sweets"
          />

          {/* Sold Sweets Section */}
          <SweetTable
            sweets={filteredSweets.filter(sweet => sweet.sold)}
            title="Sold Sweets"
          />

          {/* Add Sweet Form Modal */}
          {showAddSweetForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add New Sweet</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newSweet.sweet_name}
                    onChange={(e) => setNewSweet({ ...newSweet, sweet_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Sweet Name"
                  />
                  <input
                    type="text"
                    value={newSweet.category}
                    onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Category (e.g., Chocolate, Traditional)"
                  />
                  <input
                    type="number"
                    value={newSweet.weight}
                    onChange={(e) => setNewSweet({ ...newSweet, weight: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Weight (in grams)"
                  />
                  <input
                    type="text"
                    value={newSweet.flavor}
                    onChange={(e) => setNewSweet({ ...newSweet, flavor: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Flavor (optional)"
                  />
                  <input
                    type="text"
                    value={newSweet.location}
                    onChange={(e) => setNewSweet({ ...newSweet, location: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Location (City)"
                  />
                  <input
                    type="text"
                    value={newSweet.shop_address}
                    onChange={(e) => setNewSweet({ ...newSweet, shop_address: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Shop Address"
                  />
                  <input
                    type="number"
                    value={newSweet.price}
                    onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Price (₹)"
                  />
                  <input
                    type="text"
                    value={newSweet.type}
                    onChange={(e) => setNewSweet({ ...newSweet, type: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Type (Packaged/Bulk)"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newSweet.sold}
                      onChange={(e) => setNewSweet({ ...newSweet, sold: e.target.checked })}
                      className="mr-2"
                    />
                    <label>Sold</label>
                  </div>
                  <input
                    type="text"
                    value={newSweet.image}
                    onChange={(e) => setNewSweet({ ...newSweet, image: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleAddSweetToggle}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSweetSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Add Sweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Sweet Modal */}
          {editingSweet && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Edit Sweet</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingSweet.sweet_name}
                    onChange={(e) => setEditingSweet({ ...editingSweet, sweet_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Sweet Name"
                  />
                  <input
                    type="text"
                    value={editingSweet.category}
                    onChange={(e) => setEditingSweet({ ...editingSweet, category: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    value={editingSweet.weight}
                    onChange={(e) => setEditingSweet({ ...editingSweet, weight: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Weight (in grams)"
                  />
                  <input
                    type="text"
                    value={editingSweet.flavor || ''}
                    onChange={(e) => setEditingSweet({ ...editingSweet, flavor: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Flavor (optional)"
                  />
                  <input
                    type="text"
                    value={editingSweet.location}
                    onChange={(e) => setEditingSweet({ ...editingSweet, location: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    value={editingSweet.shop_address}
                    onChange={(e) => setEditingSweet({ ...editingSweet, shop_address: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Shop Address"
                  />
                  <input
                    type="number"
                    value={editingSweet.price}
                    onChange={(e) => setEditingSweet({ ...editingSweet, price: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    value={editingSweet.type}
                    onChange={(e) => setEditingSweet({ ...editingSweet, type: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Type"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSweet.sold}
                      onChange={(e) => setEditingSweet({ ...editingSweet, sold: e.target.checked })}
                      className="mr-2"
                    />
                    <label>Sold</label>
                  </div>
                  <input
                    type="text"
                    value={editingSweet.image}
                    onChange={(e) => setEditingSweet({ ...editingSweet, image: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingSweet(null)}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && <OrderManagement />}
    </div>
  );
}