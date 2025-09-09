import CityHeader from "./CityHeader";
import TempChart from "./TempChart";

function MetricCard({ label, value, unit, icon, trend, theme = "dark" }) {
  return (
    <div className={`backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
      theme === "dark" 
        ? "bg-white/5 border border-white/10" 
        : "bg-white/60 border border-slate-200/50"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm transition-colors ${
          theme === "dark" ? "text-white/70" : "text-slate-600"
        }`}>{label}</span>
        <span className="text-2xl" aria-hidden>{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold transition-colors ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>{value}</span>
        <span className={`text-sm transition-colors ${
          theme === "dark" ? "text-white/60" : "text-slate-500"
        }`}>{unit}</span>
        {trend && (
          <span className={`text-xs ml-2 transition-colors ${
            theme === "dark" ? "text-white/50" : "text-slate-400"
          }`}>
            {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"}
          </span>
        )}
      </div>
    </div>
  );
}


export default function MainWeatherPro({ 
  data, 
  isFavorite, 
  onToggleFavorite, 
  unit = "C", 
  onToggleUnit, 
  onShare, 
  servedFromCache,
  theme = "dark"
}) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌤️</div>
        <h2 className={`text-2xl font-semibold mb-2 transition-colors ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>Welcome to Weather Pro</h2>
        <p className={`transition-colors ${
          theme === "dark" ? "text-white/60" : "text-slate-600"
        }`}>Search for a city to see detailed weather information</p>
      </div>
    );
  }

  const humidity = typeof data.humidity === "number" ? data.humidity : data.main?.humidity;
  const windMs = typeof data.wind === "number" ? data.wind : data.wind?.speed;
  const wind = Math.round((windMs ?? 0) * 10) / 10;
  const pressure = typeof data.pressure === "number" ? data.pressure : data.main?.pressure;
  const visibility = data.visibility ? Math.round(data.visibility / 1000) : null;

  return (
    <div className="space-y-6">
      <CityHeader
        data={data}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        unit={unit}
        onToggleUnit={onToggleUnit}
        onShare={onShare}
        servedFromCache={servedFromCache}
        theme={theme}
      />

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Humidity" 
          value={humidity} 
          unit="%" 
          icon="💧" 
          trend={humidity > 70 ? 1 : humidity < 30 ? -1 : 0}
          theme={theme}
        />
        <MetricCard 
          label="Wind Speed" 
          value={wind} 
          unit={unit === "F" ? "mph" : "m/s"} 
          icon="🌬️"
          theme={theme}
        />
        <MetricCard 
          label="Pressure" 
          value={pressure} 
          unit="hPa" 
          icon="📈"
          theme={theme}
        />
        <MetricCard 
          label="Visibility" 
          value={visibility || "Clear"} 
          unit={visibility ? "km" : ""} 
          icon="👁️"
          theme={theme}
        />
      </div>

      {/* Interactive temperature chart */}
      <TempChart unit={unit} theme={theme} />
    </div>
  );
}
