import FavoriteButton from "./FavoriteButton";
import MetricTile from "./MetricTile";

function WeatherIcon({ id, description }) {
  // Simple mapping for demo; could be expanded
  const icon = id >= 200 && id < 600 ? "🌧️" : id >= 600 && id < 700 ? "❄️" : id === 800 ? "☀️" : "⛅";
  return (
    <div className="text-4xl" aria-hidden>
      {icon} <span className="sr-only">{description}</span>
    </div>
  );
}

export default function WeatherCard({ data, isFavorite, onToggleFavorite, unit = "C", onToggleUnit, onShare, servedFromCache }) {
  // Support both mapped internal shape and raw OpenWeather shape
  const cityName = data.city || data.name || "";
  const country = data.country || data.sys?.country || "";
  const weather = data.weather?.[0] || (data.condition ? { id: data.iconId, description: data.condition } : undefined);
  // Values coming from API are already in the requested units (metric/imperial),
  // so don't reconvert here; just round for display.
  const rawTemp =
    typeof data.temperature === "number"
      ? data.temperature
      : data.main?.temp ?? 0;
  const temp = Math.round(rawTemp);
  const humidity =
    typeof data.humidity === "number" ? data.humidity : data.main?.humidity;
  const windMs = typeof data.wind === "number" ? data.wind : data.wind?.speed;
  const wind = Math.round((windMs ?? 0) * 10) / 10;
  const tsMs = data.timestamp || ((data.dt ?? Date.now()) * 1000);
  const updated = new Date(tsMs);
  const rawFeels =
    typeof data.feels_like === "number"
      ? data.feels_like
      : data.main?.feels_like ?? rawTemp;
  const feels = Math.round(rawFeels);
  const pressure = typeof data.pressure === "number" ? data.pressure : data.main?.pressure;

  return (
    <article className="relative rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 lg:p-8 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{cityName}{country ? `, ${country}` : ""}</h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Last updated {updated.toLocaleString()}</span>
            {servedFromCache ? (
              <span className="inline-flex items-center rounded-full bg-slate-700/40 text-slate-200 px-2 py-0.5 text-[11px]" title="Served from cache">cached</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all focus:outline-none focus-visible:ring"
            aria-label="Share"
            title="Share"
          >
            <span aria-hidden>🔗</span>
          </button>
          <button
            type="button"
            onClick={onToggleUnit}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all focus:outline-none focus-visible:ring"
            aria-label="Toggle units"
            title="Toggle units"
          >
            <span aria-hidden>{unit === "F" ? "°F" : "°C"}</span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="w-28 h-28 rounded-full bg-sky-100 dark:bg-slate-700 flex items-center justify-center">
          <WeatherIcon id={weather?.id} description={weather?.description} />
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-extrabold">{temp}°{unit}</div>
          <p className="mt-1 capitalize text-slate-600 dark:text-slate-300 text-lg md:text-xl">
            {weather?.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile label="Humidity" value={humidity} unit="%" icon="💧" />
        <MetricTile label="Wind" value={wind} unit={unit === "F" ? "mph" : "m/s"} icon="🌬️" />
        <MetricTile label="Feels like" value={feels} unit={`°${unit}`} icon="🌡️" />
        <MetricTile label="Pressure" value={pressure} unit="hPa" icon="📈" />
      </div>
    </article>
  );
}

