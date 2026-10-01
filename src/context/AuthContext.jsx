import React, { createContext, useContext, useState } from 'react';
import { USER_ROLES } from '../data/mockData';
import { authenticate } from '../auth/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (credentials) => {
    const session = await authenticate(credentials);
    setCurrentUser(session.user);
    setActiveRoleId(session.roleId);
    setIsAuthenticated(true);
    return session;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveRoleId(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRoleId,
        activeRoleConfig: Object.values(USER_ROLES).find((r) => r.id === activeRoleId) || null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
