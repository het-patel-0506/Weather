export default function Spinner({ label = "Fetching latest weather…" }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <svg className="h-6 w-6 animate-spin text-sky-600" viewBox="0 0 24 24" aria-hidden>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}

