import React, { useState, useEffect } from 'react';
import { ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateToLocal } from '../utils/dateUtils';

export default function BannedEmails() {
    const [bannedEmails, setBannedEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBanModal, setShowBanModal] = useState(false);
    const [newBan, setNewBan] = useState({ email: '', reason: '', banned_by: 'Admin' });

    useEffect(() => {
        fetchBannedEmails();
    }, []);

    const fetchBannedEmails = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/admin/banned-emails`);
            const data = await response.json();
            setBannedEmails(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching banned emails:', error);
            toast.error('Failed to fetch banned emails');
            setLoading(false);
        }
    };

    const handleBanEmail = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/admin/banned-emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBan)
            });

            if (response.ok) {
                toast.success('Email banned successfully');
                setShowBanModal(false);
                setNewBan({ email: '', reason: '', banned_by: 'Admin' });
                fetchBannedEmails();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to ban email');
            }
        } catch (error) {
            console.error('Error banning email:', error);
            toast.error('Network error');
        }
    };

    const handleUnban = async (banId, email) => {
        if (!confirm(`Are you sure you want to unban ${email}?`)) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/admin/banned-emails/${banId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Email unbanned successfully');
                fetchBannedEmails();
            } else {
                toast.error('Failed to unban email');
            }
        } catch (error) {
            console.error('Error unbanning email:', error);
            toast.error('Network error');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading banned emails...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <ShieldOff className="h-7 w-7 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Banned Emails</h2>
                </div>
                <button
                    onClick={() => setShowBanModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                    <ShieldOff className="h-5 w-5" />
                    <span>Ban Email</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Banned By</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bannedEmails.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No banned emails
                                </td>
                            </tr>
                        ) : (
                            bannedEmails.map((ban) => (
                                <tr key={ban.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-800 font-medium">{ban.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{ban.reason || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{ban.banned_by}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {formatDateToLocal(ban.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleUnban(ban.id, ban.email)}
                                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all inline-flex items-center space-x-2"
                                                title="Unban Email"
                                            >
                                                <ShieldCheck className="h-5 w-5" />
                                                <span className="text-sm">Unban</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Ban Email Modal */}
            {showBanModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Ban Email Address</h3>
                        <form onSubmit={handleBanEmail} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={newBan.email}
                                    onChange={(e) => setNewBan({ ...newBan, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Reason (Optional)</label>
                                <textarea
                                    value={newBan.reason}
                                    onChange={(e) => setNewBan({ ...newBan, reason: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Reason for banning..."
                                    rows="3"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                >
                                    Ban Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBanModal(false);
                                        setNewBan({ email: '', reason: '', banned_by: 'Admin' });
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
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
