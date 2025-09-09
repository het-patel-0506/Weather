import { useState } from "react";
import DayForecastCard from "./DayForecastCard";

export default function ForecastPanel({ days = [], unit = "C" }) {
  const [selectedDay, setSelectedDay] = useState("Today");

  // Generate mock 5-day forecast if none provided
  const mockDays = days.length > 0 ? days : [
    { 
      day: "Today", 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "☀️", 
      high: unit === "F" ? 76 : 24, 
      low: unit === "F" ? 70 : 21, 
      condition: "Sunny",
      precipitation: 0,
      wind: 8
    },
    { 
      day: "Tomorrow", 
      date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "⛅", 
      high: unit === "F" ? 74 : 23, 
      low: unit === "F" ? 68 : 20, 
      condition: "Partly Cloudy",
      precipitation: 20,
      wind: 12
    },
    { 
      day: "Wed", 
      date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "🌤️", 
      high: unit === "F" ? 72 : 22, 
      low: unit === "F" ? 66 : 19, 
      condition: "Mostly Cloudy",
      precipitation: 40,
      wind: 10
    },
    { 
      day: "Thu", 
      date: new Date(Date.now() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "🌧️", 
      high: unit === "F" ? 70 : 21, 
      low: unit === "F" ? 64 : 18, 
      condition: "Light Rain",
      precipitation: 80,
      wind: 15
    },
    { 
      day: "Fri", 
      date: new Date(Date.now() + 345600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: "⛅", 
      high: unit === "F" ? 73 : 23, 
      low: unit === "F" ? 67 : 19, 
      condition: "Partly Cloudy",
      precipitation: 10,
      wind: 9
    },
  ];

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6 text-white">5-Day Forecast</h3>
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
          />
        ))}
      </div>
    </div>
  );
}
