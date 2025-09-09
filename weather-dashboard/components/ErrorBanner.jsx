export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-800 px-4 py-3"
    >
      {message}
    </div>
  );
}

