import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import Spinner from '../components/Spinner';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return <p className="text-gray-500">Order not found.</p>;

  return (
    <div>
      <Link to="/orders" className="text-brand-600 text-sm">&larr; Back to orders</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Order #{order._id.slice(-8)}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-5 md:col-span-2">
          <h2 className="font-semibold mb-3">Items</h2>
          <div className="space-y-3">
            {order.items.map((i) => (
              <div key={i.product} className="flex justify-between text-sm">
                <span>{i.name} × {i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Details</h2>
          <p className="text-sm">Status: <strong>{order.status}</strong></p>
          <p className="text-sm mt-1">Payment: {order.paymentMethod}</p>
          <p className="text-sm mt-1">Placed: {new Date(order.createdAt).toLocaleString()}</p>
          <h3 className="font-medium mt-4 mb-1">Shipping to</h3>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>
    </div>
  );
}