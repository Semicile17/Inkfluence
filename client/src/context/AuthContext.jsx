import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/session');
      setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.data.user);
    return data;
  };

  const register = async (details) => {
    const { data } = await api.post('/auth/register', details);
    setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (details) => {
    const { data } = await api.patch('/auth/me', details);
    setUser(data.data.user);
    return data;
  };

  const toggleBookmarkLocal = (blogId) => {
    setUser((previous) => {
      if (!previous) return previous;
      const id = String(blogId);
      const bookmarks = (previous.bookmarks || []).map(String);
      const exists = bookmarks.includes(id);
      return {
        ...previous,
        bookmarks: exists ? bookmarks.filter((bookmark) => bookmark !== id) : [...bookmarks, id],
      };
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refresh,
      updateProfile,
      updateUser: setUser,
      toggleBookmarkLocal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
