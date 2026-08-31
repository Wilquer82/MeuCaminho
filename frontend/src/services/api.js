import axios from 'axios';

const productionApiUrl = 'https://meucaminhoback.onrender.com/api';
const localApiUrl = 'http://localhost:3000/api';

function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  if (typeof window === 'undefined') {
    return localApiUrl;
  }

  const isNativeMobile = !!window.Capacitor || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const currentHost = window.location.hostname;
  const isLocalHost = ['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(currentHost);

  if (isNativeMobile) {
    return productionApiUrl;
  }

  if (import.meta.env.DEV && isLocalHost) {
    return localApiUrl;
  }

  if (import.meta.env.DEV) {
    return productionApiUrl;
  }

  if (currentHost && !isLocalHost) {
    return `https://${currentHost}/api`;
  }

  return localApiUrl;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl()
});

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;

  const candidates = [
    window.localStorage.getItem('token'),
    window.sessionStorage.getItem('token'),
    JSON.parse(window.localStorage.getItem('authSession') || 'null')?.token,
    JSON.parse(window.sessionStorage.getItem('authSession') || 'null')?.token,
    JSON.parse(window.localStorage.getItem('session') || 'null')?.token,
    JSON.parse(window.sessionStorage.getItem('session') || 'null')?.token
  ];

  return candidates.find(Boolean) || null;
};

api.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
      ['token', 'authSession', 'session', 'user', 'rememberDevice', 'offlineMode'].forEach(key => {
        try { window.localStorage.removeItem(key); } catch {}
        try { window.sessionStorage.removeItem(key); } catch {}
      });
      window.dispatchEvent(new Event('auth:changed'));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
