import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, IndianRupee, CheckCircle, MapPin, ShoppingBag, CreditCard } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [user, cartItems, navigate]);

    const handlePlaceOrder = async () => {
        if (!deliveryAddress.trim()) {
            toast.error('Please enter your delivery address');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                user_id: user.id,
                total_amount: getCartTotal(),
                delivery_address: deliveryAddress,
                items: cartItems.map(item => ({
                    sweet_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json(); // Added as per instruction
                setOrderPlaced(true);
                clearCart();
                toast.success('Order placed successfully!'); // Added as per instruction
                setTimeout(() => {
                    navigate('/');
                }, 1500); // Changed from 2000 to 1500 as per instruction
            } else {
                const errorData = await response.json();
                toast.error(`Failed to place order: ${errorData.message || 'Please try again'}`); // Replaced alert with toast
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Network error. Please try again.'); // Replaced alert with toast
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Order Placed Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your order will be delivered soon.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Returning to homepage...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Delivery Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={user.full_name}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                    Delivery Address *
                                </label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder="Enter your complete delivery address..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=100'}
                                            alt={item.sweet_name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                                {item.sweet_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                From: {item.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-green-600 dark:text-green-400 font-bold">
                                        <IndianRupee className="h-5 w-5" />
                                        {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Subtotal:</span>
                                <div className="flex items-center font-semibold">
                                    <IndianRupee className="h-4 w-4" />
                                    {getCartTotal().toLocaleString()}
                                </div>
                            </div>
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Delivery:</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </div>
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
                                    <span>Total:</span>
                                    <div className="flex items-center text-green-600 dark:text-green-400">
                                        <IndianRupee className="h-6 w-6" />
                                        {getCartTotal().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </motion.button>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                            By placing your order, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
