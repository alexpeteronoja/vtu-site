import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear cookies
      Cookies.remove('userAccessToken');
      Cookies.remove('userRole');
      Cookies.remove('userData');
      
      // Redirect to login (avoiding useNavigate since we are outside React component)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
