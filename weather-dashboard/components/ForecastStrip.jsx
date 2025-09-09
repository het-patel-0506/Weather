export default function ForecastStrip({ days = [] }) {
  if (!days.length) {
    return (
      <div className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-4 lg:p-6 text-sm text-slate-600 dark:text-slate-300">
        No forecast available.
      </div>
    );
  }
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-4 lg:p-6">
      <div className="overflow-x-auto flex gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {days.map((d, i) => (
          <button
            key={i}
            type="button"
            className="min-w-[120px] rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left focus:outline-none focus-visible:ring transition"
            aria-label={`${d.label}: ${d.min} to ${d.max}`}
          >
            <div className="text-sm font-medium">{d.label}</div>
            <div className="text-2xl">{d.icon || "⛅"}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {d.min} / {d.max}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

