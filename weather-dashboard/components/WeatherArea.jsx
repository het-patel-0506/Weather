import EmptyState from "./EmptyState";
import Spinner from "./Spinner";
import ErrorBanner from "./ErrorBanner";
import WeatherCard from "./WeatherCard";
import ForecastStrip from "./ForecastStrip";

export default function WeatherArea({
  loading,
  error,
  data,
  isFavorite,
  onToggleFavorite,
  unit,
  onToggleUnit,
  onShare,
  forecastDays = [],
}) {
  return (
    <section role="region" aria-live="polite" className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Weather results">
      <div className="lg:col-span-8 relative">
        {!data && !loading && !error ? <EmptyState /> : null}
        {data ? (
          <WeatherCard
            data={data}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            unit={unit}
            onToggleUnit={onToggleUnit}
            onShare={onShare}
          />
        ) : null}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70">
            <Spinner />
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-4 flex items-start gap-3" role="alert">
            <span aria-hidden>⚠️</span>
            <div className="flex-1">{error}</div>
            <button type="button" className="rounded-md bg-rose-600 text-white px-3 py-1 text-sm" onClick={() => location.reload()}>
              Retry
            </button>
          </div>
        ) : null}
      </div>
      <aside className="lg:col-span-4">
        <ForecastStrip days={forecastDays} />
      </aside>
    </section>
  );
}

