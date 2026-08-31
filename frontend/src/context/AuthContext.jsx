import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SESSION_KEY = 'authSession';
const AuthContext = createContext();

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readStoredSession = () => {
  const storage = getStorage();
  if (!storage) return null;

  const keys = [SESSION_KEY, 'session'];

  for (const key of keys) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (parsed?.token && parsed?.user) {
        return parsed;
      }
    } catch {
      // Ignora sessão inválida.
    }
  }

  return null;
};

const persistSession = (token, user) => {
  const storage = getStorage();
  if (!storage) return;

  const session = { token, user };
  storage.setItem('token', token);
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  storage.setItem('session', JSON.stringify(session));
};

const clearSession = () => {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem('token');
  storage.removeItem(SESSION_KEY);
  storage.removeItem('session');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const restoreSession = () => {
    const session = readStoredSession();

    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = data.user || data;
    persistSession(data.token, userData);
    setUser(userData);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    const userData = data.user || data;
    persistSession(data.token, userData);
    setUser(userData);
    return data;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser(prev => {
      const nextUser = { ...(prev || {}), ...newData };
      const token = localStorage.getItem('token');

      if (token) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: nextUser }));
      }

      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      theme,
      setTheme,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
