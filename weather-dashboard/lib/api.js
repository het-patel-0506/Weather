const PROXY_URL = "/api/weather";

export function mapWeatherResponse(raw) {
  if (!raw) return null;
  return {
    city: raw.name,
    country: raw.sys?.country || "",
    timestamp: (raw.dt || 0) * 1000,
    temperature: raw.main?.temp ?? null,
    feels_like: raw.main?.feels_like ?? null,
    condition: raw.weather?.[0]?.description ?? "",
    iconId: raw.weather?.[0]?.id ?? null,
    humidity: raw.main?.humidity ?? null,
    wind: raw.wind?.speed ?? null,
    pressure: raw.main?.pressure ?? null,
    coord: raw.coord || null,
    forecast: [],
  };
}

export async function fetchWeather(city, units = "metric", signal) {
  if (!city || typeof city !== "string") throw new Error("Please enter a valid city name.");

  const url = new URL(PROXY_URL, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  url.searchParams.set("city", city.trim());
  url.searchParams.set("units", units);
  try {
    const forceMock =
      (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mock") === "1") ||
      process.env.NEXT_PUBLIC_FORCE_MOCK === "1";
    if (forceMock) url.searchParams.set("mock", "1");
  } catch {}

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    const message = data?.message || res.statusText || "Failed to fetch weather";
    throw new Error(message || mapStatusToMessage(status));
  }
  const json = await res.json();
  return mapWeatherResponse(json);
}

export function mapStatusToMessage(status) {
  if (status === 401) return "API key invalid";
  if (status === 404) return "City not found — check spelling";
  if (status === 429) return "Rate limit reached — try again later";
  return "Failed to fetch weather";
}

