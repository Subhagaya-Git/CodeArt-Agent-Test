import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const page = parseInt(params.get('page')) || 1;
  const category = params.get('category') || '';
  const search = params.get('search') || '';

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ page, category, search, limit: 12 })
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const buildLink = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    return `/products?${next.toString()}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input className="input sm:max-w-xs" placeholder="Search..." value={search} onChange={(e) => update('search', e.target.value)} />
        <select className="input sm:max-w-xs" value={category} onChange={(e) => update('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} buildLink={buildLink} />
        </>
      )}
    </div>
  );
}