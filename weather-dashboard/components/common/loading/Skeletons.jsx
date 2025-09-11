export function CardSkeleton() {
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 lg:p-8 animate-pulse">
      <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="mt-2 h-3 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="mt-6 flex items-center gap-5">
        <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0,1,2,3].map((i) => (
          <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-4 lg:p-6 animate-pulse">
      <div className="overflow-x-auto flex gap-3">
        {[0,1,2].map((i) => (
          <div key={i} className="min-w-[120px] h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

