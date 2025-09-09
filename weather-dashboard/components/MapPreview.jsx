export default function MapPreview({ wind = "10 mph", precip = "60%" }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="text-slate-300 text-sm mb-3">Local Precipitation</div>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <div className="h-32 w-full bg-[url('https://tile.openstreetmap.org/0/0/0.png')] bg-cover bg-center" role="img" aria-label="Map preview" />
      </div>
      <div className="mt-3 text-slate-200 text-sm flex items-center gap-3">
        <span aria-hidden>🧭</span> {wind}
        <span aria-hidden>💧</span> {precip}
      </div>
    </div>
  );
}


