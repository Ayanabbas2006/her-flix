import React, { useState } from "react";
import { HeartIcon } from "./Icons";

interface PosterProps {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/**
 * Image with a graceful, on-brand placeholder: a soft crimson gradient
 * with a sparkle while loading, and a heart mark if the asset is missing.
 */
export const Poster: React.FC<PosterProps> = ({
  src,
  alt,
  label,
  className = "",
  imgClassName = "object-cover",
  eager = false,
}) => {
  const [state, setState] = useState<"loading" | "ready" | "error">(
    src ? "loading" : "error",
  );

  return (
    <div className={`relative overflow-hidden bg-[#15151a] ${className}`}>
      {/* shimmer / fallback layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          state === "ready" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,#3a0d17_0%,#16090d_45%,#0b0b0f_100%)]" />
        {state === "loading" && (
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.07)_45%,transparent_60%)] bg-[length:200%_100%] animate-shimmer" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
          <HeartIcon size={26} />
          {label && (
            <span className="px-4 text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
              {label}
            </span>
          )}
        </div>
      </div>

      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={`relative h-full w-full transition-[opacity,transform] duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
