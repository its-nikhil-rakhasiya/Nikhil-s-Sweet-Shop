import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('adminToken'));
  const [user, setUser] = useState(() => {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData) : null;
  });

  const login = (token) => {
    Cookies.set('adminToken', token, { expires: 1 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('adminToken');
    setIsAuthenticated(false);
  };

  const userLogin = (userData) => {
    Cookies.set('userData', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const userLogout = () => {
    Cookies.remove('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      user,
      userLogin,
      userLogout,
      isUserLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);