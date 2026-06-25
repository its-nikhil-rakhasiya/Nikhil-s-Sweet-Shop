import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SweetDetailsModal({ sweet, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const [showCheckout, setShowCheckout] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!sweet) return null;

    const totalPrice = sweet.price * quantity;

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 50) {
            setQuantity(newQuantity);
        }
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowCheckout(true);
    };

    const handleConfirmOrder = async () => {
        if (!deliveryAddress.trim()) {
            alert('Please enter your delivery address');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                user_id: user.id,
                total_amount: totalPrice,
                delivery_address: deliveryAddress,
                items: [
                    {
                        sweet_id: sweet.id,
                        sweet_name: sweet.sweet_name,
                        quantity: quantity,
                        price_per_unit: sweet.price,
                        subtotal: totalPrice
                    }
                ]
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setOrderPlaced(true);
                setTimeout(() => {
                    onClose();
                    navigate('/orders');
                }, 2000);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {orderPlaced ? (
                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <ShoppingCart className="h-10 w-10 text-green-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Order Placed Successfully!
                            </h2>
                            <p className="text-gray-600">
                                Your order will be delivered soon.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Redirecting to order history...
                            </p>
                        </div>
                    ) : showCheckout ? (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Checkout
                                </h2>
                                <button
                                    onClick={() => setShowCheckout(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ← Back
                                </button>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Order Summary
                                </h3>
                                <div className="flex justify-between text-gray-700">
                                    <span>{sweet.sweet_name} × {quantity}</span>
                                    <span>₹{sweet.price} × {quantity}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-800 mt-2 pt-2 border-t border-gray-300">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Delivery Address
                                </label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder="Enter your complete delivery address..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    rows="4"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirmOrder}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Placing Order...' : 'Confirm Order'}
                            </motion.button>
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                <img
                                    src={sweet.image || 'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=1000'}
                                    alt={sweet.sweet_name}
                                    className="w-full h-64 object-cover rounded-t-2xl"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                                >
                                    <X className="h-6 w-6 text-gray-700" />
                                </button>
                            </div>

                            <div className="p-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {sweet.sweet_name}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-gray-600">Category:</span>
                                        <p className="font-semibold text-gray-800">{sweet.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Weight:</span>
                                        <p className="font-semibold text-gray-800">{sweet.weight}g</p>
                                    </div>
                                    {sweet.flavor && (
                                        <div>
                                            <span className="text-gray-600">Flavor:</span>
                                            <p className="font-semibold text-gray-800">{sweet.flavor}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600">Type:</span>
                                        <p className="font-semibold text-gray-800">{sweet.type}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-gray-600">Location:</span>
                                    <p className="font-semibold text-gray-800">{sweet.location}</p>
                                    <p className="text-sm text-gray-500">{sweet.shop_address}</p>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-700">Price per box:</span>
                                        <div className="flex items-center text-2xl font-bold text-blue-600">
                                            <IndianRupee className="h-6 w-6" />
                                            {sweet.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-700 font-medium">Quantity:</span>
                                    <div className="flex items-center space-x-4">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                                        >
                                            <Minus className="h-5 w-5 text-gray-700" />
                                        </motion.button>
                                        <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                                            {quantity}
                                        </span>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= 50}
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                                        >
                                            <Plus className="h-5 w-5 text-gray-700" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg text-gray-700">Total Price:</span>
                                        <div className="flex items-center text-3xl font-bold text-green-600">
                                            <IndianRupee className="h-8 w-8" />
                                            {totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBuyNow}
                                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
                                >
                                    Buy Now
                                </motion.button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
