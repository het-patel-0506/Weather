import { useState, useEffect } from 'react';

export default function LocationFallbackModal({ 
  isOpen, 
  onClose, 
  onSearch, 
  error, 
  theme = "dark" 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedCities] = useState([
    { name: 'New York City', country: 'US', lat: 40.7128, lon: -74.0060 },
    { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
    { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 }
  ]);

  useEffect(() => {
    if (isOpen) {
      // Focus the search input when modal opens
      const searchInput = document.getElementById('location-search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onClose();
    }
  };

  const handleCitySelect = (city) => {
    onSearch(`${city.name}, ${city.country}`);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden ${
          theme === "dark" 
            ? "bg-slate-900 border border-slate-700" 
            : "bg-white border border-slate-200"
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === "dark" ? "border-slate-700" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                Location Access Needed
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                We need your location to show local weather
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" 
                ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className={`p-4 rounded-lg ${
              theme === "dark" 
                ? "bg-red-900/20 border border-red-800 text-red-300" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-medium">Unable to access your location</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className={`p-4 rounded-lg ${
            theme === "dark" 
              ? "bg-blue-900/20 border border-blue-800 text-blue-300" 
              : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">How to enable location access:</p>
                <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location permissions</li>
                  <li>Refresh the page and try again</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="location-search-input" className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                Or search for a city manually:
              </label>
              <div className="flex gap-2">
                <input
                  id="location-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter city name..."
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchQuery.trim()
                      ? theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      : theme === "dark"
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Suggested Cities */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Or try one of these popular cities:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {suggestedCities.map((city) => (
                <button
                  key={`${city.name}-${city.country}`}
                  onClick={() => handleCitySelect(city)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    theme === "dark"
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                  }`}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className={`text-xs ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {city.country}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Try Again Button */}
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={() => {
                onClose();
                // Trigger location request again
                window.dispatchEvent(new CustomEvent('requestLocation'));
              }}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              Try Location Access Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
