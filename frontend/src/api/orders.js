import api from './axios';

export const checkout = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);