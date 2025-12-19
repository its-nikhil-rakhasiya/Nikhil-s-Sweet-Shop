import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, IndianRupee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
    const { user } = useAuth();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const handleQuantityChange = (item, newQuantity) => {
        const availableStock = item.stock_quantity || 0;

        if (newQuantity > availableStock) {
            toast.error(`Only ${availableStock} in stock for ${item.sweet_name}!`);
            return;
        }

        updateQuantity(item.id, newQuantity);
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-16">
                    <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add some delicious sweets to get started!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Continue Shopping</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">
                        Shopping Cart ({getCartCount()} items)
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Continue Shopping</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                    Quantity
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                    Subtotal
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                    Remove
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.image || 'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=100'}
                                                alt={item.sweet_name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {item.sweet_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {item.weight}g • {item.location}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center text-gray-800 font-semibold">
                                            <IndianRupee className="h-4 w-4" />
                                            {item.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            >
                                                <Minus className="h-4 w-4 text-gray-700" />
                                            </motion.button>
                                            <span className="w-12 text-center font-semibold text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            >
                                                <Plus className="h-4 w-4 text-gray-700" />
                                            </motion.button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center text-green-600 font-bold text-lg">
                                            <IndianRupee className="h-5 w-5" />
                                            {(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                        <span>Subtotal ({getCartCount()} items):</span>
                        <div className="flex items-center font-semibold">
                            <IndianRupee className="h-5 w-5" />
                            {getCartTotal().toLocaleString()}
                        </div>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between text-xl font-bold text-gray-800">
                            <span>Total:</span>
                            <div className="flex items-center text-green-600">
                                <IndianRupee className="h-6 w-6" />
                                {getCartTotal().toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
                >
                    Proceed to Checkout
                </motion.button>
            </div>
        </div>
    );
}
