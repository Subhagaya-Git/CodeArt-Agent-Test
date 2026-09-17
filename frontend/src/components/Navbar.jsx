import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setQ('');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-brand-600">ShopHub</Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/products" className={linkClass}>Products</NavLink>
            {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          </nav>

          <form onSubmit={submit} className="hidden sm:flex flex-1 max-w-xs">
            <input
              className="input"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative btn-outline" aria-label="Cart">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">{count}</span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="btn-outline">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 pb-2">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>
      </div>
    </header>
  );
}