export default function HourlyStrip({ hours = [], unit = "C" }) {
  // Generate mock hourly data if none provided
  const mockHours = hours.length > 0 ? hours : [
    { time: "Now", temp: 24, icon: "☀️", condition: "Sunny" },
    { time: "1PM", temp: 25, icon: "☀️", condition: "Sunny" },
    { time: "2PM", temp: 26, icon: "⛅", condition: "Partly Cloudy" },
    { time: "3PM", temp: 25, icon: "⛅", condition: "Partly Cloudy" },
    { time: "4PM", temp: 24, icon: "🌤️", condition: "Mostly Cloudy" },
    { time: "5PM", temp: 23, icon: "🌤️", condition: "Mostly Cloudy" },
    { time: "6PM", temp: 22, icon: "🌧️", condition: "Light Rain" },
    { time: "7PM", temp: 21, icon: "🌧️", condition: "Light Rain" },
  ];

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">24 Hours</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {mockHours.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 text-center"
          >
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
              <div className="text-sm text-white/70 mb-1">{hour.time}</div>
              <div className="text-2xl mb-2" aria-hidden>{hour.icon}</div>
              <div className="text-sm font-medium text-white">
                {hour.temp}°{unit}
              </div>
              <div className="text-xs text-white/60 mt-1 hidden sm:block">
                {hour.condition}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
