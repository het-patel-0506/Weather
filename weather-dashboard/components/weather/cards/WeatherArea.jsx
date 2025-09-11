import EmptyState from "../../common/feedback/EmptyState";
import Spinner from "../../common/loading/Spinner";
import ErrorBanner from "../../common/feedback/ErrorBanner";
import WeatherCard from "./WeatherCard";
import ForecastStrip from "../forecast/ForecastStrip";
import { CardSkeleton, ForecastSkeleton } from "../../common/loading/Skeletons";

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
  statusMessage,
  servedFromCache,
}) {
  const isBusy = !!loading;
  return (
    <section role="region" aria-live="polite" aria-busy={isBusy ? "true" : "false"} className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Weather results">
      <div className="lg:col-span-8 relative">
        {!data && !loading && !error ? <EmptyState /> : null}
        {!data && loading ? <CardSkeleton /> : null}
        {data ? (
          <WeatherCard
            data={data}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            unit={unit}
            onToggleUnit={onToggleUnit}
            onShare={onShare}
            servedFromCache={servedFromCache}
          />
        ) : null}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70" aria-hidden={false}>
            <Spinner label={statusMessage || "Fetching latest weather…"} />
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
        {loading && !forecastDays?.length ? <ForecastSkeleton /> : <ForecastStrip days={forecastDays} />}
        {data && !forecastDays?.length && !loading ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-3 text-sm">
            Forecast data is unavailable. Showing current conditions only.
          </div>
        ) : null}
      </aside>
    </section>
  );
}

