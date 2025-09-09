export default function HourlyForecast({ hours = [], unit = "C" }) {
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
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">24 Hours</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {mockHours.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 group"
          >
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="text-sm text-white/70 mb-1">{hour.time}</div>
              <div className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110" aria-hidden>
                {hour.icon}
              </div>
              <div className="text-sm font-medium text-white">
                {hour.temp}°{unit}
              </div>
              <div className="text-xs text-white/60 mt-1 hidden sm:block">
                {hour.condition}
              </div>
              {hour.precipitation > 0 && (
                <div className="text-xs text-blue-300 mt-1">
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
