import { useCallback, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { fetchWeather as fetchWeatherProxy } from "../lib/api";

const cache = new Map(); // key: `${city}|${units}` -> mapped weather

export function useWeather() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [lastQuery, setLastQuery] = useLocalStorage("lastSearched", "");
  const [unit, setUnit] = useLocalStorage("unit", "C");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [servedFromCache, setServedFromCache] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const doFetch = useCallback(
    async (city, currentUnit) => {
      const unitsQuery = currentUnit === "F" ? "imperial" : "metric";
      const cacheKey = `${city.toLowerCase()}|${unitsQuery}`;

      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        console.info("[weather] cache hit", { city, units: unitsQuery });
        setData(cached);
        setError("");
        setLoading(false);
        setLastQuery(city);
        setServedFromCache(true);
        setStatusMessage("Served from cache");
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const attempt = async (retries = 2, delay = 300) => {
        try {
          console.time("weather_fetch");
          const result = await fetchWeatherProxy(city, unitsQuery, controller.signal);
          console.timeEnd("weather_fetch");
          cache.set(cacheKey, result);
          setData(result);
          setError("");
          setLastQuery(city);
          setServedFromCache(false);
          setStatusMessage("Loaded");
        } catch (err) {
          if (controller.signal.aborted) return; // cancelled
          const msg = err?.message || "Network error — check connection";
          const isTransient = /Network error|network/i.test(msg);
          if (retries > 0 && isTransient) {
            await new Promise((r) => setTimeout(r, delay));
            return attempt(retries - 1, delay * 2);
          }
          setData(null);
          setError(msg);
          setStatusMessage("Error");
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      setError("");
      await attempt();
    },
    [setLastQuery]
  );

  const search = useCallback(
    (city) => {
      if (!city) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void doFetch(city, unit);
      }, 300);
    },
    [doFetch, unit]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const isFavorite = data?.city ? favoriteSet.has(data.city) : false;

  const toggleFavorite = useCallback((cityName) => {
    const name = cityName || data?.city;
    if (!name) return;
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return Array.from(set);
    });
  }, [data, setFavorites]);

  const toggleUnit = useCallback(() => {
    setUnit((u) => (u === "C" ? "F" : "C"));
    const currentCity = (data && (data.city || data.name)) || lastQuery;
    if (currentCity) {
      // Refetch immediately for the displayed city using the new unit
      const nextUnit = unit === "C" ? "F" : "C";
      void doFetch(currentCity, nextUnit);
    }
  }, [data, lastQuery, unit, doFetch, setUnit]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const share = useCallback(() => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      navigator.clipboard?.writeText(url);
    } catch {}
  }, []);

  const retry = useCallback(() => {
    if (lastQuery) search(lastQuery);
  }, [lastQuery, search]);

  const clear = useCallback(() => {
    setData(null);
    setError("");
    setStatusMessage("");
  }, []);

  return {
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
    retry,
    clear,
    lastQuery,
    favorites,
    isFavorite,
    toggleFavorite,
    share,
  };
}

