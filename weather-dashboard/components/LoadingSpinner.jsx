export default function LoadingSpinner() {
  return (
    <div role="status" aria-live="polite" className="py-12 flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

