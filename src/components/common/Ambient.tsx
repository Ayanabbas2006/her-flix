import React from "react";

/**
 * Slow-drifting crimson light blobs + film grain.
 * Purely decorative: sits behind everything, ignores pointer events.
 */
export const Ambient: React.FC<{ intensity?: "soft" | "strong" }> = ({
  intensity = "soft",
}) => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
  >
    <div className="absolute inset-0 bg-[#08080a]" />
    <div
      className={`absolute -left-[15%] top-[-20%] h-[60vh] w-[60vh] rounded-full bg-brand/25 blur-[120px] animate-float ${
        intensity === "soft" ? "opacity-50" : "opacity-80"
      }`}
      style={{ animationDelay: "-2s" }}
    />
    <div
      className="absolute -right-[10%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-[#ff3d6e]/20 blur-[130px] animate-float"
      style={{ animationDelay: "-5s" }}
    />
    <div
      className="absolute bottom-[-25%] left-[30%] h-[55vh] w-[55vh] rounded-full bg-[#5b21b6]/20 blur-[140px] animate-float"
      style={{ animationDelay: "-3.5s" }}
    />
    {/* film grain */}
    <div
      className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
    {/* vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
  </div>
);
