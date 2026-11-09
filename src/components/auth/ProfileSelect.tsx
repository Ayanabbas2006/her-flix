import React, { useState } from "react";
import { Logo } from "../common/Logo";
import { Ambient } from "../common/Ambient";
import {
  HeartIcon,
  LockIcon,
  SparkleIcon,
  ChevronRightIcon,
} from "../common/Icons";

interface ProfileSelectProps {
  onPick: () => void;
  heroImage?: string;
  /** Her portrait — becomes the "Her" avatar in the picker */
  herAvatarUrl?: string;
}

const PROFILES = [
  {
    id: "her",
    name: "Her",
    sub: "The one it was made for",
    locked: false,
    tone: "from-rose-400 via-red-500 to-fuchsia-700",
  },
  {
    id: "us",
    name: "Us",
    sub: "Locked until we're ready",
    locked: true,
    tone: "from-amber-300 via-rose-400 to-violet-600",
  }
];

export const ProfileSelect: React.FC<ProfileSelectProps> = ({
  onPick,
  heroImage,
  herAvatarUrl,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <Ambient intensity="strong" />

      {/* cinematic backplate from her favourite frame */}
      {heroImage && (
        <div aria-hidden className="absolute inset-0 -z-[5]">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full scale-110 object-cover opacity-[0.16] blur-[3px] animate-vignette-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/85 to-[#08080a]" />
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <Logo className="text-3xl sm:text-4xl" />
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          <SparkleIcon size={14} className="text-brand-glow" />
          Private screening
        </div>
      </header>

      <main className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-6 pb-14 pt-4">
        {/* ── opening title card ── */}
        <div className="animate-fade-up mb-9 text-center lg:mb-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-glow/90">
            A Her·Flix Original
          </p>
          <h1 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.92] tracking-[0.02em] text-white drop-shadow-[0_8px_40px_rgba(229,9,20,0.35)]">
            EVERY FRAME
            <br />
            <span className="bg-gradient-to-r from-rose-200 via-brand-glow to-brand bg-clip-text text-transparent">
              OF US
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-white/65 sm:mt-5 sm:text-[15px]">
            Every good thing that happened to us, on this single site, since, we met, since, my eyes got stuck on your beauty.
          </p>
        </div>

        <h2 className="mb-6 text-base font-medium text-white/85 sm:text-xl lg:mb-7">
          Who's watching?
        </h2>

        <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-9">
          {PROFILES.map((p, i) => {
            const isHovered = hovered === p.id;
            const avatarUrl = p.id === "her" ? herAvatarUrl : undefined;
            return (
              <button
                key={p.id}
                type="button"
                disabled={p.locked}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(p.id)}
                onBlur={() => setHovered(null)}
                onClick={() => !p.locked && onPick()}
                style={{ animationDelay: `${140 + i * 90}ms` }}
                className={`group animate-fade-up flex w-[7rem] cursor-pointer flex-col items-center gap-2.5 outline-none disabled:cursor-not-allowed sm:w-32 lg:w-36 ${
                  p.locked ? "opacity-60 saturate-[0.55]" : ""
                }`}
              >
                <div
                  className={`relative aspect-square w-full overflow-hidden rounded-2xl ring-2 transition-all duration-300 ${
                    isHovered
                      ? "ring-white shadow-[0_0_0_5px_rgba(255,255,255,0.08),0_20px_60px_-12px_rgba(229,9,20,0.85)]"
                      : "ring-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={p.name}
                      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
                        isHovered ? "scale-105" : ""
                      }`}
                    />
                  ) : (
                    <>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${p.tone} transition-transform duration-700 ${
                          isHovered ? "scale-105" : ""
                        }`}
                      />
                      {/* soft highlight + inner shade for depth */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.5),transparent_52%)] mix-blend-soft-light" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_92%,rgba(0,0,0,0.45),transparent_60%)]" />
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  {p.locked && (
                    <div className="absolute inset-0 bg-[#0b0b0f]/55 backdrop-blur-[1.5px]" />
                  )}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      avatarUrl && !isHovered ? "opacity-0" : ""
                    } transition-opacity duration-300`}
                  >
                    {p.locked ? (
                      <LockIcon size={28} className="text-white/60" />
                    ) : (
                      <HeartIcon
                        size={44}
                        filled
                        className={`text-white drop-shadow-lg transition-transform duration-500 ${
                          isHovered ? "scale-110" : ""
                        }`}
                        strokeWidth={1.4}
                      />
                    )}
                  </div>
                  {p.id === "her" && (
                    <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      You're in
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold transition-colors sm:text-base ${
                      isHovered ? "text-white" : "text-white/60"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-white/35 sm:block">
                    {p.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {hovered === "her" && (
          <button
            type="button"
            onClick={onPick}
            className="animate-scale-in mt-10 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand/20"
          >
            Enter her sanctuary <ChevronRightIcon size={16} />
          </button>
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 flex items-center justify-center px-6 pb-6 text-center text-[11px] text-white/30">
        Made with an embarrassing amount of care · 2026
      </footer>
    </div>
  );
};
