import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateToLocal } from '../utils/dateUtils';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                toast.success('User added successfully');
                setShowAddModal(false);
                setNewUser({ email: '', password: '', full_name: '' });
                fetchUsers();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Network error');
        }
    };

    const handleDeleteUser = async (userId, email) => {
        if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

        try {
            const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Network error');
        }
    };

    const handleToggleBan = async (userId, currentStatus, email) => {
        const newStatus = !currentStatus;
        const action = newStatus ? 'ban' : 'unban';

        if (!confirm(`Are you sure you want to ${action} ${email}?`)) return;

        try {
            const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/ban`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_banned: newStatus })
            });

            if (response.ok) {
                toast.success(`User ${action}ned successfully`);
                fetchUsers();
            } else {
                toast.error(`Failed to ${action} user`);
            }
        } catch (error) {
            console.error(`Error ${action}ning user:`, error);
            toast.error('Network error');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading users...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <Users className="h-7 w-7 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    <UserPlus className="h-5 w-5" />
                    <span>Add User</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-gray-800 dark:text-white">{user.id}</td>
                                <td className="px-6 py-4 text-gray-800 dark:text-white">{user.email}</td>
                                <td className="px-6 py-4 text-gray-800 dark:text-white">{user.full_name}</td>
                                <td className="px-6 py-4">
                                    {user.is_banned ? (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                            Banned
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                    {formatDateToLocal(user.created_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => handleToggleBan(user.id, user.is_banned, user.email)}
                                            className={`p-2 rounded-lg transition-all ${user.is_banned
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                }`}
                                            title={user.is_banned ? 'Unban User' : 'Ban User'}
                                        >
                                            {user.is_banned ? <CheckCircle className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New User</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.full_name}
                                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Add User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewUser({ email: '', password: '', full_name: '' });
                                    }}
                                    className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
