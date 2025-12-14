import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import OrderHistory from './pages/OrderHistory';
import OrderReceipt from './pages/OrderReceipt';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<Admin />} />
            <Route path="login" element={<UserLogin />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;