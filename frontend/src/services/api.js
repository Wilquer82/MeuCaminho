import axios from 'axios';

const productionApiUrl = 'https://meucaminhoback.onrender.com/api';
const localApiUrl = 'http://localhost:3000/api';

function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  const isNativeMobile = typeof window !== 'undefined' && (
    !!window.Capacitor ||
    /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  );

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
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

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authSession');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
