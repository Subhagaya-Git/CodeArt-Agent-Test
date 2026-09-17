import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function ProductCard({ product }) {
  const out = product.stock <= 0;
  return (
    <Link to={`/products/${product._id}`} className="card overflow-hidden hover:shadow-md transition group">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition" loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs uppercase tracking-wide text-gray-400">{product.category}</span>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        <div className="mt-1"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-600">${product.price.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${out ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {out ? 'Out of stock' : 'In stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}