import { Link } from 'react-router-dom';

export default function Pagination({ page, pages, buildLink }) {
  if (pages <= 1) return null;
  const items = [];
  for (let i = 1; i <= pages; i++) {
    items.push(
      <Link
        key={i}
        to={buildLink(i)}
        className={`px-3 py-1.5 rounded-lg text-sm ${i === page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
      >
        {i}
      </Link>
    );
  }
  return <div className="flex flex-wrap items-center gap-2 justify-center mt-8">{items}</div>;
}