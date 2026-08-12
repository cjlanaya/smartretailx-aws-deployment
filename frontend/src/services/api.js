import axios from 'axios';

const USER_API         = 'http://localhost:3001/api/v1';
const PRODUCT_API      = 'http://localhost:3002/api/v1';
const ORDER_API        = 'http://localhost:3003/api/v1';
const PAYMENT_API      = 'http://localhost:3005/api/v1';
const NOTIFICATION_API = 'http://localhost:3006/api/v1';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Auth
export const register    = (data) => axios.post(`${USER_API}/auth/register`, data);
export const login       = (data) => axios.post(`${USER_API}/auth/login`, data);
export const getProfile  = ()     => axios.get(`${USER_API}/users/profile`, getHeaders());
export const getAllUsers  = ()     => axios.get(`${USER_API}/users`, getHeaders());
export const deleteUser  = (id)   => axios.delete(`${USER_API}/users/${id}`, getHeaders());

// Products
export const getProducts   = (params)   => axios.get(`${PRODUCT_API}/products`, { params });
export const getProduct    = (id)       => axios.get(`${PRODUCT_API}/products/${id}`);
export const createProduct = (data)     => axios.post(`${PRODUCT_API}/products`, data, getHeaders());
export const updateProduct = (id, data) => axios.put(`${PRODUCT_API}/products/${id}`, data, getHeaders());
export const deleteProduct = (id)       => axios.delete(`${PRODUCT_API}/products/${id}`, getHeaders());

// Orders
export const placeOrder        = (data)       => axios.post(`${ORDER_API}/orders`, data, getHeaders());
export const getMyOrders       = ()           => axios.get(`${ORDER_API}/orders`, getHeaders());
export const getOrder          = (id)         => axios.get(`${ORDER_API}/orders/${id}`, getHeaders());
export const getAllOrders       = ()           => axios.get(`${ORDER_API}/orders/admin/all`, getHeaders());
export const updateOrderStatus = (id, status) => axios.patch(`${ORDER_API}/orders/${id}/status`, { status }, getHeaders());

// Payments
export const processPayment  = (data)    => axios.post(`${PAYMENT_API}/payments/process`, data, getHeaders());
export const getMyPayments   = ()        => axios.get(`${PAYMENT_API}/payments/my`, getHeaders());
export const getAllPayments   = ()        => axios.get(`${PAYMENT_API}/payments`, getHeaders());
export const refundPayment   = (id)      => axios.post(`${PAYMENT_API}/payments/refund/${id}`, {}, getHeaders());
export const getOrderPayment = (orderId) => axios.get(`${PAYMENT_API}/payments/order/${orderId}`, getHeaders());

// Notifications
export const getMyNotifications    = ()   => axios.get(`${NOTIFICATION_API}/notifications/my`, getHeaders());
export const getUnreadCount        = ()   => axios.get(`${NOTIFICATION_API}/notifications/unread-count`, getHeaders());
export const markNotificationRead  = (id) => axios.patch(`${NOTIFICATION_API}/notifications/${id}/read`, {}, getHeaders());
export const markAllRead           = ()   => axios.patch(`${NOTIFICATION_API}/notifications/read-all`, {}, getHeaders());
export const getAdminNotifications = ()   => axios.get(`${NOTIFICATION_API}/notifications/admin`, getHeaders());
export const getAdminUnreadCount   = ()   => axios.get(`${NOTIFICATION_API}/notifications/admin/unread-count`, getHeaders());
export const markAdminAllRead      = ()   => axios.patch(`${NOTIFICATION_API}/notifications/admin/read-all`, {}, getHeaders());

// ── Inventory ─────────────────────────────────────────────────
const INVENTORY_API = 'http://localhost:3004/api/v1';
export const getAllInventory  = ()          => axios.get(`${INVENTORY_API}/inventory`, getHeaders());
export const addInventory     = (data)      => axios.post(`${INVENTORY_API}/inventory`, data, getHeaders());
export const restockProduct   = (id, qty)   => axios.patch(`${INVENTORY_API}/inventory/${id}/restock`, { quantity: qty }, getHeaders());
export const getLowStock      = ()          => axios.get(`${INVENTORY_API}/inventory/alerts/low-stock`, getHeaders());
