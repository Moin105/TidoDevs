import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#02040A] text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Page not found</h1>
        <p className="text-gray-400">
          The page you are looking for does not exist, or the link was malformed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo via-violet to-blue text-white font-medium"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
