export default function ForecastPanel({ days = [] }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="text-slate-300 text-sm mb-3">5 Day Forecast</div>
      <div className="grid grid-cols-2 gap-3">
        {days.map((d, i) => (
          <button key={i} type="button" className="rounded-xl bg-white/5 border border-white/10 p-3 text-left hover:scale-[1.03] transition focus:outline-none focus-visible:ring text-slate-200" aria-pressed="false">
            <div className="text-xs text-slate-400">{d.label}</div>
            <div className="text-2xl">{d.icon || "⛅"}</div>
            <div className="text-xs text-slate-300">{d.min} / {d.max}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


