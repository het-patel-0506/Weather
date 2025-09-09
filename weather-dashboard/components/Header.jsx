import { useEffect } from "react";

export default function Header({ theme, onToggleTheme, onHelp }) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl md:text-3xl font-extrabold">Weather Dashboard</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring"
          aria-pressed={theme === "dark"}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          <span aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring"
          aria-label="Help"
          title="Help"
        >
          <span aria-hidden>❔</span>
        </button>
      </div>
    </header>
  );
}

