export default function MetricTile({ label, value, unit, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:translate-y-[-4px] hover:shadow-lg transition">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-2">
        {icon ? <span aria-hidden>{icon}</span> : null}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">
        {value}
        {unit ? <span className="ml-1 text-slate-500 dark:text-slate-400">{unit}</span> : null}
      </div>
    </div>
  );
}

