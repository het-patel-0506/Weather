export default function LeftNav({ cities = [], activeCity = "", onSelect, onAdd }) {
  return (
    <nav aria-label="Cities" className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300/80">Cities</div>
        <button
          type="button"
          onClick={onAdd}
          className="h-7 w-7 rounded-full border border-white/10 text-slate-200/80 hover:bg-white/10 transition focus:outline-none focus-visible:ring"
          aria-label="Add city"
          title="Add city"
        >
          +
        </button>
      </div>
      {cities.map((city) => {
        const isActive = activeCity && city.toLowerCase() === activeCity.toLowerCase();
        return (
          <button
            key={city}
            type="button"
            onClick={() => onSelect?.(city)}
            className={
              "group flex items-center justify-between w-full text-left px-3 py-2 rounded-full transition outline-none " +
              (isActive
                ? "bg-amber-400/10 border border-amber-400/50 text-amber-200 shadow-[0_0_0_1px_rgba(255,155,61,.3)]"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200")
            }
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>📍</span>
              <span className="text-sm">{city}</span>
            </span>
            <span aria-hidden className="opacity-60 group-hover:opacity-100 transition">›</span>
          </button>
        );
      })}
    </nav>
  );
}


