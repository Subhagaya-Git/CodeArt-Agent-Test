import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkout } from '../api/orders';
import Spinner from '../components/Spinner';

export default function Checkout() {
  const { cart, loading, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const items = cart.items || [];
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: form,
      };
      const res = await checkout(payload);
      await clear();
      navigate('/orders/success', { state: { order: res.data.data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner />;
  if (items.length === 0) {
    return <p className="text-center py-12 text-gray-500">Your cart is empty. Add products first.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={submit} className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Shipping Address</h2>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input className="input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
          </div>
          <div className="bg-brand-50 p-3 rounded-lg text-sm text-brand-700">
            Payment method: <strong>Mock Payment</strong> (no real charge)
          </div>
          <button disabled={placing} className="btn-primary w-full">{placing ? 'Placing order...' : 'Place order'}</button>
        </form>

        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.product._id} className="flex justify-between text-sm">
                <span className="text-gray-700">{i.product.name} × {i.quantity}</span>
                <span>${(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}