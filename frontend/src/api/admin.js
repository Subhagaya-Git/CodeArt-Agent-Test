import api from './axios';

export const getStats = () => api.get('/admin/stats');
export const getAdminOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });