import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function UserLogin() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { userLogin } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Invalid email format');
            setLoading(false);
            return;
        }

        if (isRegistering) {
            if (!formData.full_name) {
                setError('Please enter your full name');
                setLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    const userData = {
                        id: data.userId,
                        email: formData.email,
                        full_name: formData.full_name
                    };
                    userLogin(userData);
                    navigate('/');
                } else {
                    setError(data.error || 'Registration failed');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            }
        } else {
            try {
                const response = await fetch('http://localhost:3001/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    userLogin(data);
                    navigate('/');
                } else {
                    setError(data.error || 'Login failed');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        {isRegistering ? (
                            <UserPlus className="h-8 w-8 text-white" />
                        ) : (
                            <LogIn className="h-8 w-8 text-white" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {isRegistering
                            ? 'Sign up to start ordering delicious sweets'
                            : 'Login to your account'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your password"
                            />
                        </div>
                        {isRegistering && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Must be at least 6 characters
                            </p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Please wait...' : isRegistering ? 'Create Account' : 'Login'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setFormData({ email: '', password: '', full_name: '' });
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        {isRegistering
                            ? 'Already have an account? Login'
                            : "Don't have an account? Create one"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
