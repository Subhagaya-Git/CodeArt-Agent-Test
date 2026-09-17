import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-8 sm:p-12 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Welcome to ShopHub</h1>
        <p className="mt-2 text-brand-50 max-w-xl">Quality products at great prices. Browse our catalog, add to cart, and check out in seconds.</p>
        <Link to="/products" className="mt-4 inline-block bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-50">Shop now</Link>
      </section>

      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}