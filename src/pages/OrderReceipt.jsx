import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, ArrowLeft, Package, Truck, XCircle, MapPin, User, Mail, Calendar, IndianRupee } from 'lucide-react';
import { formatDateToLocal } from '../utils/dateUtils';

export default function OrderReceipt() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        fetch(`${API_URL}/api/orders/${orderId}`)
            .then(res => {
                if (res.status === 404) {
                    setNotFound(true);
                    setLoading(false);
                    return null;
                }
                if (!res.ok) {
                    throw new Error('Failed to fetch order');
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setOrder(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching order:', error);
                setNotFound(true);
                setLoading(false);
            });
    }, [orderId]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Package },
            delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: Truck },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`${badge.bg} ${badge.text} px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 w-fit`}>
                <Icon className="h-5 w-5" />
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

    if (notFound || !order) {
        navigate('/404', { replace: true });
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/orders')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Orders</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-blue-600 p-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                        <Receipt className="h-8 w-8" />
                        <h1 className="text-3xl font-bold">Order Receipt</h1>
                    </div>
                    <p className="text-blue-100">Order ID: #{order.id}</p>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <User className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Customer Name</p>
                                    <p className="font-semibold text-gray-800">{order.full_name}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-800">{order.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-semibold text-gray-800">
                                        {formatDateToLocal(order.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Delivery Address</p>
                                    <p className="font-semibold text-gray-800">
                                        {order.delivery_address}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                                {getStatusBadge(order.status)}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Order Items
                        </h2>

                        <div className="space-y-3 mb-6">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.sweet_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            ₹{item.price_per_unit.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">
                                            ₹{item.subtotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-300 pt-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <IndianRupee className="h-6 w-6 text-gray-700" />
                                    <span className="text-xl font-bold text-gray-800">
                                        Total Amount
                                    </span>
                                </div>
                                <span className="text-3xl font-bold text-green-600">
                                    ₹{order.total_amount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            {order.status === 'pending' && '📦 Your order is being processed and will be delivered soon.'}
                            {order.status === 'delivered' && '✅ Your order has been delivered. Thank you for your purchase!'}
                            {order.status === 'cancelled' && '❌ This order has been cancelled.'}
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </motion.div>

            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-4xl, .max-w-4xl * {
            visibility: visible;
          }
          .max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
