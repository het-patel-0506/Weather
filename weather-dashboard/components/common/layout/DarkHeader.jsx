import { useEffect, useState } from "react";
import CenterSearch from "../../search/CenterSearch";

export default function DarkHeader({ theme, onToggleTheme, onHelp, onSettings, onLocation, onMenu, onSearch }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty('--bg-primary', 'rgb(15, 23, 42)');
      root.style.setProperty('--bg-secondary', 'rgb(30, 41, 59)');
      root.style.setProperty('--text-primary', 'rgb(255, 255, 255)');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
    } else {
      root.classList.remove("dark");
      root.style.setProperty('--bg-primary', 'rgb(248, 250, 252)');
      root.style.setProperty('--bg-secondary', 'rgb(255, 255, 255)');
      root.style.setProperty('--text-primary', 'rgb(15, 23, 42)');
      root.style.setProperty('--text-secondary', 'rgba(15, 23, 42, 0.7)');
    }
  }, [theme]);

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Left - Back/Logo */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all focus:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10 focus-visible:ring-white/50"
              : "border-slate-300/50 hover:bg-slate-100/80 focus-visible:ring-slate-400"
          }`}
          aria-label="Back"
          title="Back"
        >
          <span aria-hidden className={`transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-700"
          }`}>←</span>
        </button>
        <h1 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-white to-white/80"
            : "bg-gradient-to-r from-slate-900 to-slate-700"
        }`}>
          Weather Pro
        </h1>
      </div>

      {/* Center - Search Bar */}
      <CenterSearch onSearch={onSearch} theme={theme} />

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all focus:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10 focus-visible:ring-white/50"
              : "border-slate-300/50 hover:bg-slate-100/80 focus-visible:ring-slate-400"
          }`}
          aria-pressed={mounted ? (theme === "dark") : undefined}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          <span aria-hidden className={`transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-700"
          }`}>
            {mounted ? (theme === "dark" ? "🌙" : "☀️") : "○"}
          </span>
        </button>
        
        <button
          type="button"
          onClick={onSettings}
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all focus:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10 focus-visible:ring-white/50"
              : "border-slate-300/50 hover:bg-slate-100/80 focus-visible:ring-slate-400"
          }`}
          aria-label="Settings"
          title="Settings"
        >
          <span aria-hidden className={`transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-700"
          }`}>⚙️</span>
        </button>
        
        <button
          type="button"
          onClick={onLocation}
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all focus:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10 focus-visible:ring-white/50"
              : "border-slate-300/50 hover:bg-slate-100/80 focus-visible:ring-slate-400"
          }`}
          aria-label="Current location"
          title="Current location"
        >
          <span aria-hidden className={`transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-700"
          }`}>📍</span>
        </button>
        
        <button
          type="button"
          onClick={onMenu}
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-all focus:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10 focus-visible:ring-white/50"
              : "border-slate-300/50 hover:bg-slate-100/80 focus-visible:ring-slate-400"
          }`}
          aria-label="Menu"
          title="Menu"
        >
          <span aria-hidden className={`transition-colors ${
            theme === "dark" ? "text-white" : "text-slate-700"
          }`}>☰</span>
        </button>
      </div>
    </header>
  );
}
