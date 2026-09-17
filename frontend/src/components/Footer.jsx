export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        <p>Built with React, Express &amp; MongoDB.</p>
      </div>
    </footer>
  );
}