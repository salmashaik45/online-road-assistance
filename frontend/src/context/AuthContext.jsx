import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('roadassist_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('roadassist_user', JSON.stringify(userData));
    if (userData?.token) {
      localStorage.setItem('roadassist_token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roadassist_user');
    localStorage.removeItem('roadassist_token');
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user?.token) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
