import { useState, useRef } from 'react';

export default function RecentLocations({ 
  recentLocations = [], 
  favoriteLocations = [],
  onLocationSelect,
  onToggleFavorite,
  onRemoveLocation,
  onReorderLocations,
  theme = "dark"
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragRef = useRef(null);

  // Combine favorites and recent locations
  const allLocations = [
    ...favoriteLocations.map(loc => ({ ...loc, isFavorite: true })),
    ...recentLocations.filter(loc => !favoriteLocations.some(fav => fav.id === loc.id))
  ];

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    
    // Add visual feedback
    if (dragRef.current) {
      dragRef.current.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderLocations(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (allLocations.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          Recent Locations
        </h3>
        <div className={`p-4 rounded-lg text-center ${
          theme === "dark" 
            ? "bg-slate-800/50 border border-slate-700" 
            : "bg-slate-50 border border-slate-200"
        }`}>
          <svg className="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className={`text-sm ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}>
            No recent locations yet
          </p>
          <p className={`text-xs mt-1 ${
            theme === "dark" ? "text-slate-500" : "text-slate-500"
          }`}>
            Search for cities to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={`text-sm font-semibold uppercase tracking-wide ${
        theme === "dark" ? "text-slate-400" : "text-slate-600"
      }`}>
        Recent Locations
      </h3>
      
      <div className="space-y-2">
        {allLocations.map((location, index) => (
          <div
            key={location.id}
            ref={index === draggedIndex ? dragRef : null}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700"
                : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
            } ${
              dragOverIndex === index 
                ? theme === "dark" 
                  ? "ring-2 ring-blue-400 bg-blue-900/20" 
                  : "ring-2 ring-blue-400 bg-blue-50"
                : ""
            }`}
            onClick={() => onLocationSelect(location)}
          >
            {/* Drag Handle */}
            <div className={`absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>

            <div className="flex items-center justify-between ml-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-medium truncate ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>
                    {location.name}
                  </h4>
                  {location.isFavorite && (
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {formatTimeAgo(location.timestamp)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    theme === "dark" 
                      ? "bg-slate-700 text-slate-300" 
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {location.source}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                {/* Favorite Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(location.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    location.isFavorite
                      ? "text-red-400 hover:bg-red-400/10"
                      : theme === "dark"
                        ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                        : "text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                  }`}
                  aria-label={location.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg className="w-4 h-4" fill={location.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLocation(location.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                    theme === "dark"
                      ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                      : "text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                  }`}
                  aria-label="Remove location"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className={`p-3 rounded-lg ${
        theme === "dark" 
          ? "bg-slate-800/30 border border-slate-700" 
          : "bg-slate-50 border border-slate-200"
      }`}>
        <p className={`text-xs ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          💡 <strong>Tip:</strong> Drag locations to reorder them, or click the heart to add to favorites
        </p>
      </div>
    </div>
  );
}
