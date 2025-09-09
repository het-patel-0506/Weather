import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

export default function CitySearch({ cities = [], onSelect, onAdd, theme = "dark" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(cities, {
    keys: ['name'],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCities(cities);
    } else {
      const results = fuse.search(searchTerm);
      setFilteredCities(results.map(result => result.item));
    }
  }, [searchTerm, cities]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleCitySelect = (city) => {
    setSearchTerm("");
    setShowSuggestions(false);
    onSelect?.(city);
  };

  const handleAddCity = () => {
    if (searchTerm.trim()) {
      onAdd?.(searchTerm.trim());
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCities.length > 0) {
        handleCitySelect(filteredCities[0]);
      } else if (searchTerm.trim()) {
        handleAddCity();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className={`${theme === "dark" ? "text-white/60" : "text-slate-500"}`} aria-hidden>🔍</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search cities..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                      : "bg-white/90 border border-slate-300/70 text-slate-900 placeholder-slate-600 focus:ring-slate-400"
                  }`}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
              theme === "dark" ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span aria-hidden>×</span>
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && (searchTerm || filteredCities.length > 0) && (
                <div className={`absolute z-50 w-full mt-1 backdrop-blur-xl rounded-lg shadow-2xl max-h-60 overflow-y-auto transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/20 border border-white/30"
                    : "bg-white/95 border border-slate-200/70"
                }`}>
          {filteredCities.length > 0 ? (
            filteredCities.slice(0, 8).map((city, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCitySelect(city)}
                        className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          theme === "dark"
                            ? "text-white hover:bg-white/20"
                            : "text-slate-900 hover:bg-slate-100/90"
                        }`}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden>📍</span>
                  <span className="text-sm">{city}</span>
                </div>
              </button>
            ))
          ) : searchTerm.trim() ? (
            <button
              type="button"
              onClick={handleAddCity}
                      className={`w-full px-4 py-2 text-left transition-colors rounded-lg ${
                        theme === "dark"
                          ? "text-white hover:bg-white/20"
                          : "text-slate-900 hover:bg-slate-100/90"
                      }`}
            >
              <div className="flex items-center gap-2">
                <span aria-hidden>➕</span>
                <span className="text-sm">Add "{searchTerm}"</span>
              </div>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
