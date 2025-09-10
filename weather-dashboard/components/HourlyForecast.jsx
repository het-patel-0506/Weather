import { useState, useEffect, useMemo } from "react";

export default function HourlyForecast({ hours = [], unit = "C", theme = "dark", hasData = false }) {
  const [mockHours, setMockHours] = useState([]);

  // Don't show if no data
  if (!hasData) return null;

  // Convert temperature based on unit
  const convertTemp = (tempC) => {
    if (unit === "F") {
      return Math.round((tempC * 9/5) + 32);
    }
    return tempC;
  };

  // Generate stable hourly data starting from current time
  const generateDynamicHours = () => {
    const now = new Date();
    const hours = [];
    
    // Use a seed based on current date to make data stable for the day
    const seed = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)); // Changes once per day
    
    for (let i = 0; i < 12; i++) {
      const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const timeStr = i === 0 ? "Now" : hourTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      }).replace(':00', '');
      
      // Generate stable temperature variation (in Celsius)
      const baseTempC = 24;
      const variation = Math.sin(i * 0.5) * 3 + Math.sin(seed + i) * 2;
      const tempC = Math.round(baseTempC + variation);
      
      // Generate stable weather conditions
      const conditions = [
        { icon: "☀️", condition: "Sunny", precipitation: 0 },
        { icon: "⛅", condition: "Partly Cloudy", precipitation: 15 },
        { icon: "🌤️", condition: "Mostly Cloudy", precipitation: 25 },
        { icon: "🌧️", condition: "Light Rain", precipitation: 60 },
        { icon: "🌦️", condition: "Drizzle", precipitation: 35 },
        { icon: "☁️", condition: "Cloudy", precipitation: 10 },
      ];
      
      // Use stable selection based on hour and seed
      const conditionIndex = Math.floor(Math.abs(Math.sin(seed + i * 0.3)) * conditions.length);
      const condition = conditions[conditionIndex];
      
      hours.push({
        time: timeStr,
        tempC: tempC, // Store in Celsius
        temp: convertTemp(tempC), // Convert based on unit
        icon: condition.icon,
        condition: condition.condition,
        precipitation: condition.precipitation
      });
    }
    
    return hours;
  };

  // Memoize the generated hours to prevent unnecessary regeneration
  const generatedHours = useMemo(() => {
    return generateDynamicHours();
  }, []); // Only generate once

  // Generate or update mock hours when unit changes
  useEffect(() => {
    if (hours.length > 0) {
      // If real hours data is provided, convert temperatures
      const convertedHours = hours.map(hour => ({
        ...hour,
        temp: convertTemp(hour.tempC || hour.temp)
      }));
      setMockHours(convertedHours);
    } else {
      // Use memoized generated data
      setMockHours(generatedHours);
    }
  }, [unit, hours, generatedHours]);

  // Use state for mock hours
  const displayHours = mockHours.length > 0 ? mockHours : generatedHours;

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
        {displayHours.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-30 group"
          >
            <div className={`backdrop-blur-sm rounded-lg p-2 h-36 flex flex-col transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              theme === "dark"
                ? "bg-white/10 border border-white/20 hover:bg-white/20"
                : "bg-white/80 border border-slate-200/50 hover:bg-slate-100/80"
            }`}>
              {/* Time Row */}
              <div className={`text-xs mb-2 transition-colors text-center font-medium ${
                theme === "dark" ? "text-white/80" : "text-slate-700"
              }`}>
                {hour.time}
              </div>
              
              {/* Icon Row */}
              <div className="flex justify-center mb-2">
                <div className="text-2xl transition-transform duration-200 group-hover:scale-110" aria-hidden>
                  {hour.icon}
                </div>
              </div>
              
              {/* Temperature Row */}
              <div className={`text-sm font-bold transition-colors text-center mb-2 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {hour.temp}°{unit}
              </div>
              
              {/* Condition Row */}
              <div className={`text-xs transition-colors text-center leading-tight mb-1 ${
                theme === "dark" ? "text-white/70" : "text-slate-600"
              }`}>
                {hour.condition}
              </div>
              
              {/* Precipitation Row */}
              {hour.precipitation > 0 && (
                <div className={`text-[10px] transition-colors text-center font-medium ${
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
