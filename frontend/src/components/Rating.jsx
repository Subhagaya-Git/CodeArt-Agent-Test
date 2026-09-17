export default function Rating({ value = 0, text }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`h-4 w-4 ${n <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.99c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.36 1.12l1.29 3.96c.3.92-.76 1.69-1.55 1.12l-3.37-2.45a1 1 0 00-1.18 0l-3.37 2.45c-.79.57-1.85-.2-1.55-1.12l1.29-3.96a1 1 0 00-.36-1.12L2.06 9.45c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.96z" />
        </svg>
      ))}
      {text && <span className="ml-1 text-sm text-gray-600">{text}</span>}
    </div>
  );
}