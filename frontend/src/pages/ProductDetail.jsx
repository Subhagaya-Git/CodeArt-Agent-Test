import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    getProduct(id).then((res) => setProduct(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const addToCart = async () => {
    try {
      await add(product._id, qty);
      navigate('/cart');
    } catch (e) {
      setErr(e.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      await addReview(product._id, review);
      setMsg('Review added!');
      setReview({ rating: 5, comment: '' });
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <Spinner />;
  if (!product) return <p className="text-center py-12 text-gray-500">Product not found.</p>;

  const out = product.stock <= 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div>
        <span className="text-sm uppercase text-gray-400">{product.category}</span>
        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
        <div className="mt-2"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
        <p className="mt-4 text-2xl font-bold text-brand-600">${product.price.toFixed(2)}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>
        <p className={`mt-3 text-sm font-medium ${out ? 'text-red-600' : 'text-green-600'}`}>
          {out ? 'Out of stock' : `${product.stock} in stock`}
        </p>

        {!out && (
          <div className="mt-6 flex items-center gap-3">
            <select className="input max-w-[5rem]" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={addToCart} className="btn-primary">Add to cart</button>
          </div>
        )}
        {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
      </div>

      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {product.reviews?.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        <div className="space-y-3">
          {product.reviews?.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{r.name}</span>
                <Rating value={r.rating} />
              </div>
              <p className="mt-1 text-gray-700 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form onSubmit={submitReview} className="card p-4 mt-6 space-y-3">
            <h3 className="font-semibold">Write a review</h3>
            {msg && <p className="text-green-600 text-sm">{msg}</p>}
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <select className="input max-w-[8rem]" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea className="input" rows={3} placeholder="Your comment..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
            <button className="btn-primary">Submit review</button>
          </form>
        )}
      </div>
    </div>
  );
}