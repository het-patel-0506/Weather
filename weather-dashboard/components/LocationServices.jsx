import { useState } from 'react';

export default function LocationServices({ 
  onUseLocation,
  isGeolocating,
  isUsingDeviceLocation,
  theme = "dark"
}) {
  const [showLocationBadge, setShowLocationBadge] = useState(isUsingDeviceLocation);

  const handleUseLocation = () => {
    onUseLocation();
    setShowLocationBadge(true);
  };

  return (
    <div className="space-y-4">
      {/* Use My Location CTA */}
      <div className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
        theme === "dark"
          ? "border-slate-600 hover:border-blue-500 bg-slate-800/30"
          : "border-slate-300 hover:border-blue-400 bg-slate-50"
      }`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className={`p-3 rounded-full ${
              theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
            }`}>
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className={`font-semibold mb-2 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Use My Location
          </h3>
          
          <p className={`text-sm mb-4 ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}>
            Get weather for your current location instantly
          </p>
          
          <button
            onClick={handleUseLocation}
            disabled={isGeolocating}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isGeolocating
                ? theme === "dark"
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
            }`}
          >
            {isGeolocating ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Location...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use My Location
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Location Status Badge */}
      {showLocationBadge && isUsingDeviceLocation && (
        <div className={`p-3 rounded-lg ${
          theme === "dark" 
            ? "bg-green-900/20 border border-green-800" 
            : "bg-green-50 border border-green-200"
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${
              theme === "dark" ? "text-green-300" : "text-green-700"
            }`}>
              Using device location
            </span>
          </div>
          <p className={`text-xs mt-1 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}>
            Weather data is automatically updated for your current location
          </p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className={`p-3 rounded-lg ${
        theme === "dark" 
          ? "bg-slate-800/30 border border-slate-700" 
          : "bg-slate-50 border border-slate-200"
      }`}>
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className={`text-xs font-medium ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}>
              Privacy Protected
            </p>
            <p className={`text-xs mt-1 ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>
              Your location is only used to fetch weather data and is never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
