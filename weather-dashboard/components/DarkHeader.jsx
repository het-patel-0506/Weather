export default function DarkHeader({ title = "Current Temperature", onMenu, onSettings, onExport }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
      <h2 className="text-slate-200 text-sm md:text-base font-medium">{title}</h2>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onSettings} aria-label="Settings" className="h-8 w-8 rounded-full text-slate-200/80 border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring">⚙️</button>
        <button type="button" onClick={onExport} aria-label="Export" className="h-8 w-8 rounded-full text-slate-200/80 border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring">📸</button>
        <button type="button" onClick={onMenu} aria-label="Menu" className="h-8 w-8 rounded-full text-slate-200/80 border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring">≡</button>
      </div>
    </div>
  );
}


