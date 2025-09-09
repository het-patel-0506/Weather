export default function MainWeatherPro({ temp, unit, condition, high, low }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur flex flex-col justify-center">
        <div className="text-6xl md:text-7xl font-extrabold text-slate-100 tracking-tight">{temp}°{unit}</div>
        <div className="mt-3 flex items-center gap-2 text-slate-300">
          <span aria-hidden>⛅</span>
          <span className="capitalize">{condition}</span>
        </div>
      </div>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-stretch gap-4">
        <div className="relative flex-1 rounded-xl bg-white/5 border border-white/10 p-3 overflow-hidden">
          <div className="absolute inset-0 opacity-60" aria-hidden>
            <svg viewBox="0 0 400 120" className="w-full h-full">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(56,189,248,.35)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                </linearGradient>
              </defs>
              <path d="M0,80 C60,40 120,110 180,70 C240,30 300,100 360,60 L400,120 L0,120 Z" fill="url(#g)" />
              <path d="M0,80 C60,40 120,110 180,70 C240,30 300,100 360,60" stroke="rgba(56,189,248,.9)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="absolute left-2 bottom-2 text-[10px] text-slate-400">0  3  6  9  12  15  18  21</div>
        </div>
        <div className="w-28 rounded-xl bg-white/5 border border-white/10 p-3 text-slate-200 text-sm flex flex-col items-start justify-center">
          <div>H: <strong>{high}°{unit}</strong></div>
          <div>L: <strong>{low}°{unit}</strong></div>
        </div>
      </div>
    </div>
  );
}


