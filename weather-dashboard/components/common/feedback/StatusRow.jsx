export default function StatusRow({ lastSearched, favorites = [], onChipClick, theme = "dark" }) {
  if (!lastSearched && (!favorites || favorites.length === 0)) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4" aria-live="polite">
      {lastSearched ? (
        <button
          type="button"
          onClick={() => onChipClick?.(lastSearched)}
          className={`text-sm rounded-full border px-3 py-1 transition-all focus:outline-none focus-visible:ring ${
            theme === "dark"
              ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
              : "border-slate-300/50 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          Last: {lastSearched}
        </button>
      ) : null}
      {favorites?.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onChipClick?.(city)}
          className={`text-sm rounded-full border px-3 py-1 transition-all focus:outline-none focus-visible:ring ${
            theme === "dark"
              ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
              : "border-slate-300/50 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          ★ {city}
        </button>
      ))}
    </div>
  );
}

