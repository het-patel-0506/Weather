export function WeatherCardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="h-8 bg-white/20 rounded-lg mb-2 w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-white/20 rounded-full"></div>
          <div className="h-10 w-10 bg-white/20 rounded-full"></div>
          <div className="h-10 w-10 bg-white/20 rounded-full"></div>
        </div>
      </div>
      
      <div className="flex items-center gap-8 mb-6">
        <div className="w-32 h-32 bg-white/20 rounded-full"></div>
        <div className="flex-1">
          <div className="h-20 bg-white/20 rounded-lg mb-2"></div>
          <div className="h-6 bg-white/10 rounded w-2/3 mb-1"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-6 w-6 bg-white/20 rounded"></div>
            </div>
            <div className="h-8 bg-white/20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-white/10 rounded-lg"></div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 px-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-white/10 rounded"></div>
              <div className="w-8 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-4 bg-white/10 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-6 bg-white/20 rounded"></div>
              <div className="w-12 h-1 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HourlySkeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
      <div className="flex gap-3 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex-shrink-0 w-20">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="h-4 bg-white/10 rounded mb-1"></div>
              <div className="h-8 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
      <div className="aspect-square bg-white/10 rounded-xl"></div>
    </div>
  );
}
