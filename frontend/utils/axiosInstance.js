import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;