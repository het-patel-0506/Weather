export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { city, units = "metric", mock } = req.query;
  // Resolve API key from env. In development, allow ?key= for quick local testing (never use in production).
  let apiKey =
    process.env.OPENWEATHER_API_KEY ||
    process.env.WEATHER_API_KEY ||
    process.env.NEXT_PUBLIC_WEATHER_API_KEY ||
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ||
    "";

  // Normalize the API key to avoid common issues introduced by env configuration
  if (apiKey) {
    // Trim whitespace/newlines and remove surrounding quotes if present
    apiKey = apiKey.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
  }

  // Minimal diagnostics (length only) to validate configuration without leaking secrets
  console.log("OWM key length:", apiKey ? apiKey.length : 0);

  if (!apiKey && process.env.NODE_ENV !== "production" && typeof req.query.key === "string") {
    apiKey = req.query.key; // Dev-only convenience
  }
  if (!apiKey) {
    return res.status(500).json({ message: "API key not configured - please set your OpenWeatherMap API key" });
  }
  if (!city || typeof city !== "string") {
    return res.status(400).json({ message: "City is required" });
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", units === "imperial" ? "imperial" : "metric");

  // Avoid logging sensitive data like full keys or URLs containing keys
  console.log("Requesting weather", { city, units, keyLen: apiKey.length });

  const shouldMock =
    process.env.NODE_ENV !== "production" && (process.env.MOCK_WEATHER === "1" || mock === "1");

  const SAMPLE = {
    london: { temp: 13, feels_like: 13, temp_min: 8, temp_max: 16, humidity: 70, pressure: 1006, wind: 4.3, desc: "overcast clouds", id: 804, country: "GB", coord: { lon: -0.1276, lat: 51.5072 } },
    paris: { temp: 24, feels_like: 23, temp_min: 18, temp_max: 28, humidity: 52, pressure: 1010, wind: 2.6, desc: "few clouds", id: 801, country: "FR", coord: { lon: 2.3522, lat: 48.8566 } },
    ahmedabad: { temp: 32, feels_like: 35, temp_min: 28, temp_max: 36, humidity: 60, pressure: 1006, wind: 4.2, desc: "scattered clouds", id: 802, country: "IN", coord: { lon: 72.5714, lat: 23.0225 } },
    "san francisco": { temp: 18, feels_like: 17, temp_min: 15, temp_max: 21, humidity: 75, pressure: 1015, wind: 4.8, desc: "fog", id: 741, country: "US", coord: { lon: -122.4194, lat: 37.7749 } },
    "san francisco, ca": { temp: 18, feels_like: 17, temp_min: 15, temp_max: 21, humidity: 75, pressure: 1015, wind: 4.8, desc: "fog", id: 741, country: "US", coord: { lon: -122.4194, lat: 37.7749 } },
    tokyo: { temp: 25, feels_like: 27, temp_min: 20, temp_max: 30, humidity: 65, pressure: 1010, wind: 3.2, desc: "partly cloudy", id: 802, country: "JP", coord: { lon: 139.6917, lat: 35.6895 } },
    "new york": { temp: 22, feels_like: 24, temp_min: 18, temp_max: 26, humidity: 55, pressure: 1018, wind: 2.8, desc: "clear sky", id: 800, country: "US", coord: { lon: -74.0060, lat: 40.7128 } },
    "new york city": { temp: 22, feels_like: 24, temp_min: 18, temp_max: 26, humidity: 55, pressure: 1018, wind: 2.8, desc: "clear sky", id: 800, country: "US", coord: { lon: -74.0060, lat: 40.7128 } },
    ottawa: { temp: 19, feels_like: 18, temp_min: 15, temp_max: 23, humidity: 42, pressure: 1014, wind: 2.7, desc: "scattered clouds", id: 802, country: "CA", coord: { lon: -75.6972, lat: 45.4215 } },
  };

  const mockPayload = () => {
    const key = String(city || "").toLowerCase();
    const sample = SAMPLE[key];
    const temp = units === "imperial" ? 72 : 22;
    const speed = units === "imperial" ? 5 : 2.3;
    return sample
      ? {
          name: city,
          sys: { country: sample.country },
          dt: Math.floor(Date.now() / 1000),
          main: { 
            temp: sample.temp, // Always return in Celsius, let components convert
            feels_like: sample.feels_like, // Always return in Celsius, let components convert
            temp_min: sample.temp_min, // Always return in Celsius, let components convert
            temp_max: sample.temp_max, // Always return in Celsius, let components convert
            humidity: sample.humidity, 
            pressure: sample.pressure 
          },
          weather: [{ id: sample.id, description: sample.desc }],
          wind: { speed: units === "imperial" ? Math.round(sample.wind * 2.237 * 10)/10 : sample.wind },
          coord: sample.coord,
        }
      : {
          name: city,
          sys: { country: "XX" },
          dt: Math.floor(Date.now() / 1000),
          main: { 
            temp: 22, // Always return in Celsius
            feels_like: 23, // Always return in Celsius
            temp_min: 17, // Always return in Celsius
            temp_max: 27, // Always return in Celsius
            humidity: 55, 
            pressure: 1012 
          },
          weather: [{ id: 800, description: "clear sky" }],
          wind: { speed },
          coord: { lon: 0, lat: 0 },
        };
  };

  try {
    const start = Date.now();
    const owRes = await fetch(url.toString());
    const text = await owRes.text();
    
    console.log("OpenWeatherMap Response:", {
      status: owRes.status,
      statusText: owRes.statusText,
      responseLength: text.length,
      responsePreview: text.substring(0, 200)
    });

    // Map common errors to friendly messages
    if (!owRes.ok) {
      const status = owRes.status;
      let message = "Request failed";
      try {
        const data = JSON.parse(text);
        message = data?.message || message;
      } catch {}

      // Don't fall back to mock data - return proper error messages
      if (status === 401) {
        return res.status(401).json({ message: "API key invalid - please check your OpenWeatherMap API key" });
      }
      if (status === 429) {
        return res.status(429).json({ message: "Rate limit reached - please try again later" });
      }

      const mapped =
        status === 401
          ? "API key invalid"
          : status === 404
          ? "City not found — check spelling"
          : status === 429
          ? "Rate limit reached — try again later"
          : message || "Failed to fetch weather";

      return res.status(status).json({ message: mapped });
    }

    // Pass through the successful JSON
    const json = text ? JSON.parse(text) : {};

    // Basic server timing info for instrumentation
    res.setHeader("Server-Timing", `ow;dur=${Date.now() - start}`);
    return res.status(200).json(json);
  } catch (err) {
    console.error("Network error:", err);
    return res.status(500).json({ message: "Network error - please check your connection" });
  }
}
