import CitySearch from "./CitySearch";
import CityList from "./CityList";

export default function LeftNav({ cities = [], activeCity = "", onSelect, onAdd, favorites = [], onToggleFavorite, theme = "dark", refreshTrigger = 0 }) {
  return (
    <nav aria-label="Cities" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold transition-colors ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>Cities</h2>
      </div>
      
      <CitySearch 
        cities={cities}
        onSelect={onSelect}
        onAdd={onAdd}
        theme={theme}
      />
      
      <CityList
        cities={cities}
        activeCity={activeCity}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        theme={theme}
        refreshTrigger={refreshTrigger}
      />
    </nav>
  );
}



