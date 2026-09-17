import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-2xl font-bold">Order placed successfully!</h1>
      <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
      {order && (
        <div className="card p-6 mt-6 mx-auto max-w-md text-left">
          <p className="text-sm text-gray-500">Order ID: {order._id}</p>
          <p className="mt-1">Total: <strong>${order.totalPrice.toFixed(2)}</strong></p>
          <p className="mt-1">Status: {order.status}</p>
        </div>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/orders" className="btn-primary">View orders</Link>
        <Link to="/products" className="btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}