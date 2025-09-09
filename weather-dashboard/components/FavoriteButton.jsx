export default function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite ? "true" : "false"}
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring"
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <span aria-hidden>{isFavorite ? "★" : "☆"}</span>
      <span>{isFavorite ? "Favorited" : "Favorite"}</span>
    </button>
  );
}

