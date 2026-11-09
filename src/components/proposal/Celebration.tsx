import React, { useEffect, useMemo, useState } from "react";

export interface CelebrationProps {
  /** How long the burst of falling confetti lasts before settling into the sky */
  duration?: number;
}

type Piece = {
  id: number;
  left: number;
  dx: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  spin: number;
  shape: "rect" | "round" | "streamer";
  sway: number;
};

const CONFETTI_COLORS = [
  "#e50914",
  "#ff2d4a",
  "#ff8fa3",
  "#ffd166",
  "#ffe8a3",
  "#ffffff",
  "#ffb3c1",
  "#c084fc",
  "#7dd3fc",
];

const STARS = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  left: (i * 61.7) % 100,
  top: (i * 37.3) % 62,
  size: i % 7 === 0 ? 2.5 : 1.4,
  delay: (i % 11) * 0.28,
}));

/**
 * Full-screen celebration: falling confetti + streamers, rising hearts and
 * clouds, then a permanent golden-hour sky behind the final card.
 */
export const Celebration: React.FC<CelebrationProps> = ({
  duration = 6500,
}) => {
  const [falling, setFalling] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setFalling(false), duration);
    return () => window.clearTimeout(t);
  }, [duration]);

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: 120 }).map((_, i) => {
        const shape =
          i % 13 === 0 ? "streamer" : i % 3 === 0 ? "round" : "rect";
        return {
          id: i,
          left: Math.random() * 100,
          dx: (Math.random() - 0.5) * 42,
          delay: Math.random() * 2200,
          duration: 2600 + Math.random() * 2200,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          size: 5 + Math.random() * 7,
          spin: 360 + Math.random() * 900,
          shape,
          sway: 0.6 + Math.random() * 1.4,
        };
      }),
    [],
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        size: 10 + Math.random() * 22,
        delay: Math.random() * 5000,
        duration: 5200 + Math.random() * 4200,
        drift: (Math.random() - 0.5) * 90,
        opacity: 0.25 + Math.random() * 0.45,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl"
    >
      {/* ── golden-hour sky, always present after "yes" ── */}
      <div className="celebration-sky absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#150a2e_0%,#3b1440_22%,#7a2145_44%,#c43a4a_62%,#ff8a5c_80%,#ffd39b_100%)]" />
        {/* sun glow */}
        <div className="absolute bottom-[-18%] left-1/2 h-[46vh] w-[140%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,225,170,0.75),rgba(255,150,110,0.35)_38%,transparent_70%)] blur-xl" />
        {/* drifting clouds */}
        <div className="celebration-clouds absolute inset-x-0 top-[24%] h-[40%] opacity-45 blur-md" />
        {/* stars in the upper band */}
        {STARS.map((s) => (
          <span
            key={s.id}
            className="celebration-star absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {/* soft dark veil so the copy stays readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,transparent_18%,rgba(8,8,10,0.55)_78%)]" />
      </div>

      {/* ── a one-off sun flare sweeping across ── */}
      <div className="celebration-flare absolute -left-1/3 top-[38%] h-[2px] w-[60%] bg-gradient-to-r from-transparent via-amber-100 to-transparent" />

      {/* ── rising hearts ── */}
      {hearts.map((h) => (
        <span
          key={`h-${h.id}`}
          className="celebration-heart absolute bottom-[-8%]"
          style={{
            left: `${h.left}%`,
            opacity: h.opacity,
            animation: `celebrate-heart ${h.duration}ms linear ${h.delay}ms infinite`,
            ["--drift" as string]: `${h.drift}px`,
            ["--size" as string]: `${h.size}px`,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 20.3s-7.6-4.7-7.6-9.7A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.6 2.7c0 5-7.6 9.7-7.6 9.7Z" />
          </svg>
        </span>
      ))}

      {/* ── confetti burst ── */}
      {falling && (
        <div className="absolute inset-0">
          {pieces.map((p) => (
            <span
              key={p.id}
              className="celebration-piece absolute top-[-6%]"
              style={{
                left: `${p.left}%`,
                width: p.shape === "streamer" ? p.size * 0.45 : p.size,
                height:
                  p.shape === "streamer"
                    ? p.size * 4.2
                    : p.shape === "round"
                      ? p.size
                      : p.size * 1.7,
                borderRadius:
                  p.shape === "round"
                    ? "999px"
                    : p.shape === "streamer"
                      ? "999px"
                      : "1.5px",
                background: p.color,
                boxShadow: `0 0 8px ${p.color}55`,
                animation: `celebrate-fall ${p.duration}ms cubic-bezier(.22,.6,.35,1) ${p.delay}ms forwards`,
                ["--dx" as string]: `${p.dx}vw`,
                ["--spin" as string]: `${p.spin}deg`,
                ["--sway" as string]: `${p.sway}`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes celebrate-fall {
          0%   { transform: translate3d(0,-8%,0) rotate(0deg); opacity: 0; }
          8%   { opacity: 1; }
          100% { transform: translate3d(var(--dx), 130vh, 0) rotate(var(--spin)); opacity: 0.92; }
        }
        @keyframes celebrate-heart {
          0%   { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
          12%  { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { transform: translate3d(var(--drift), -34rem, 0) scale(1.05); opacity: 0; }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 0.95; transform: scale(1.25); }
        }
        .celebration-star { animation: star-twinkle 3.4s ease-in-out infinite; }
        .celebration-sky {
          animation: sky-in 1600ms cubic-bezier(.2,.7,.2,1) both;
        }
        @keyframes sky-in {
          from { opacity: 0; transform: scale(1.06); filter: saturate(0.6) brightness(0.7); }
          to   { opacity: 1; transform: scale(1); filter: saturate(1) brightness(1); }
        }
        .celebration-clouds {
          background:
            radial-gradient(ellipse 22% 40% at 18% 60%, rgba(255,220,205,0.55), transparent 70%),
            radial-gradient(ellipse 28% 46% at 48% 42%, rgba(255,205,220,0.45), transparent 72%),
            radial-gradient(ellipse 24% 38% at 80% 66%, rgba(255,230,210,0.5), transparent 70%);
          animation: clouds-drift 42s linear infinite alternate;
        }
        @keyframes clouds-drift {
          from { transform: translateX(-4%) translateY(0); }
          to   { transform: translateX(4%) translateY(-2%); }
        }
        .celebration-flare {
          opacity: 0;
          filter: blur(1px);
          box-shadow: 0 0 40px 10px rgba(255,236,190,0.55);
          animation: flare-sweep 2100ms ease-out 320ms 1 both;
        }
        @keyframes flare-sweep {
          0%   { opacity: 0; transform: translateX(0) rotate(-8deg); }
          35%  { opacity: 0.9; }
          100% { opacity: 0; transform: translateX(260%) rotate(-8deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .celebration-piece, .celebration-heart, .celebration-flare { display: none; }
          .celebration-sky { animation: none; }
        }
      `}</style>
    </div>
  );
};
