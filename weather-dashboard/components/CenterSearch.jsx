import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

// Common city names for spelling suggestions
const commonCities = [
  "New York", "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas",
  "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver",
  "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville",
  "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Omaha",
  "Colorado Springs", "Raleigh", "Miami", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
  "London", "Paris", "Tokyo", "Berlin", "Madrid", "Rome", "Amsterdam", "Vienna", "Prague", "Barcelona",
  "Moscow", "Istanbul", "Cairo", "Dubai", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa",
  "Mexico City", "São Paulo", "Rio de Janeiro", "Buenos Aires", "Lima", "Bogotá", "Santiago", "Caracas", "Quito", "La Paz",
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Xi'an", "Nanjing", "Hangzhou", "Qingdao",
  "Seoul", "Bangkok", "Jakarta", "Manila", "Ho Chi Minh City", "Kuala Lumpur", "Singapore", "Hong Kong", "Taipei", "Osaka"
];

export default function CenterSearch({ onSearch, theme = "dark" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(commonCities, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true
  });

  // Handle search input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    setShowSuggestions(true);

    if (value.trim().length > 2) {
      const results = fuse.search(value);
      setSuggestions(results.slice(0, 5).map(result => result.item));
    } else {
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearch = (city = searchTerm) => {
    if (city.trim()) {
      onSearch(city.trim());
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSearch(suggestions[0]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (city) => {
    handleSearch(city);
  };

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

  // Clear typing indicator after delay
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  return (
    <div className="flex-1 max-w-md mx-8" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className={`transition-colors ${
            theme === "dark" ? "text-white/60" : "text-slate-500"
          }`} aria-hidden>🔍</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city..."
          className={`w-full pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-white/50"
              : "bg-white/90 border border-slate-300/70 text-slate-900 placeholder-slate-600 focus:ring-slate-400"
          }`}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
              theme === "dark" ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span aria-hidden>×</span>
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && (searchTerm.trim().length > 2) && (
        <div className={`absolute z-50 w-full mt-2 backdrop-blur-xl rounded-lg shadow-2xl max-h-60 overflow-y-auto transition-all duration-300 ${
          theme === "dark"
            ? "bg-white/20 border border-white/30"
            : "bg-white/95 border border-slate-200/70"
        }`}>
          {suggestions.length > 0 ? (
            <>
              <div className={`px-4 py-2 text-xs font-medium border-b transition-colors ${
                theme === "dark" 
                  ? "text-white/60 border-white/20" 
                  : "text-slate-500 border-slate-200/50"
              }`}>
                Did you mean?
              </div>
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(city)}
                  className={`w-full px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    theme === "dark"
                      ? "text-white hover:bg-white/20"
                      : "text-slate-900 hover:bg-slate-100/90"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg transition-colors ${
                      theme === "dark" ? "text-white/60" : "text-slate-400"
                    }`} aria-hidden>📍</span>
                    <div>
                      <div className="font-medium">{city}</div>
                      <div className={`text-xs transition-colors ${
                        theme === "dark" ? "text-white/50" : "text-slate-500"
                      }`}>
                        Click to search
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : searchTerm.trim().length > 2 ? (
            <div className={`px-4 py-3 text-center transition-colors ${
              theme === "dark" ? "text-white/60" : "text-slate-500"
            }`}>
              <div className="text-sm">No suggestions found</div>
              <div className="text-xs mt-1">Press Enter to search anyway</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
