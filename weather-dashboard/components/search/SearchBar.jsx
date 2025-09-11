import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(input.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6" role="search" aria-label="Search weather by city">
      <label htmlFor="city" className="sr-only">
        City
      </label>
      <div className="flex items-center gap-3">
        <input
          id="city"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowSuggestions(false);
          }}
          placeholder="Search city (e.g., London)"
          className="flex-1 min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          aria-required="true"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6 py-3 shadow-md focus:ring-4 focus:ring-sky-300 active:scale-95 transition"
          aria-busy={loading ? "true" : "false"}
          disabled={loading}
        >
          Search
        </button>
      </div>
    </form>
  );
}

