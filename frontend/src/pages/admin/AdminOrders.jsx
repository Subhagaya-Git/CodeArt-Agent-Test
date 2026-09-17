import { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import Spinner from '../../components/Spinner';

const STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminOrders({ limit: 50 }).then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const change = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-mono">#{o._id.slice(-8)}</td>
                <td className="p-3">{o.user?.name || '—'}</td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3">${o.totalPrice.toFixed(2)}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => change(o._id, e.target.value)} className="input py-1 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}