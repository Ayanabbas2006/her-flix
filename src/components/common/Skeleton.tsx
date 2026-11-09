import React from "react";

const Shimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-white/[0.04] ${className}`}
  >
    <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.06)_45%,transparent_60%)] bg-[length:200%_100%] animate-shimmer" />
  </div>
);

/** Netflix-ish skeleton for a whole content screen */
export const ScreenSkeleton: React.FC<{ label?: string }> = ({
  label = "Loading your evening…",
}) => (
  <div className="animate-fade-in px-4 pt-16 sm:px-8 lg:px-12">
    <div className="relative mb-10 h-[52vh] overflow-hidden rounded-2xl">
      <Shimmer className="h-full w-full rounded-2xl" />
      <div className="absolute bottom-8 left-6 right-6 max-w-lg space-y-3 sm:left-10">
        <Shimmer className="h-3 w-24 rounded-full" />
        <Shimmer className="h-9 w-3/4" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Shimmer className="h-10 w-32 rounded-lg" />
          <Shimmer className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>

    {[0, 1].map((row) => (
      <div key={row} className="mb-8">
        <Shimmer className="mb-3 h-4 w-48 rounded-full" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer
              key={i}
              className="aspect-video w-[68vw] shrink-0 sm:w-[280px]"
            />
          ))}
        </div>
      </div>
    ))}

    <p className="mt-2 text-center text-[11px] uppercase tracking-[0.3em] text-white/30">
      {label}
    </p>
  </div>
);

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = "This reel didn't load.", onRetry }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-full border border-brand/30 bg-brand/10 text-2xl">
      🎞️
    </div>
    <div>
      <p className="text-base font-semibold text-white">{message}</p>
      <p className="mt-1 max-w-sm text-sm text-white/45">
        The projector jammed. Give it another try in a second.
      </p>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
      >
        Try again
      </button>
    )}
  </div>
);
