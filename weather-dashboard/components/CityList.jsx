import { useState, useEffect } from "react";

export default function CityList({ cities = [], activeCity = "", onSelect, onToggleFavorite, favorites = [], theme = "dark" }) {
  const [recentCities, setRecentCities] = useState([]);

  useEffect(() => {
    // Load recent cities from localStorage
    const stored = localStorage.getItem('recentCities');
    if (stored) {
      try {
        setRecentCities(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse recent cities from localStorage');
      }
    }
  }, []);

  const handleCitySelect = (city) => {
    // Add to recent cities
    const updatedRecent = [city, ...recentCities.filter(c => c !== city)].slice(0, 5);
    setRecentCities(updatedRecent);
    localStorage.setItem('recentCities', JSON.stringify(updatedRecent));
    onSelect?.(city);
  };

  const handleToggleFavorite = (e, city) => {
    e.stopPropagation();
    onToggleFavorite?.(city);
  };

  const isFavorite = (city) => favorites.includes(city);
  const isActive = (city) => activeCity && city.toLowerCase() === activeCity.toLowerCase();

  // Combine recent cities with all cities, removing duplicates
  const allCities = Array.from(new Set([...recentCities, ...cities]));

  return (
    <div className="space-y-4">
      {/* Recent Cities */}
      {recentCities.length > 0 && (
        <div>
          <h3 className={`text-sm font-medium mb-2 transition-colors ${
            theme === "dark" ? "text-white/80" : "text-slate-700"
          }`}>Recent</h3>
          <div className="space-y-1">
            {recentCities.map((city, index) => (
              <CityListItem
                key={`recent-${index}`}
                city={city}
                isActive={isActive(city)}
                isFavorite={isFavorite(city)}
                onSelect={() => handleCitySelect(city)}
                onToggleFavorite={(e) => handleToggleFavorite(e, city)}
                showRecent={true}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Cities */}
      <div>
        <h3 className={`text-sm font-medium mb-2 transition-colors ${
          theme === "dark" ? "text-white/80" : "text-slate-700"
        }`}>All Cities</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {allCities.map((city, index) => (
            <CityListItem
              key={`all-${index}`}
              city={city}
              isActive={isActive(city)}
              isFavorite={isFavorite(city)}
              onSelect={() => handleCitySelect(city)}
              onToggleFavorite={(e) => handleToggleFavorite(e, city)}
              showRecent={false}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CityListItem({ city, isActive, isFavorite, onSelect, onToggleFavorite, showRecent, theme = "dark" }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-amber-400/20 border border-amber-400/50 text-amber-200 shadow-[0_0_0_1px_rgba(255,155,61,.3)]"
          : theme === "dark"
            ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            : "bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/50 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm" aria-hidden>
          {showRecent ? "🕒" : "📍"}
        </span>
        <span className="text-sm truncate">{city}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`p-1 rounded-full transition-all duration-200 ${
            isFavorite
              ? "text-red-400 hover:text-red-300"
              : theme === "dark"
                ? "text-white/40 hover:text-red-400"
                : "text-slate-400 hover:text-red-400"
          }`}
          aria-label={isFavorite ? `Remove ${city} from favorites` : `Add ${city} to favorites`}
        >
          <span className="text-sm" aria-hidden>
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </button>
        <span className={`group-hover:opacity-100 transition-colors ${
          theme === "dark" ? "text-white/40 group-hover:text-white/60" : "text-slate-400 group-hover:text-slate-600"
        }`} aria-hidden>
          ›
        </span>
      </div>
    </button>
  );
}
