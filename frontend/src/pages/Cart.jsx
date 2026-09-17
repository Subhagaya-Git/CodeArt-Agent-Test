import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

export default function Cart() {
  const { cart, loading, update, remove } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Link to="/products" className="btn-primary mt-4 inline-block">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((i) => {
          const p = i.product;
          if (!p) return null;
          return (
            <div key={p._id} className="card p-4 flex items-center gap-4">
              <img src={p.image_url} alt={p.name} className="h-20 w-20 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <Link to={`/products/${p._id}`} className="font-medium hover:text-brand-600">{p.name}</Link>
                <p className="text-gray-500">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-outline px-2" onClick={() => update(p._id, Math.max(1, i.quantity - 1))}>-</button>
                <span className="w-8 text-center">{i.quantity}</span>
                <button className="btn-outline px-2" onClick={() => update(p._id, Math.min(p.stock, i.quantity + 1))}>+</button>
              </div>
              <span className="w-20 text-right font-semibold">${(p.price * i.quantity).toFixed(2)}</span>
              <button onClick={() => remove(p._id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
        <button onClick={() => navigate('/checkout')} className="btn-primary">Proceed to checkout</button>
      </div>
    </div>
  );
}