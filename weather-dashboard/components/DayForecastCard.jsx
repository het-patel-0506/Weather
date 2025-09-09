import { useState } from "react";

export default function DayForecastCard({ 
  day, 
  date, 
  icon, 
  high, 
  low, 
  condition, 
  precipitation, 
  wind, 
  unit = "C",
  isSelected = false,
  onSelect 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(day)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full p-4 rounded-lg transition-all duration-300 ${
        isSelected
          ? "bg-amber-400/20 border border-amber-400/50 text-amber-200 shadow-[0_0_0_1px_rgba(255,155,61,.3)]"
          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
      } ${isHovered ? "scale-105 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center min-w-[60px]">
            <div className="text-sm font-medium">{day}</div>
            <div className="text-xs text-white/60">{date}</div>
          </div>
          <div className="text-3xl transition-transform duration-200 hover:scale-110" aria-hidden>
            {icon}
          </div>
          <div className="min-w-[100px]">
            <div className="text-sm text-white/80 capitalize">{condition}</div>
            <div className="text-xs text-white/60">
              {precipitation}% • {wind} {unit === "F" ? "mph" : "m/s"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-semibold">
              {high}°{unit}
            </div>
            <div className="text-sm text-white/60">
              {low}°{unit}
            </div>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full opacity-60"></div>
        </div>
      </div>
    </button>
  );
}
