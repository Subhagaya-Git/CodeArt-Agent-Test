import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../../api/admin';
import Spinner from '../../components/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, to: '/admin/products' },
    { label: 'Total Orders', value: stats.totalOrders, to: '/admin/orders' },
    { label: 'Total Users', value: stats.totalUsers, to: null },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, to: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
            {c.to && <Link to={c.to} className="text-sm text-brand-600 mt-2 inline-block">View &rarr;</Link>}
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link to="/admin/products" className="btn-primary">Manage Products</Link>
        <Link to="/admin/orders" className="btn-outline">Manage Orders</Link>
      </div>
    </div>
  );
}