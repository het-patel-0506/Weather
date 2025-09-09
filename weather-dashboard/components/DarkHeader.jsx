import { useEffect, useState } from "react";

export default function DarkHeader({ theme, onToggleTheme, onHelp, onSettings, onLocation, onMenu }) {
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
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Back"
          title="Back"
        >
          <span aria-hidden className="text-white">←</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Weather Pro
        </h1>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-white/60" aria-hidden>🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-pressed={mounted ? (theme === "dark") : undefined}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          <span aria-hidden className="text-white">
            {mounted ? (theme === "dark" ? "🌙" : "☀️") : "○"}
          </span>
        </button>
        
        <button
          type="button"
          onClick={onSettings}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Settings"
          title="Settings"
        >
          <span aria-hidden className="text-white">⚙️</span>
        </button>
        
        <button
          type="button"
          onClick={onLocation}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Current location"
          title="Current location"
        >
          <span aria-hidden className="text-white">📍</span>
        </button>
        
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Menu"
          title="Menu"
        >
          <span aria-hidden className="text-white">☰</span>
        </button>
      </div>
    </header>
  );
}
