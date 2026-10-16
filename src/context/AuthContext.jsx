import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ROLE_CONFIGS } from '../auth/roles';
import { authenticate, restoreSession } from '../auth/authService';
import { api, setExpectedUser } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const announceAccountChange = () => {
  try { localStorage.setItem('mrs:account-change', `${Date.now()}:${Math.random()}`); } catch { /* Focus checks also keep tabs synchronized. */ }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const { clearToasts, showToast } = useToast();
  const reconnect = useCallback(async () => {
    setIsLoading(true); setConnectionError('');
    try { setCurrentUser(await restoreSession()); }
    catch (error) { setConnectionError(error.message); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => {
    let cancelled = false;
    restoreSession().then((user) => { if (!cancelled) setCurrentUser(user); })
      .catch((error) => { if (!cancelled) setConnectionError(error.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const expired = () => { setCurrentUser(null); showToast('Your session has expired. Please sign in again.', 'info'); };
    window.addEventListener('mrs:session-expired', expired);
    return () => window.removeEventListener('mrs:session-expired', expired);
  }, [showToast]);
  useEffect(() => { setExpectedUser(currentUser); }, [currentUser]);
  useEffect(() => {
    let cancelled = false;
    let version = 0;
    const sync = async () => {
      const attempt = ++version;
      try {
        const user = await restoreSession();
        if (cancelled || attempt !== version) return;
        setCurrentUser((previous) => {
          if (previous?.id === user?.id) return previous;
          return user;
        });
        setExpectedUser(user);
      } catch { /* Normal resource errors provide a retry if the server is unavailable. */ }
    };
    const changed = () => { showToast('The signed-in account changed in another tab. The workspace has been updated.', 'info'); sync(); };
    const storage = (event) => { if (event.key === 'mrs:account-change') changed(); };
    window.addEventListener('storage', storage);
    window.addEventListener('mrs:account-changed', changed);
    window.addEventListener('focus', sync);
    return () => { cancelled = true; window.removeEventListener('storage', storage); window.removeEventListener('mrs:account-changed', changed); window.removeEventListener('focus', sync); };
  }, [showToast]);
  const isAuthenticated = Boolean(currentUser);
  const activeRoleId = currentUser?.role || null;

  const login = async (credentials) => {
    const session = await authenticate(credentials);
    setCurrentUser(session.user);
    setExpectedUser(session.user);
    announceAccountChange();
    setConnectionError('');
    return session;
  };

  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); clearToasts(); setCurrentUser(null); setExpectedUser(null); announceAccountChange(); }
    catch (error) { showToast(error.message, 'error'); }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRoleId,
        isLoading, connectionError, reconnect,
        activeRoleConfig: ROLE_CONFIGS[activeRoleId] || null,
        login,
        changePassword: (currentPassword, newPassword) => api('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
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
