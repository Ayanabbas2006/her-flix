import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeartIcon, SparkleIcon, PlayIcon } from "../common/Icons";
import { useToast } from "../common/Toast";
import { Celebration } from "./Celebration";

type Phase = "sealed" | "breaking" | "revealed" | "boyfriend";

const CONFETTI_COLORS = ["#e50914", "#ff2d4a", "#ffb3c1", "#ffffff", "#ffd166", "#c084fc"];

interface ConfettiPiece {
  id: number;
  left: number;
  dx: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
  round: boolean;
}

/**
 * The finale: a wax seal that shatters into confetti and a heart,
 * then reveals the question.
 */
export const FinalSeal: React.FC<{ label?: string; question?: string }> = ({
  label = "Open my heart",
  question = "Ready for the next season — together?",
}) => {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [answer, setAnswer] = useState<"yes" | "absolutely" | null>(null);
  // the "I'll think about it" button playfully dodges the cursor
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  // the final "yes" — triggers the sky + confetti celebration
  const [celebrating, setCelebrating] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const { toast } = useToast();
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 320,
        delay: Math.random() * 500,
        duration: 2200 + Math.random() * 1800,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
        round: Math.random() > 0.55,
      })),
    [],
  );

  const breakSeal = () => {
    if (phase !== "sealed") return;
    setPhase("breaking");
    timers.current.push(window.setTimeout(() => setPhase("revealed"), 700));
  };

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border px-5 py-16 text-center transition-colors duration-[1400ms] sm:px-10 sm:py-20 ${
        accepted
          ? "border-rose-300/25 bg-[linear-gradient(180deg,#160b2b_0%,#3a1440_30%,#7d2447_58%,#c4444f_80%,#f3a97e_100%)]"
          : "border-brand/20 bg-gradient-to-b from-[#1b0a11] via-[#0f0d13] to-[#0a0a0d]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
          accepted
            ? "bg-[radial-gradient(ellipse_at_50%_105%,rgba(255,225,175,0.5),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.18),transparent_65%)]"
        }`}
      />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[130%] -translate-x-1/2 rounded-[50%] bg-brand/10 blur-3xl" />

      {phase !== "sealed" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((c) => (
            <span
              key={c.id}
              className="absolute top-[38%] block"
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.round ? c.size : c.size * 1.7,
                borderRadius: c.round ? "999px" : "2px",
                background: c.color,
                opacity: 0.9,
                animation: `confetti-fall ${c.duration}ms cubic-bezier(.15,.6,.35,1) ${c.delay}ms forwards`,
                ["--dx" as string]: `${c.dx}px`,
                ["--rot" as string]: `${c.rotate + 540}deg`,
              }}
            />
          ))}
        </div>
      )}

      {/* sky + confetti celebration, sits behind the copy */}
      {celebrating && <Celebration duration={7000} />}

      <div className="relative z-10 mx-auto max-w-xl">
        {phase === "sealed" && (
          <div className="animate-fade-up">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-glow">
              The final scene
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95]">
              One last letter,
              <br />
              <span className="bg-gradient-to-r from-rose-200 via-brand-glow to-brand bg-clip-text text-transparent">
                still sealed
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed text-white/50">
              Everything before this was a warm-up. This is the part I
              rewrote the most times.
            </p>

            <button
              type="button"
              onClick={breakSeal}
              aria-label={label}
              className="group/seal relative mx-auto mt-10 grid h-36 w-36 cursor-pointer place-items-center sm:h-40 sm:w-40"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-brand/10 [animation-duration:2.6s]" />
              <span className="absolute inset-3 rounded-full border border-brand/30" />
              <span className="relative grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#ff4d63_0%,#c0071a_45%,#6d0310_100%)] shadow-[0_18px_50px_-10px_rgba(229,9,20,0.8),inset_0_4px_14px_rgba(255,255,255,0.25)] transition-transform duration-500 group-hover/seal:scale-105 group-active/seal:scale-95">
                <span className="grid h-[74%] w-[74%] place-items-center rounded-full border border-white/25 text-white">
                  <HeartIcon size={40} filled className="drop-shadow" />
                </span>
              </span>
              <span className="absolute -bottom-9 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                {label}
              </span>
            </button>
          </div>
        )}

        {phase === "breaking" && (
          <div className="grid h-64 place-items-center">
            <HeartIcon
              size={90}
              filled
              className="text-brand-glow"
              style={{ animation: "seal-burst 640ms ease-out forwards" }}
            />
          </div>
        )}

        {phase === "revealed" && (
          <div className="animate-fade-up" key="revealed">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-brand/40 bg-brand/15 text-brand-glow">
              <HeartIcon size={28} filled className="animate-[heartbeat_1.4s_ease-in-out_infinite]" />
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.38em] text-brand-glow">
              <SparkleIcon size={12} /> Final letter
            </p>
            <h2 className="mt-3 font-serif-romance text-[clamp(1.9rem,5vw,3rem)] italic leading-tight text-rose-50">
              {question}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-white/55">
              No deadline, no cage of expectations, no rush, no wrong answer. Just me, hoping the next
              season has your name in the credits.
            </p>

            {answer === null ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setAnswer("absolutely");
                    timers.current.push(window.setTimeout(() => setPhase("boyfriend"), 900));
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_14px_40px_-12px_rgba(229,9,20,0.9)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <HeartIcon size={17} filled /> Yes
                </button>
                <button
                  type="button"
                  onPointerEnter={() => {
                    if (dodges >= 3) return;
                    setDodges(dodges + 1);
                    setDodge({
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 60,
                    });
                  }}
                  onPointerMove={() => {
                    // a real cursor that keeps chasing it gets one more run per move
                    if (dodges === 0 || dodges >= 3) return;
                    setDodges(dodges + 1);
                    setDodge({
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 60,
                    });
                  }}
                  onClick={() => {
                    if (dodges < 3) return;
                    setAnswer("yes");
                    timers.current.push(window.setTimeout(() => setPhase("boyfriend"), 900));
                  }}
                  style={{ transform: `translate(${dodge.x}px, ${dodge.y}px)` }}
                  className="rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-[14px] font-semibold text-white/80 transition-[transform,border-color,color] duration-300 ease-out hover:border-white/40 hover:text-white"
                >
                  {dodges >= 3 ? "Fine… yes" : "I'll think about it"}
                </button>
              </div>
            ) : (
              <div className="animate-scale-in mx-auto mt-8 max-w-sm rounded-2xl border border-brand/30 bg-brand/[0.08] px-6 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-glow">
                  Season 2 · Confirmed
                </p>
                <p className="mt-2 font-serif-romance text-xl italic text-rose-50">
                  {answer === "absolutely"
                    ? "Then it's settled — I'm yours, credits and all."
                    : "Knew it. I was ready before you even asked."}
                </p>
                <button
                  type="button"
                  onClick={() => toast("Screenshot saved to the heart folder ♥")}
                  className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
                >
                  <PlayIcon size={11} /> Play the next season
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── the very last card ── */}
        {phase === "boyfriend" && (
          <div className="animate-fade-up" key="boyfriend">
            <p className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.38em] text-brand-glow">
              <SparkleIcon size={12} /> Post-credits scene
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] text-white">
              CAN I BE YOUR <span className="text-brand-glow">BOYFRIEND?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed text-white/50">
              Same question as the first day. I just wanted to ask it with better
              wording and with my better self this time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (accepted) return;
                  setAccepted(true);
                  setCelebrating(true);
                  setDodge({ x: 0, y: 0 });
                  toast("Best answer in the whole world ♥");
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-9 py-3.5 text-[15px] font-bold text-black shadow-[0_14px_40px_-12px_rgba(255,255,255,0.6)] transition hover:bg-white/90 active:scale-[0.98]"
              >
                <HeartIcon size={17} filled className="text-brand" /> Yes
              </button>
              <button
                type="button"
                onClick={() => toast("Spoiler: the answer is yes. It's always yes.", "info")}
                className="cursor-pointer rounded-full border border-white/20 px-7 py-3.5 text-[14px] font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
              >
                After 4 years.. Maybe
              </button>
            </div>

            {accepted && (
              <p className="animate-fade-up mx-auto mt-8 max-w-md font-serif-romance text-[15px] italic leading-relaxed text-rose-50/90 sm:text-base">
                Then it's forever, love. Same sky, same me, better answer.
              </p>
            )}
          </div>
        )}


      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--dx), 110vh, 0) rotate(var(--rot)); opacity: 0.85; }
        }
        @keyframes seal-burst {
          0% { transform: scale(0.6); opacity: 0.2; }
          45% { transform: scale(1.35); opacity: 1; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          25% { transform: scale(1.16); }
          45% { transform: scale(0.97); }
          65% { transform: scale(1.09); }
        }
      `}</style>
    </section>
  );
};
