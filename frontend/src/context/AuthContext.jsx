import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SESSION_KEY = 'authSession';
const REMEMBER_DEVICE_KEY = 'rememberDevice';
const OFFLINE_MODE_KEY = 'offlineMode';
const AUTH_STORAGE_KEYS = ['token', 'user', SESSION_KEY, 'session', REMEMBER_DEVICE_KEY, OFFLINE_MODE_KEY];
const AuthContext = createContext();

const getStorageBackends = () => {
  if (typeof window === 'undefined') return [];

  const backends = [];
  try { backends.push(window.localStorage); } catch {}
  try { backends.push(window.sessionStorage); } catch {}
  return backends;
};

const getStorageValue = (key) => {
  for (const storage of getStorageBackends()) {
    try {
      const value = storage.getItem(key);
      if (value !== null) return value;
    } catch {
      // Ignora storage indisponível.
    }
  }
  return null;
};

const setStorageValue = (key, value) => {
  for (const storage of getStorageBackends()) {
    try {
      storage.setItem(key, value);
    } catch {
      // Ignora storage indisponível.
    }
  }
};

const removeStorageValue = (key) => {
  for (const storage of getStorageBackends()) {
    try {
      storage.removeItem(key);
    } catch {
      // Ignora storage indisponível.
    }
  }
};

const readStoredSession = () => {
  const rememberDevice = getStorageValue(REMEMBER_DEVICE_KEY) === 'true';
  const storageOrder = rememberDevice ? [window.localStorage, window.sessionStorage] : [window.sessionStorage, window.localStorage];

  for (const storage of storageOrder) {
    if (!storage) continue;

    for (const key of [SESSION_KEY, 'session']) {
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

    const token = storage.getItem('token');
    const user = storage.getItem('user');
    if (token && user) {
      try {
        return { token, user: JSON.parse(user) };
      } catch {
        // Ignora sessão inválida.
      }
    }
  }

  return null;
};

const persistSession = (token, user, rememberDevice = false, offlineMode = false) => {
  const session = { token, user, rememberDevice, offlineMode };

  clearSession();

  if (rememberDevice) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.localStorage.setItem('session', JSON.stringify(session));
  } else {
    window.sessionStorage.setItem('token', token);
    window.sessionStorage.setItem('user', JSON.stringify(user));
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.sessionStorage.setItem('session', JSON.stringify(session));
  }

  setStorageValue(REMEMBER_DEVICE_KEY, String(rememberDevice));
  setStorageValue(OFFLINE_MODE_KEY, String(offlineMode));
};

const clearSessionData = () => {
  removeStorageValue('token');
  removeStorageValue('user');
  removeStorageValue(SESSION_KEY);
  removeStorageValue('session');
};

export const clearSession = () => {
  clearSessionData();
  removeStorageValue(REMEMBER_DEVICE_KEY);
  removeStorageValue(OFFLINE_MODE_KEY);
};

const isValidUserPayload = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return !!(value.email || value.name || value.username || value.id || value._id);
};

const hasValidStoredSession = () => {
  const rememberDevice = getStorageValue(REMEMBER_DEVICE_KEY) === 'true';
  const storageSet = rememberDevice ? [window.localStorage] : [window.sessionStorage, window.localStorage];

  for (const storage of storageSet) {
    if (!storage) continue;

    for (const key of [SESSION_KEY, 'session']) {
      const raw = storage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        if (parsed?.token && isValidUserPayload(parsed.user)) {
          return true;
        }
      } catch {
        // Ignora sessão inválida.
      }
    }

    const token = storage.getItem('token');
    const userRaw = storage.getItem('user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (isValidUserPayload(user) && String(token).trim().length > 20) {
          return true;
        }
      } catch {
        // Ignora sessão inválida.
      }
    }
  }

  return false;
};

export const sanitizeStoredAuth = () => {
  if (typeof window === 'undefined') return false;

  let foundInvalidData = false;

  for (const storage of getStorageBackends()) {
    for (const key of AUTH_STORAGE_KEYS) {
      try {
        const raw = storage.getItem(key);
        if (raw === null) continue;

        const isSessionKey = key === SESSION_KEY || key === 'session';
        const isUserKey = key === 'user';
        const isTokenKey = key === 'token';
        const isRememberKey = key === REMEMBER_DEVICE_KEY;
        const isOfflineKey = key === OFFLINE_MODE_KEY;

        if (isSessionKey) {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.token || !isValidUserPayload(parsed.user)) {
              storage.removeItem(key);
              foundInvalidData = true;
            }
          } catch {
            storage.removeItem(key);
            foundInvalidData = true;
          }
          continue;
        }

        if (isUserKey) {
          try {
            const parsed = JSON.parse(raw);
            if (!isValidUserPayload(parsed)) {
              storage.removeItem(key);
              foundInvalidData = true;
            }
          } catch {
            storage.removeItem(key);
            foundInvalidData = true;
          }
          continue;
        }

        if (isTokenKey) {
          const token = String(raw).trim();
          if (!token || token.length < 10) {
            storage.removeItem(key);
            foundInvalidData = true;
          }
        }

        if (isRememberKey || isOfflineKey) {
          if (raw !== 'true' && raw !== 'false') {
            storage.removeItem(key);
            foundInvalidData = true;
          }
        }
      } catch {
        // Ignora storage indisponível.
      }
    }
  }

  if (!hasValidStoredSession()) {
    clearSession();
    return true;
  }

  return foundInvalidData;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const session = readStoredSession();
    return session?.user || null;
  });
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const cleaned = sanitizeStoredAuth();
    if (cleaned) {
      setUser(null);
    }

    restoreSession();

    const handleAuthChange = () => restoreSession();
    window.addEventListener('auth:changed', handleAuthChange);
    return () => window.removeEventListener('auth:changed', handleAuthChange);
  }, []);

  const login = async (email, password, rememberDevice = false, offlineMode = false) => {
    clearSessionData();
    setUser(null);

    const { data } = await api.post('/auth/login', { email, password });
    const userData = data.user || data;
    persistSession(data.token, userData, rememberDevice, offlineMode);
    setUser(userData);
    window.dispatchEvent(new Event('auth:changed'));
    return data;
  };

  const register = async (name, email, password, rememberDevice = false, offlineMode = false) => {
    clearSessionData();
    setUser(null);

    const { data } = await api.post('/auth/register', { name, email, password });
    const userData = data.user || data;
    persistSession(data.token, userData, rememberDevice, offlineMode);
    setUser(userData);
    window.dispatchEvent(new Event('auth:changed'));
    return data;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    window.dispatchEvent(new Event('auth:changed'));
  };

  const updateUser = (newData) => {
    setUser(prev => {
      const nextUser = { ...(prev || {}), ...newData };
      const sessionData = readStoredSession();
      
      if (sessionData && sessionData.token) {
        const rememberDevice = getStorageValue(REMEMBER_DEVICE_KEY) === 'true';
        const offlineMode = getStorageValue(OFFLINE_MODE_KEY) === 'true';
        persistSession(sessionData.token, nextUser, rememberDevice, offlineMode);
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
