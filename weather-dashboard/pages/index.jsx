import { useCallback, useMemo, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatusRow from "../components/StatusRow";
import WeatherArea from "../components/WeatherArea";
import Footer from "../components/Footer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchWeather } from "../lib/api";

export default function HomePage() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSearched, setLastSearched] = useLocalStorage("lastSearched", "");
  const [unit, setUnit] = useLocalStorage("unit", "C");

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

  const onToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const onSearch = useCallback(
    async (city) => {
      const target = city || query;
      if (!target) return;
      setLoading(true);
      setError("");
      try {
        const data = await fetchWeather(target, apiKey);
        setWeather(data);
        setLastSearched(target);
      } catch (err) {
        setWeather(null);
        setError(err?.message || "Failed to fetch weather.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, query, setLastSearched]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const isFavorite = weather?.name ? favoriteSet.has(weather.name) : false;

  const onFavoriteToggle = useCallback(() => {
    if (!weather?.name) return;
    const name = weather.name;
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return Array.from(set);
    });
  }, [setFavorites, weather]);

  const onToggleUnit = useCallback(() => {
    setUnit((u) => (u === "C" ? "F" : "C"));
  }, [setUnit]);

  const onShare = useCallback(() => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      navigator.clipboard?.writeText(url);
    } catch {
      // noop
    }
  }, []);

  const forecastDays = useMemo(() => {
    // Placeholder strip to satisfy Phase 1 layout.
    return weather
      ? [
          { label: "Today", min: "-", max: "-", icon: "⛅" },
          { label: "Tomorrow", min: "-", max: "-", icon: "⛅" },
          { label: "+2d", min: "-", max: "-", icon: "⛅" },
        ]
      : [];
  }, [weather]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Header theme={theme} onToggleTheme={onToggleTheme} onHelp={() => alert("Enter a city name and press Search. Toggle theme with the moon/sun.")} />
        <SearchBar
          onSearch={(city) => {
            setQuery(city);
            onSearch(city);
          }}
          loading={loading}
        />
        <StatusRow
          lastSearched={lastSearched}
          favorites={favorites}
          onChipClick={(city) => {
            setQuery(city);
            onSearch(city);
          }}
        />
        <main>
          <WeatherArea
            loading={loading}
            error={error}
            data={weather}
            isFavorite={isFavorite}
            onToggleFavorite={onFavoriteToggle}
            unit={unit}
            onToggleUnit={onToggleUnit}
            onShare={onShare}
            forecastDays={forecastDays}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

