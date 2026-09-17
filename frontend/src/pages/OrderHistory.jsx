import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import Spinner from '../components/Spinner';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="card p-5 block hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{o._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mt-1">{o.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${o.totalPrice.toFixed(2)}</p>
                  <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}