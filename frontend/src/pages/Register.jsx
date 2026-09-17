import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Register'}</button>
        <p className="text-center text-sm text-gray-600">
          Have an account? <Link to="/login" className="text-brand-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}