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

export default function WeatherCard({ data, isFavorite, onToggleFavorite, unit = "C", onToggleUnit, onShare }) {
  const city = `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;
  const weather = data.weather?.[0];
  const cTemp = Math.round(data.main?.temp ?? 0);
  const temp = unit === "F" ? Math.round((cTemp * 9) / 5 + 32) : cTemp;
  const humidity = data.main?.humidity;
  const wind = Math.round((data.wind?.speed ?? 0) * 10) / 10;
  const updated = new Date((data.dt ?? Date.now()) * 1000);
  const feelsC = Math.round(data.main?.feels_like ?? cTemp);
  const feels = unit === "F" ? Math.round((feelsC * 9) / 5 + 32) : feelsC;
  const pressure = data.main?.pressure;

  return (
    <article className="relative rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 lg:p-8 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{city}</h2>
          <div className="text-xs text-slate-500 dark:text-slate-400">{updated.toLocaleString()}</div>
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
        <MetricTile label="Wind" value={wind} unit="m/s" icon="🌬️" />
        <MetricTile label="Feels like" value={feels} unit={`°${unit}`} icon="🌡️" />
        <MetricTile label="Pressure" value={pressure} unit="hPa" icon="📈" />
      </div>
    </article>
  );
}

