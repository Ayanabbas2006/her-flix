import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HeartIcon } from "./Icons";

interface ToastItem {
  id: number;
  message: string;
  tone: "love" | "warn" | "info";
}

const ToastContext = createContext<{
  toast: (message: string, tone?: ToastItem["tone"]) => void;
}>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const toast = useCallback(
    (message: string, tone: ToastItem["tone"] = "love") => {
      const id = ++counter.current;
      setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 2400);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-32">
        {items.map((item) => (
          <div
            key={item.id}
            className={`animate-fade-up flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur-xl ${
              item.tone === "warn"
                ? "border-amber-400/30 bg-amber-950/80 text-amber-100"
                : item.tone === "info"
                  ? "border-white/15 bg-white/10 text-white"
                  : "border-brand/40 bg-[#1a0a0e]/90 text-rose-50"
            }`}
          >
            {item.tone === "love" && (
              <HeartIcon size={15} filled className="text-brand-glow" />
            )}
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/** Small helper so components can react to a key press without boilerplate */
export const useEscapeKey = (handler: () => void, active = true) => {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
};
