export default function StatusRow({ lastSearched, favorites = [], onChipClick }) {
  if (!lastSearched && (!favorites || favorites.length === 0)) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4" aria-live="polite">
      {lastSearched ? (
        <button
          type="button"
          onClick={() => onChipClick?.(lastSearched)}
          className="text-sm rounded-full border px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all focus:outline-none focus-visible:ring"
        >
          Last: {lastSearched}
        </button>
      ) : null}
      {favorites?.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onChipClick?.(city)}
          className="text-sm rounded-full border px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all focus:outline-none focus-visible:ring"
        >
          ★ {city}
        </button>
      ))}
    </div>
  );
}

