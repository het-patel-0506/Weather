import { useEffect, useRef, useState } from "react";
import DarkHeader from "../components/DarkHeader";
import SearchBar from "../components/SearchBar";
import StatusRow from "../components/StatusRow";
import WeatherArea from "../components/WeatherArea";
import Footer from "../components/Footer";
import LeftNav from "../components/LeftNav";
import MainWeatherPro from "../components/MainWeatherPro";
import HourlyForecast from "../components/HourlyForecast";
import ForecastPanel from "../components/ForecastPanel";
import InteractiveMap from "../components/InteractiveMap";
import { WeatherCardSkeleton, ChartSkeleton, ForecastSkeleton, HourlySkeleton, MapSkeleton } from "../components/LoadingSkeletons";
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
    statusMessage,
    servedFromCache,
    lastQuery,
    favorites,
    isFavorite,
    toggleFavorite,
    share,
    clear,
  } = useWeather();

  const resultRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (data && !loading && !error) {
      resultRef.current?.focus?.();
    }
  }, [data, loading, error]);

  const activeCity = (data && (data.city || data.name)) || lastQuery || "";
  const defaultCities = ["New York City", "London", "Tokyo", "San Francisco, CA"];
  const cities = Array.from(
    new Set([...(favorites || []), ...(activeCity ? [activeCity] : []), ...defaultCities])
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" 
        : "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900"
    }`}>
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-40" style={{
        backgroundImage: theme === "dark" 
          ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <DarkHeader 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          onHelp={() => alert("Enter a city name and press Search. Toggle theme with the moon/sun.")}
          onSettings={() => alert("Settings panel coming soon")}
          onLocation={() => alert("Location services coming soon")}
          onMenu={() => alert("Menu panel coming soon")}
        />
        {mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Cities Sidebar */}
            <aside className="lg:col-span-2">
              <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-6 transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-white/5 border border-white/10" 
                  : "bg-white/80 border border-slate-200/50"
              }`}>
                <LeftNav
                  cities={cities}
                  activeCity={activeCity}
                  onSelect={(city) => search(city)}
                  onAdd={(city) => search(city)}
                  favorites={favorites}
                  theme={theme}
                  onToggleFavorite={(city) => {
                    const newFavorites = favorites.includes(city)
                      ? favorites.filter(f => f !== city)
                      : [...favorites, city];
                    // Update favorites in localStorage
                    localStorage.setItem('favorites', JSON.stringify(newFavorites));
                    // Trigger a re-render by updating the hook
                    window.location.reload();
                  }}
                />
              </div>
            </aside>
            
            {/* Center Column - Main Weather */}
            <div className="lg:col-span-6">
              <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-white/5 border border-white/10" 
                  : "bg-white/80 border border-slate-200/50"
              }`}>
                <StatusRow
                  lastSearched={lastQuery}
                  favorites={favorites}
                  onChipClick={(city) => {
                    search(city);
                  }}
                />
                <main suppressHydrationWarning>
                  {loading && !data ? (
                    <WeatherCardSkeleton />
                  ) : (
                    <MainWeatherPro
                      loading={loading}
                      error={error}
                      data={data}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                      unit={unit}
                      onToggleUnit={toggleUnit}
                      onShare={share}
                      statusMessage={statusMessage}
                      servedFromCache={servedFromCache}
                      theme={theme}
                    />
                  )}
                  <div className="mt-6">
                    {loading ? <HourlySkeleton /> : <HourlyForecast unit={unit} />}
                  </div>
                  <div ref={resultRef} tabIndex={-1} aria-hidden className="sr-only">results-focus-sentinel</div>
                </main>
              </div>
            </div>
            
            {/* Right Column - Forecast & Map */}
            <aside className="lg:col-span-4">
              <div className="space-y-6">
                {loading ? <ForecastSkeleton /> : <ForecastPanel unit={unit} />}
                {loading ? <MapSkeleton /> : (
                  <InteractiveMap 
                    city={data?.city || data?.name || "San Francisco, CA"}
                    coordinates={data?.coord || { lat: 37.7749, lon: -122.4194 }}
                    weatherData={data}
                    apiKey={process.env.NEXT_PUBLIC_WEATHER_API_KEY}
                  />
                )}
              </div>
            </aside>
          </div>
        ) : null}
        <Footer />
      </div>
    </div>
  );
}

