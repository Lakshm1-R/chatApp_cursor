// Axios API helper for backend requests
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chatapp-cursor.onrender.com/api',
});

// Attach JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

export default API; 