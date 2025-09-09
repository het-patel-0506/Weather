export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { city, units = "metric" } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Server API key not configured" });
  }
  if (!city || typeof city !== "string") {
    return res.status(400).json({ message: "City is required" });
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", units === "imperial" ? "imperial" : "metric");

  try {
    const start = Date.now();
    const owRes = await fetch(url.toString());
    const text = await owRes.text();

    // Map common errors to friendly messages
    if (!owRes.ok) {
      const status = owRes.status;
      let message = "Request failed";
      try {
        const data = JSON.parse(text);
        message = data?.message || message;
      } catch {}

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
    return res.status(502).json({ message: "Network error — check connection" });
  }
}
