import { useState, useEffect } from "react";
import FavoriteButton from "./FavoriteButton";

function WeatherIcon({ id, description }) {
  const iconMap = {
    200: "⛈️", 201: "⛈️", 202: "⛈️", 210: "⛈️", 211: "⛈️", 212: "⛈️", 221: "⛈️", 230: "⛈️", 231: "⛈️", 232: "⛈️",
    300: "🌦️", 301: "🌦️", 302: "🌦️", 310: "🌦️", 311: "🌦️", 312: "🌦️", 313: "🌦️", 314: "🌦️", 321: "🌦️",
    500: "🌧️", 501: "🌧️", 502: "🌧️", 503: "🌧️", 504: "🌧️", 511: "🌨️", 520: "🌧️", 521: "🌧️", 522: "🌧️", 531: "🌧️",
    600: "❄️", 601: "❄️", 602: "❄️", 611: "🌨️", 612: "🌨️", 613: "🌨️", 615: "🌨️", 616: "🌨️", 620: "🌨️", 621: "🌨️", 622: "🌨️",
    701: "🌫️", 711: "🌫️", 721: "🌫️", 731: "🌫️", 741: "🌫️", 751: "🌫️", 761: "🌫️", 762: "🌫️", 771: "🌫️", 781: "🌪️",
    800: "☀️",
    801: "🌤️", 802: "⛅", 803: "☁️", 804: "☁️"
  };
  
  const icon = iconMap[id] || "⛅";
  return (
    <div className="text-8xl transition-transform duration-300 hover:scale-110" aria-hidden>
      {icon} <span className="sr-only">{description}</span>
    </div>
  );
}

export default function CityHeader({ 
  data, 
  isFavorite, 
  onToggleFavorite, 
  unit = "C", 
  onToggleUnit, 
  onShare, 
  servedFromCache 
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce">🌤️</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Weather Pro</h2>
        <p className="text-white/60">Search for a city to see detailed weather information</p>
      </div>
    );
  }

  const cityName = data.city || data.name || "";
  const country = data.country || data.sys?.country || "";
  const weather = data.weather?.[0] || (data.condition ? { id: data.iconId, description: data.condition } : undefined);
  
  const rawTemp = typeof data.temperature === "number" ? data.temperature : data.main?.temp ?? 0;
  const temp = Math.round(rawTemp);
  const rawFeels = typeof data.feels_like === "number" ? data.feels_like : data.main?.feels_like ?? rawTemp;
  const feels = Math.round(rawFeels);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with city and actions */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-300">
            {cityName}{country ? `, ${country}` : ""}
          </h2>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>Last updated {new Date(data.timestamp || Date.now()).toLocaleString()}</span>
            {servedFromCache && (
              <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs animate-pulse">
                cached
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 hover:scale-105"
            aria-label="Share"
            title="Share"
          >
            <span aria-hidden>🔗</span>
          </button>
          <button
            type="button"
            onClick={onToggleUnit}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 hover:scale-105"
            aria-label="Toggle units"
            title="Toggle units"
          >
            <span aria-hidden className="text-white font-medium">{unit === "F" ? "°F" : "°C"}</span>
          </button>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center gap-8">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <WeatherIcon id={weather?.id} description={weather?.description} />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-7xl md:text-8xl font-extrabold text-white mb-2 transition-all duration-300">
            {temp}°{unit}
          </div>
          <p className="text-xl text-white/80 capitalize transition-all duration-300">
            {weather?.description}
          </p>
          <p className="text-white/60 mt-1 transition-all duration-300">
            Feels like {feels}°{unit}
          </p>
        </div>
      </div>
    </div>
  );
}
