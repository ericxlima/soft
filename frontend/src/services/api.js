import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;