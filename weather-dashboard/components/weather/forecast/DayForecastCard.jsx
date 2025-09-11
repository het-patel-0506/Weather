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
  onSelect,
  theme = "dark"
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
          : theme === "dark"
            ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            : "bg-white/80 border border-slate-200/50 text-slate-900 hover:bg-slate-100/80"
      } ${isHovered ? "scale-105 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center min-w-[60px]">
            <div className="text-sm font-medium">{day}</div>
            <div className={`text-xs transition-colors ${
              theme === "dark" ? "text-white/60" : "text-slate-500"
            }`}>{date}</div>
          </div>
          <div className="text-3xl transition-transform duration-200 hover:scale-110" aria-hidden>
            {icon}
          </div>
          <div className="min-w-[100px]">
            <div className={`text-sm capitalize transition-colors ${
              theme === "dark" ? "text-white/80" : "text-slate-700"
            }`}>{condition}</div>
            <div className={`text-xs transition-colors ${
              theme === "dark" ? "text-white/60" : "text-slate-500"
            }`}>
              {precipitation}% • {wind} {unit === "F" ? "mph" : "m/s"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-semibold">
              {high}°{unit}
            </div>
            <div className={`text-sm transition-colors ${
              theme === "dark" ? "text-white/60" : "text-slate-500"
            }`}>
              {low}°{unit}
            </div>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full opacity-60"></div>
        </div>
      </div>
    </button>
  );
}
