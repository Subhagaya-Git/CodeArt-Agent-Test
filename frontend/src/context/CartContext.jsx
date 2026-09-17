import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data.data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (productId, quantity = 1) => {
    const res = await cartApi.addItem({ productId, quantity });
    setCart(res.data.data);
  }, []);

  const update = useCallback(async (productId, quantity) => {
    const res = await cartApi.updateItem({ productId, quantity });
    setCart(res.data.data);
  }, []);

  const remove = useCallback(async (productId) => {
    const res = await cartApi.removeItem(productId);
    setCart(res.data.data);
  }, []);

  const clear = useCallback(async () => {
    await cartApi.clearCart();
    setCart({ items: [] });
  }, []);

  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, count, refresh, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);