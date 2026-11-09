import React, { useEffect, useState } from "react";

interface BootSequenceProps {
  onDone: () => void;
}

const LINES = [
  "Verifying the secret code…",
  "Warming up the projector…",
  "Dimming the lights…",
  "Reserving your seat…",
];

/**
 * Netflix-style "Ta-dum". The letters of HER·FLIX sweep in, a light bar
 * wipes across, then the whole thing dissolves into the bottom bar.
 */
export const BootSequence: React.FC<BootSequenceProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const lineTimer = window.setInterval(
      () => setStep((s) => Math.min(s + 1, LINES.length - 1)),
      380,
    );
    const outTimer = window.setTimeout(() => setLeaving(true), 1900);
    const doneTimer = window.setTimeout(onDone, 2450);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(outTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  const letters = "HER·FLIX".split("");

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#08080a] transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.22),transparent_62%)]" />

      <div className="relative flex items-end gap-[2px] font-display text-[clamp(3.4rem,13vw,8rem)] leading-none tracking-[0.04em]">
        {letters.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className={`inline-block ${ch === "·" ? "text-white/40" : i < 3 ? "text-brand" : "text-white"}`}
            style={{
              animation: "letter-in 720ms cubic-bezier(.2,.9,.25,1) both",
              animationDelay: `${i * 55}ms`,
              textShadow:
                i < 3
                  ? "0 0 45px rgba(229,9,20,0.75)"
                  : "0 0 30px rgba(255,255,255,0.18)",
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* wipe line */}
      <div className="relative mt-5 h-[2px] w-[min(72vw,460px)] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-transparent via-brand to-transparent"
          style={{ animation: "boot-wipe 1.5s cubic-bezier(.6,0,.2,1) both" }}
        />
      </div>

      <p
        key={step}
        className="animate-fade-in mt-5 text-[11px] font-medium uppercase tracking-[0.35em] text-white/40"
      >
        {LINES[step]}
      </p>

      <style>{`
        @keyframes letter-in {
          0% { opacity: 0; transform: translateY(26px) scale(0.8); filter: blur(8px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes boot-wipe {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
