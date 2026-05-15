import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/api';
import { getToken, setAuth, clearAuth, getSavedAdmin } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(getSavedAdmin);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((user) => {
        setAdmin(user);
      })
      .catch(() => {
        clearAuth();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const data = await authApi.login(username, password);
    setAuth(data.token, data.admin);
    setAdmin(data.admin);
    return data;
  }

  function logout() {
    clearAuth();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
