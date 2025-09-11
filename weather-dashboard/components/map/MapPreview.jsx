export default function MapPreview({ 
  city = "San Francisco, CA", 
  coordinates = { lat: 37.7749, lon: -122.4194 },
  weatherData = null 
}) {
  const windSpeed = weatherData?.wind || 10;
  const windDirection = weatherData?.windDirection || 45;
  const humidity = weatherData?.humidity || 60;
  const pressure = weatherData?.pressure || 1013;

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Local Precipitation</h3>
        <button
          type="button"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Full screen map"
          title="Full screen map"
        >
          <span aria-hidden>⛶</span>
        </button>
      </div>
      
      {/* Map container */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl overflow-hidden">
        {/* Mock map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-green-400/10 to-yellow-400/10">
          {/* Mock roads */}
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white/20"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20"></div>
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white/20"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-white/20"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white/20"></div>
          
          {/* Mock water body */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-blue-500/20"></div>
          
          {/* Location pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-white text-xs">📍</span>
            </div>
          </div>
          
          {/* Weather overlay */}
          <div className="absolute top-4 right-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-3">
            <div className="text-white text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌬️</span>
                <span>{windSpeed} {weatherData?.unit === "F" ? "mph" : "m/s"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">☁️</span>
                <span>{humidity}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interactive elements overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-center backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-3">
            <div className="text-white text-sm">
              <div className="font-medium">{city}</div>
              <div className="text-white/60 text-xs">
                {coordinates.lat.toFixed(2)}°, {coordinates.lon.toFixed(2)}°
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <span className="text-white text-sm">+</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <span className="text-white text-sm">−</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Precipitation indicator */}
        <div className="absolute top-4 left-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-2">
          <div className="text-white text-xs">
            <div className="flex items-center gap-1">
              <span>🌧️</span>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map controls */}
      <div className="flex justify-between items-center mt-4 text-white/60 text-sm">
        <div className="flex items-center gap-4">
          <span>Satellite</span>
          <span>•</span>
          <span>Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-xs"
          >
            Layers
          </button>
        </div>
      </div>
    </div>
  );
}
