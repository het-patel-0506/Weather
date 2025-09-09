import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { fetchWeather } from "../lib/api";

export function useWeather() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [lastQuery, setLastQuery] = useLocalStorage("lastSearched", "");
  const [unit, setUnit] = useLocalStorage("unit", "C");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

  const search = useCallback(
    async (city) => {
      if (!city) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetchWeather(city, apiKey);
        setData(res);
        setLastQuery(city);
      } catch (err) {
        setData(null);
        setError(err?.message || "Failed to fetch weather.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, setLastQuery]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const isFavorite = data?.name ? favoriteSet.has(data.name) : false;

  const toggleFavorite = useCallback(() => {
    if (!data?.name) return;
    const name = data.name;
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return Array.from(set);
    });
  }, [data, setFavorites]);

  const toggleUnit = useCallback(() => {
    setUnit((u) => (u === "C" ? "F" : "C"));
  }, [setUnit]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const share = useCallback(() => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      navigator.clipboard?.writeText(url);
    } catch {}
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
    lastQuery,
    favorites,
    isFavorite,
    toggleFavorite,
    share,
  };
}

