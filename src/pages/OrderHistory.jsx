import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, FileText, Calendar, Package, IndianRupee, Eye, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDateToLocal } from '../utils/dateUtils';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3001/api/orders/user/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Package },
            delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: Truck },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit`}>
                <Icon className="h-4 w-4" />
                <span className="capitalize">{status}</span>
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShoppingBag className="h-24 w-24 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    No Orders Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't placed any orders. Start shopping now!
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Browse Sweets
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
                <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    My Orders
                </h1>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    Order #{order.id}
                                </h3>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {formatDateToLocal(order.created_at)}
                                </div>
                            </div>
                            <div className="mt-2 md:mt-0">
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-semibold">Delivery Address:</span>
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {order.delivery_address}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <p className="text-gray-700 dark:text-gray-300 font-semibold">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        ₹{order.total_amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                <Eye className="h-4 w-4" />
                                <span>View Receipt</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
