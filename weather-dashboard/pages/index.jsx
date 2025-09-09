import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import DarkHeader from "../components/DarkHeader";
import LeftNav from "../components/LeftNav";
import MainWeatherPro from "../components/MainWeatherPro";
import HourlyStrip from "../components/HourlyStrip";
import ForecastPanel from "../components/ForecastPanel";
import MapPreview from "../components/MapPreview";
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="min-h-[80vh] rounded-[24px] bg-[#0b1220] text-slate-200 shadow-xl border border-white/10 p-4 md:p-6 backdrop-blur relative">
          <DarkHeader />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-4">
              <LeftNav
                cities={["New York City", "London", "Tokyo", "Toxyor", "San Francisco, CA"]}
                activeCity={lastQuery || (data?.city || data?.name) || ""}
                onSelect={(city) => search(city)}
                onAdd={() => alert("Add city")}
              />
            </aside>
            <main className="lg:col-span-6">
              <MainWeatherPro
                temp={data ? Math.round((data.main?.temp ?? data.temperature ?? 0)) : (unit === "F" ? 72 : 22)}
                unit={unit}
                condition={data?.weather?.[0]?.description || "Partly Cloudy"}
                high={unit === "F" ? 78 : 26}
                low={unit === "F" ? 65 : 18}
              />
              <HourlyStrip hours={[{ time: "5 PM", temp: unit === "F" ? "50°F" : "10°C" }, { time: "8 PM", temp: unit === "F" ? "45°F" : "7°C" }, { time: "11 PM", temp: unit === "F" ? "40°F" : "4°C" }, { time: "2 AM", temp: unit === "F" ? "38°F" : "3°C" }]} />
            </main>
            <aside className="lg:col-span-3 flex flex-col gap-4">
              <ForecastPanel days={[
                { label: "Mon", min: unit === "F" ? "50°F" : "10°C", max: unit === "F" ? "76°F" : "24°C", icon: "🌤️" },
                { label: "Tue", min: unit === "F" ? "48°F" : "9°C", max: unit === "F" ? "72°F" : "22°C", icon: "🌦️" },
                { label: "Wed", min: unit === "F" ? "52°F" : "11°C", max: unit === "F" ? "74°F" : "23°C", icon: "⛅" },
                { label: "Thu", min: unit === "F" ? "55°F" : "13°C", max: unit === "F" ? "75°F" : "24°C", icon: "🌧️" },
                { label: "Fri", min: unit === "F" ? "54°F" : "12°C", max: unit === "F" ? "73°F" : "23°C", icon: "⛅" },
              ]} />
              <MapPreview />
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

