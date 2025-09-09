const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(city, apiKey) {
  if (!city || typeof city !== "string") {
    throw new Error("Please enter a valid city name.");
  }
  if (!apiKey) {
    throw new Error("Missing OpenWeatherMap API key.");
  }
  const url = new URL(BASE_URL);
  url.searchParams.set("q", city.trim());
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `Request failed (${res.status})`;
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
    } catch {
      // ignore parse error, use status text
      if (res.statusText) message = res.statusText;
    }
    throw new Error(message || "Failed to fetch weather.");
  }

  const data = await res.json();
  return data;
}

