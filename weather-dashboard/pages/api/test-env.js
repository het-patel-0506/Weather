export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    hasOpenWeatherKey: !!process.env.OPENWEATHER_API_KEY,
    hasWeatherKey: !!process.env.WEATHER_API_KEY,
    hasNextPublicWeatherKey: !!process.env.NEXT_PUBLIC_WEATHER_API_KEY,
    hasNextPublicOpenWeatherKey: !!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    openWeatherKeyLength: process.env.OPENWEATHER_API_KEY ? process.env.OPENWEATHER_API_KEY.length : 0,
    weatherKeyLength: process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY.length : 0,
    nextPublicWeatherKeyLength: process.env.NEXT_PUBLIC_WEATHER_API_KEY ? process.env.NEXT_PUBLIC_WEATHER_API_KEY.length : 0,
    nextPublicOpenWeatherKeyLength: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ? process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY.length : 0,
  };

  return res.status(200).json(envVars);
}
