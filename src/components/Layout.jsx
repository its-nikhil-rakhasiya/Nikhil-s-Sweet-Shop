import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Store, User, LogOut, ShoppingBag } from 'lucide-react';
import { getTheme, setTheme } from '../utils/theme.js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, userLogout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // Enforce light mode on mount
  React.useEffect(() => {
    setTheme('light');
  }, []);

  const handleLogout = () => {
    userLogout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow bg-white">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Store className="h-10 w-10 text-blue-600" />
                <Link to="/" className="ml-2 font-bold text-xl text-blue-600">
                  Nikhil's Sweet Shop
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                  Admin
                </Link>

                {/* Cart Icon with Badge */}
                <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                  <ShoppingBag className="h-6 w-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                    >
                      <User className="h-5 w-5" />
                      <span>{user.full_name}</span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <User className="h-4 w-4" />
                    <span>User Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-100 text-center py-4">
        <div className="text-sm text-gray-700">
          <p>&copy; 2025 Nikhil's Sweet Shop, All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}