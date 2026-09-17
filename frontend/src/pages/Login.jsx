import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const from = location.state?.from?.pathname || (data.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-center text-sm text-gray-600">
          No account? <Link to="/register" className="text-brand-600">Register</Link>
        </p>
      </form>
    </div>
  );
}