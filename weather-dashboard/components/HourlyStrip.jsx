export default function HourlyStrip({ hours = [] }) {
  return (
    <div className="mt-6">
      <div className="text-slate-300 text-sm mb-2">24 Hours</div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hours.map((h, i) => (
          <button
            key={i}
            className="min-w-[100px] rounded-xl bg-white/5 border border-white/10 px-3 py-3 text-left text-slate-200 hover:scale-[1.03] hover:shadow transition focus:outline-none focus-visible:ring"
            type="button"
            aria-label={`${h.time} — ${h.temp}`}
          >
            <div className="text-xs text-slate-400">{h.time}</div>
            <div className="text-slate-200 font-semibold">{h.temp}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


