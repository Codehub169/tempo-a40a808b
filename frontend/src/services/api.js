import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api', // Assuming the backend is served on the same domain, proxied to /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// Example API functions (can be expanded as needed)

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getUserProfile = () => api.get('/users/profile');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getUserOrders = () => api.get('/orders/myorders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getSellerOrders = () => api.get('/orders/seller');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// Users (Profile updates etc.)
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);
