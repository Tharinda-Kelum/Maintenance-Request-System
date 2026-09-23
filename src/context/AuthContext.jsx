import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeRoleId, setActiveRoleId] = useState('general_user');
  const [currentUser, setCurrentUser] = useState(USER_ROLES.STAFF.defaultUser);

  // Sync user object when activeRoleId changes
  useEffect(() => {
    const roleKey = Object.keys(USER_ROLES).find(
      (key) => USER_ROLES[key].id === activeRoleId
    );
    if (roleKey && USER_ROLES[roleKey]) {
      setCurrentUser(USER_ROLES[roleKey].defaultUser);
    }
  }, [activeRoleId]);

  const switchRole = (roleId) => {
    setActiveRoleId(roleId);
    const roleKey = Object.keys(USER_ROLES).find(
      (key) => USER_ROLES[key].id === roleId
    );
    if (roleKey && USER_ROLES[roleKey]) {
      setCurrentUser(USER_ROLES[roleKey].defaultUser);
    }
  };

  const login = (roleId = 'general_user', customUser = null) => {
    setIsAuthenticated(true);
    if (customUser) {
      setCurrentUser(customUser);
      setActiveRoleId(customUser.role);
    } else {
      switchRole(roleId);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRoleId,
        activeRoleConfig: Object.values(USER_ROLES).find((r) => r.id === activeRoleId) || USER_ROLES.STAFF,
        switchRole,
        login,
        logout,
        availableRoles: USER_ROLES
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
