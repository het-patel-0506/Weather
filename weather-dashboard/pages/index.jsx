import { useEffect, useRef } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatusRow from "../components/StatusRow";
import WeatherArea from "../components/WeatherArea";
import Footer from "../components/Footer";
import { useWeather } from "../hooks/useWeather";

export default function HomePage() {
  const {
    theme,
    toggleTheme,
    unit,
    toggleUnit,
    data,
    loading,
    error,
    search,
    lastQuery,
    favorites,
    isFavorite,
    toggleFavorite,
    share,
  } = useWeather();

  const resultRef = useRef(null);
  useEffect(() => {
    if (data && !loading && !error) {
      resultRef.current?.focus?.();
    }
  }, [data, loading, error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Header theme={theme} onToggleTheme={toggleTheme} onHelp={() => alert("Enter a city name and press Search. Toggle theme with the moon/sun.")} />
        <SearchBar
          onSearch={(city) => search(city)}
          loading={loading}
        />
        <StatusRow
          lastSearched={lastQuery}
          favorites={favorites}
          onChipClick={(city) => {
            search(city);
          }}
        />
        <main>
          <WeatherArea
            loading={loading}
            error={error}
            data={data}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            unit={unit}
            onToggleUnit={toggleUnit}
            onShare={share}
            forecastDays={data ? [
              { label: "Today", min: "-", max: "-", icon: "⛅" },
              { label: "Tomorrow", min: "-", max: "-", icon: "⛅" },
              { label: "+2d", min: "-", max: "-", icon: "⛅" },
            ] : []}
          />
          <div ref={resultRef} tabIndex={-1} aria-hidden className="sr-only">results-focus-sentinel</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

