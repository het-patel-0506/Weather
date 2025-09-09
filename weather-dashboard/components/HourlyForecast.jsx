export default function HourlyForecast({ hours = [], unit = "C", theme = "dark" }) {
  // Generate mock hourly data if none provided
  const mockHours = hours.length > 0 ? hours : [
    { time: "Now", temp: 24, icon: "☀️", condition: "Sunny", precipitation: 0 },
    { time: "1PM", temp: 25, icon: "☀️", condition: "Sunny", precipitation: 0 },
    { time: "2PM", temp: 26, icon: "⛅", condition: "Partly Cloudy", precipitation: 10 },
    { time: "3PM", temp: 25, icon: "⛅", condition: "Partly Cloudy", precipitation: 20 },
    { time: "4PM", temp: 24, icon: "🌤️", condition: "Mostly Cloudy", precipitation: 30 },
    { time: "5PM", temp: 23, icon: "🌤️", condition: "Mostly Cloudy", precipitation: 40 },
    { time: "6PM", temp: 22, icon: "🌧️", condition: "Light Rain", precipitation: 60 },
    { time: "7PM", temp: 21, icon: "🌧️", condition: "Light Rain", precipitation: 70 },
    { time: "8PM", temp: 20, icon: "🌧️", condition: "Light Rain", precipitation: 50 },
    { time: "9PM", temp: 19, icon: "🌦️", condition: "Drizzle", precipitation: 30 },
    { time: "10PM", temp: 18, icon: "🌦️", condition: "Drizzle", precipitation: 20 },
    { time: "11PM", temp: 17, icon: "☁️", condition: "Cloudy", precipitation: 10 },
  ];

  return (
    <div className={`backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
      theme === "dark" 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-slate-200/50"
    }`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors ${
        theme === "dark" ? "text-white" : "text-slate-900"
      }`}>24 Hours</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {mockHours.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 group"
          >
            <div className={`backdrop-blur-sm rounded-lg p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              theme === "dark"
                ? "bg-white/10 border border-white/20 hover:bg-white/20"
                : "bg-white/80 border border-slate-200/50 hover:bg-slate-100/80"
            }`}>
              <div className={`text-sm mb-1 transition-colors ${
                theme === "dark" ? "text-white/70" : "text-slate-600"
              }`}>{hour.time}</div>
              <div className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110" aria-hidden>
                {hour.icon}
              </div>
              <div className={`text-sm font-medium transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {hour.temp}°{unit}
              </div>
              <div className={`text-xs mt-1 hidden sm:block transition-colors ${
                theme === "dark" ? "text-white/60" : "text-slate-500"
              }`}>
                {hour.condition}
              </div>
              {hour.precipitation > 0 && (
                <div className={`text-xs mt-1 transition-colors ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}>
                  {hour.precipitation}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
