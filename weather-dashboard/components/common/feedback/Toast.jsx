import { useEffect, useState } from "react";

export default function Toast({ message, type = "info", onClose, duration = 5000, theme = "dark" }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  useEffect(() => {
    if (!visible && message) {
      const t = setTimeout(() => onClose?.(), 250);
      return () => clearTimeout(t);
    }
  }, [visible, message, onClose]);

  if (!message) return null;

  const palette = (() => {
    if (theme === "dark") {
      return type === "success"
        ? "bg-emerald-900/90 border-emerald-700/50 text-white"
        : type === "warning"
        ? "bg-amber-900/90 border-amber-700/50 text-white"
        : type === "error"
        ? "bg-red-900/90 border-red-700/50 text-white"
        : "bg-slate-800/90 border-slate-700/50 text-white";
    }
    return type === "success"
      ? "bg-emerald-100/95 border-emerald-300/70 text-emerald-900"
      : type === "warning"
      ? "bg-amber-100/95 border-amber-300/70 text-amber-900"
      : type === "error"
      ? "bg-rose-100/95 border-rose-300/70 text-rose-900"
      : "bg-white/95 border-slate-200/70 text-slate-900";
  })();

  const icon = type === "success" ? "✅" : type === "warning" ? "⚠️" : type === "error" ? "⛔" : "ℹ️";

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
      <div className={`rounded-lg p-4 shadow-2xl border max-w-sm ${palette}`} role="status" aria-live="polite">
        <div className="flex items-start gap-3">
          <div className="text-lg" aria-hidden>{icon}</div>
          <div className="flex-1 text-sm">{message}</div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className={`h-6 w-6 inline-flex items-center justify-center rounded-md transition-colors ${
              theme === "dark" ? "hover:bg-white/10 text-white/80" : "hover:bg-slate-200 text-slate-700"
            }`}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}


