import axios from 'axios';

function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

  if (import.meta.env.DEV) {
    if (currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3000/api`;
    }
    return 'http://localhost:3000/api';
  }

  if (currentHost && !['localhost', '127.0.0.1'].includes(currentHost)) {
    return `https://${currentHost}/api`;
  }

  return 'https://meucaminhoback.onrender.com/api';
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
