import { useEffect, useRef, useState } from "react";
import DarkHeader from "../components/common/layout/DarkHeader";
import SearchBar from "../components/search/SearchBar";
import StatusRow from "../components/common/feedback/StatusRow";
import WeatherArea from "../components/weather/cards/WeatherArea";
import Footer from "../components/common/layout/Footer";
import LeftNav from "../components/search/navigation/LeftNav";
import MainWeatherPro from "../components/weather/cards/MainWeatherPro";
import HourlyForecast from "../components/weather/forecast/HourlyForecast";
import ForecastPanel from "../components/weather/forecast/ForecastPanel";
import InteractiveMap from "../components/map/InteractiveMap";
import { WeatherCardSkeleton, ChartSkeleton, ForecastSkeleton, HourlySkeleton, MapSkeleton } from "../components/common/loading/LoadingSkeletons";
import FloatingError from "../components/common/feedback/FloatingError";
import SettingsPanel from "../components/settings/SettingsPanel";
import LocationFallbackModal from "../components/location/LocationFallbackModal";
import LocationServices from "../components/location/LocationServices";
import RecentLocations from "../components/location/RecentLocations";
import { useWeather } from "../hooks/useWeather";
import { useLocation } from "../hooks/useLocation";

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

  const {
    currentLocation,
    isUsingDeviceLocation,
    locationPermission,
    isGeolocating,
    locationError,
    recentLocations,
    favoriteLocations,
    autoDetectEnabled,
    geofencingEnabled,
    getCurrentLocation,
    addToRecentLocations,
    toggleFavoriteLocation,
    removeRecentLocation,
    reorderRecentLocations,
    clearLocationData,
    getWeatherForCoordinates,
    setAutoDetectEnabled,
    setGeofencingEnabled,
    setIsUsingDeviceLocation,
    setLocationError
  } = useLocation();

  const resultRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationFallbackOpen, setIsLocationFallbackOpen] = useState(false);
  const [mapLayers, setMapLayers] = useState({
    rainfall: false,
    radar: false,
    temperature: false
  });
  useEffect(() => setMounted(true), []);
  
  // Load London by default if no data
  useEffect(() => {
    if (mounted && !data && !loading && !error) {
      search("London");
    }
  }, [mounted, data, loading, error, search]);
  
  useEffect(() => {
    if (data && !loading && !error) {
      resultRef.current?.focus?.();
    }
  }, [data, loading, error]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // Trigger refresh when data changes to update recent cities
  useEffect(() => {
    if (data) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, [data]);

  // Listen for settings panel events
  useEffect(() => {
    const handleUnitChange = (event) => {
      const { unit: newUnit } = event.detail;
      if (newUnit !== unit) {
        toggleUnit();
      }
    };

    const handleThemeChange = (event) => {
      const { theme: newTheme } = event.detail;
      if (newTheme !== theme) {
        toggleTheme();
      }
    };

    const handleWeatherRefresh = () => {
      if (data && data.city) {
        search(data.city);
      }
    };

    const handleDataCleared = () => {
      // Clear weather data in memory
      clear();
      // Clear location-related state in memory (recent/manual lists)
      try {
        clearLocationData();
      } catch {}
      // Trigger left panel to re-read from storage (now empty)
      setRefreshTrigger(prev => prev + 1);
    };

    const handleMapLayerChange = (event) => {
      const { layer, enabled } = event.detail;
      setMapLayers(prev => ({
        ...prev,
        [layer]: enabled
      }));
    };

    const handleRequestLocation = () => {
      getCurrentLocation().catch((error) => {
        setIsLocationFallbackOpen(true);
      });
    };

    const handleGeofencingAlert = (event) => {
      const alert = event.detail;
      // Show alert notification
      setErrorMessage(`Weather Alert: ${alert.message}`);
    };

    window.addEventListener('unitChange', handleUnitChange);
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('weatherRefresh', handleWeatherRefresh);
    window.addEventListener('dataCleared', handleDataCleared);
    window.addEventListener('mapLayerChange', handleMapLayerChange);
    window.addEventListener('requestLocation', handleRequestLocation);
    window.addEventListener('geofencingAlert', handleGeofencingAlert);

    return () => {
      window.removeEventListener('unitChange', handleUnitChange);
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('weatherRefresh', handleWeatherRefresh);
      window.removeEventListener('dataCleared', handleDataCleared);
      window.removeEventListener('mapLayerChange', handleMapLayerChange);
      window.removeEventListener('requestLocation', handleRequestLocation);
      window.removeEventListener('geofencingAlert', handleGeofencingAlert);
    };
  }, [unit, theme, data, toggleUnit, toggleTheme, search, clear]);

  // Location handlers
  const handleUseLocation = async () => {
    try {
      const location = await getCurrentLocation();
      // Search for weather at the current location
      if (location) {
        // For now, we'll use a generic city name - in a real app, you'd reverse geocode
        const cityName = `Current Location (${location.lat.toFixed(2)}, ${location.lon.toFixed(2)})`;
        search(cityName);
        addToRecentLocations(location, cityName);
      }
    } catch (error) {
      setIsLocationFallbackOpen(true);
    }
  };

  const handleLocationSelect = (location) => {
    if (location.name) {
      search(location.name);
    } else {
      // Handle coordinates
      const cityName = `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`;
      search(cityName);
    }
  };

  const handleMapLocationSelect = async (coordinates) => {
    try {
      const cityName = `${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}`;
      search(cityName);
      addToRecentLocations(coordinates, cityName);
    } catch (error) {
      console.error('Error handling map location:', error);
    }
  };

  const activeCity = (data && (data.city || data.name)) || lastQuery || "";
  const defaultCities = ["New York City", "London", "Paris", "Ahmedabad"];
  const cities = Array.from(
    new Set([...(favorites || []), ...(activeCity ? [activeCity] : []), ...defaultCities])
  );

  return (
    <>
      {/* Ensure dark theme is applied immediately on page load */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.setProperty('--bg-primary', 'rgb(15, 23, 42)');
                document.documentElement.style.setProperty('--bg-secondary', 'rgb(30, 41, 59)');
                document.documentElement.style.setProperty('--text-primary', 'rgb(255, 255, 255)');
                document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
              }
            })();
          `,
        }}
      />
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
                  onSearch={search}
                  onHelp={() => {
                    // Use a custom toast event consumed by DarkHeader/FloatingError,
                    // keeping UI consistent and non-blocking
                    window.dispatchEvent(new CustomEvent('appToast', {
                      detail: { message: 'Enter a city name and press Search. Toggle theme with the moon/sun.', type: 'info' }
                    }));
                  }}
                  onSettings={() => setIsSettingsOpen(true)}
                  onLocation={handleUseLocation}
                  onMenu={() => {
                    // Toast handled inside DarkHeader; no blocking alert
                    window.dispatchEvent(new CustomEvent('appToast', {
                      detail: { message: 'Menu panel coming soon', type: 'info' }
                    }));
                  }}
                />
        {mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Cities Sidebar */}
            <aside className="lg:col-span-2">
                      <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-6 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-white/10 border border-white/20"
                          : "bg-white/95 border border-slate-200/70"
                      }`}>
                <LeftNav
                  cities={cities}
                  activeCity={activeCity}
                  onSelect={(city) => search(city)}
                  onAdd={(city) => search(city)}
                  favorites={favorites}
                  theme={theme}
                  onToggleFavorite={(city) => toggleFavorite(city)}
                  refreshTrigger={refreshTrigger}
                />
                
                {/* Location Services */}
                <div className="mt-6">
                  <LocationServices
                    onUseLocation={handleUseLocation}
                    isGeolocating={isGeolocating}
                    isUsingDeviceLocation={isUsingDeviceLocation}
                    theme={theme}
                  />
                </div>
                
                {/* Recent Locations */}
                <div className="mt-6">
                  <RecentLocations
                    recentLocations={recentLocations}
                    favoriteLocations={favoriteLocations}
                    onLocationSelect={handleLocationSelect}
                    onToggleFavorite={toggleFavoriteLocation}
                    onRemoveLocation={removeRecentLocation}
                    onReorderLocations={reorderRecentLocations}
                    theme={theme}
                  />
                </div>
              </div>
            </aside>
            
            {/* Center Column - Main Weather */}
            <div className="lg:col-span-6">
                      <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-white/10 border border-white/20"
                          : "bg-white/95 border border-slate-200/70"
                      }`}>
                <StatusRow
                  lastSearched={lastQuery}
                  favorites={favorites}
                  onChipClick={(city) => {
                    search(city);
                  }}
                  theme={theme}
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
                      onToggleFavorite={() => toggleFavorite()}
                      unit={unit}
                      onToggleUnit={toggleUnit}
                      onShare={share}
                      statusMessage={statusMessage}
                      servedFromCache={servedFromCache}
                      theme={theme}
                    />
                  )}
                  <div className="mt-6">
                    {loading ? <HourlySkeleton /> : <HourlyForecast unit={unit} theme={theme} hasData={!!data} weatherData={data} />}
                  </div>
                  <div ref={resultRef} tabIndex={-1} aria-hidden className="sr-only">results-focus-sentinel</div>
                </main>
              </div>
            </div>
            
            {/* Right Column - Forecast & Map */}
            <aside className="lg:col-span-4">
              <div className="space-y-6">
                        {loading ? <ForecastSkeleton /> : <ForecastPanel unit={unit} theme={theme} weatherData={data} />}
                {loading ? <MapSkeleton /> : (
                  <InteractiveMap 
                    city={data?.city || data?.name || "San Francisco, CA"}
                    coordinates={data?.coord || { lat: 37.7749, lon: -122.4194 }}
                    weatherData={data}
                    theme={theme}
                    apiKey={process.env.NEXT_PUBLIC_WEATHER_API_KEY}
                    mapLayers={mapLayers}
                    onLocationSelect={handleMapLocationSelect}
                    key={`${data?.coord?.lat}-${data?.coord?.lon}-${data?.city}`}
                  />
                )}
              </div>
            </aside>
          </div>
        ) : null}
        <Footer />
      </div>
      
      {/* Floating Error Message */}
      <FloatingError 
        message={errorMessage} 
        onClose={() => setErrorMessage("")} 
        theme={theme} 
      />
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
      />
      
      {/* Location Fallback Modal */}
      <LocationFallbackModal
        isOpen={isLocationFallbackOpen}
        onClose={() => setIsLocationFallbackOpen(false)}
        onSearch={search}
        error={locationError}
        theme={theme}
      />
    </div>
    </>
  );
}

