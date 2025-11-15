// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    console.log("➡️ API Request:", config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;


