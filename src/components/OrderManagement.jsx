import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateToLocal } from '../utils/dateUtils';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        fetch('http://localhost:3001/api/admin/orders/detailed')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Fetch fresh data to show cascaded updates immediately
                fetchOrders();
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Network error');
        }
    };

    const handleItemStatusChange = async (itemId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/order-items/${itemId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchOrders();
            } else {
                alert('Failed to update item status');
            }
        } catch (error) {
            console.error('Error updating item status:', error);
            alert('Network error');
        }
    };

    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredOrders = filterStatus
        ? orders.filter(order => order.status === filterStatus)
        : orders;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <Package className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Order Management
                    </h2>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                        Filter:
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No orders found.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                                        <p className="font-bold text-gray-800 dark:text-white">#{order.id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            {order.full_name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                                        <p className="text-gray-800 dark:text-white">
                                            {formatDateToLocal(order.created_at)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                        <p className="font-bold text-green-600 dark:text-green-400">
                                            ₹{order.total_amount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`border rounded-lg px-3 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 ${order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                : order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-800 border-green-300'
                                                    : 'bg-red-100 text-red-800 border-red-300'
                                                }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => toggleOrderExpansion(order.id)}
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            <span className="text-sm font-medium">
                                                {expandedOrders.has(order.id) ? 'Hide' : 'Show'} Items
                                            </span>
                                            {expandedOrders.has(order.id) ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {expandedOrders.has(order.id) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Email:</span> {order.email}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Address:</span> {order.delivery_address}
                                            </p>
                                        </div>

                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Item
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Location
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Quantity
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Price
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Subtotal
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Delivery Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                                                        <td className="px-4 py-3 text-gray-800 dark:text-white">
                                                            {item.sweet_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                                            {item.location || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-800 dark:text-white">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-800 dark:text-white">
                                                            ₹{item.price_per_unit.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-white">
                                                            ₹{item.subtotal.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <select
                                                                value={item.status || 'pending'}
                                                                onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
                                                                className={`border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${(item.status || 'pending') === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                                    : (item.status || 'pending') === 'shipped'
                                                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                                        : (item.status || 'pending') === 'delivered'
                                                                            ? 'bg-green-100 text-green-800 border-green-300'
                                                                            : 'bg-red-100 text-red-800 border-red-300'
                                                                    }`}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
