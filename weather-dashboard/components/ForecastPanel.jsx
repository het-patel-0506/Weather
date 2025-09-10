import { useState } from "react";
import DayForecastCard from "./DayForecastCard";

export default function ForecastPanel({ days = [], unit = "C", theme = "dark", weatherData = null }) {
  const [selectedDay, setSelectedDay] = useState("Today");

  // Generate mock 5-day forecast if none provided
  const currentTemp = weatherData?.temperature || 24; // Use real current temp or fallback
  
  // Helper function for temperature conversion
  const convertTemp = (tempC) => {
    if (unit === "F") {
      return Math.round((tempC * 9/5) + 32);
    }
    return Math.round(tempC);
  };
  
  // The currentTemp is already in the correct unit from the API
  // So we don't need to convert it, just use it directly
  const baseTemp = Math.round(currentTemp);
  const offset = unit === "F" ? 3.6 : 2; // 2°C = 3.6°F
  
  
  const mockDays = days.length > 0 ? days : [
    { 
      day: "Today", 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "☀️", 
      high: baseTemp + offset, 
      low: baseTemp - (offset * 1.5), 
      condition: "Sunny",
      precipitation: 0,
      wind: 8
    },
    { 
      day: "Tomorrow", 
      date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "⛅", 
      high: baseTemp + (offset * 0.5), 
      low: baseTemp - (offset * 2), 
      condition: "Partly Cloudy",
      precipitation: 20,
      wind: 12
    },
    { 
      day: "Wed", 
      date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "🌤️", 
      high: baseTemp - (offset * 0.5), 
      low: baseTemp - (offset * 2.5), 
      condition: "Mostly Cloudy",
      precipitation: 40,
      wind: 10
    },
    { 
      day: "Thu", 
      date: new Date(Date.now() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "🌧️", 
      high: baseTemp - offset, 
      low: baseTemp - (offset * 3), 
      condition: "Light Rain",
      precipitation: 80,
      wind: 15
    },
    { 
      day: "Fri", 
      date: new Date(Date.now() + 345600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "⛅", 
      high: baseTemp, 
      low: baseTemp - (offset * 2), 
      condition: "Partly Cloudy",
      precipitation: 10,
      wind: 9
    },
  ];

  return (
    <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${
      theme === "dark" 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-slate-200/50"
    }`}>
      <h3 className={`text-lg font-semibold mb-6 transition-colors ${
        theme === "dark" ? "text-white" : "text-slate-900"
      }`}>5-Day Forecast</h3>
      <div className="space-y-3">
        {mockDays.map((day, index) => (
          <DayForecastCard
            key={index}
            day={day.day}
            date={day.date}
            icon={day.icon}
            high={day.high}
            low={day.low}
            condition={day.condition}
            precipitation={day.precipitation}
            wind={day.wind}
            unit={unit}
            isSelected={selectedDay === day.day}
            onSelect={setSelectedDay}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
