import React from "react";

/** "HER·FLIX" wordmark — a netflix-style display lockup with a heart fuse. */
export const Logo: React.FC<{ className?: string; compact?: boolean }> = ({
  className = "",
  compact = false,
}) => (
  <span
    className={`select-none font-display leading-none tracking-[0.06em] ${className}`}
  >
    <span className="text-brand">HER</span>
    {!compact && <span className="text-white/50">·</span>}
    <span className="text-white">FLIX</span>
  </span>
);
