import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import OrderHistory from './pages/OrderHistory';
import OrderReceipt from './pages/OrderReceipt';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="admin" element={<Admin />} />
              <Route path="login" element={<UserLogin />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <UserProtectedRoute>
                    <Checkout />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <UserProtectedRoute>
                    <OrderHistory />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="order/:orderId"
                element={
                  <UserProtectedRoute>
                    <OrderReceipt />
                  </UserProtectedRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;