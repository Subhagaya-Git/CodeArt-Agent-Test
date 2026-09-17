import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import Spinner from '../../components/Spinner';

const empty = { name: '', description: '', price: '', stock: '', category: '', image_url: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 }).then((res) => setProducts(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing('new'); setForm(empty); setError(''); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image_url: p.image_url || '' });
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing === 'new') await createProduct(payload);
      else await updateProduct(editing, payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openNew} className="btn-primary">+ Add product</button>
      </div>

      {editing && (
        <form onSubmit={submit} className="card p-6 mb-6 space-y-3">
          <h2 className="font-semibold">{editing === 'new' ? 'New product' : 'Edit product'}</h2>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <input className="input" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
          <textarea className="input" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="input" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <div className="flex gap-2">
            <button className="btn-primary">Save</button>
            <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-brand-600">Edit</button>
                    <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}