import { useEffect, useState } from "react";

export default function FloatingError({ message, onClose, theme = "dark" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
    }`}>
      <div className={`backdrop-blur-xl rounded-lg p-4 shadow-2xl border max-w-sm ${
        theme === "dark"
          ? "bg-red-900/90 border-red-700/50 text-white"
          : "bg-red-100/95 border-red-300/70 text-red-900"
      }`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <span className="text-xl" aria-hidden>⚠️</span>
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold text-sm mb-1 ${
              theme === "dark" ? "text-white" : "text-red-900"
            }`}>
              City Not Found
            </h4>
            <p className={`text-sm ${
              theme === "dark" ? "text-white/80" : "text-red-700"
            }`}>
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className={`flex-shrink-0 p-1 rounded-full transition-colors ${
              theme === "dark"
                ? "text-white/60 hover:text-white hover:bg-white/10"
                : "text-red-600 hover:text-red-800 hover:bg-red-200/50"
            }`}
            aria-label="Close error message"
          >
            <span className="text-sm" aria-hidden>×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
