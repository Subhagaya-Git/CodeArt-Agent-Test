import api from './axios';

export const getCart = () => api.get('/cart');
export const addItem = (data) => api.post('/cart/items', data);
export const updateItem = (data) => api.put('/cart/items', data);
export const removeItem = (productId) => api.delete(`/cart/items/${productId}`);
export const clearCart = () => api.delete('/cart');