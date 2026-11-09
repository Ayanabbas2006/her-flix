import React from "react";
import { SparkleIcon } from "./Icons";

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  cover?: string;
}

/** Big editorial header used by the Memory & Proposal screens. */
export const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  subtitle,
  cover,
}) => (
  <header className="relative mx-auto mb-12 max-w-5xl overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0e0e12]">
    {cover && (
      <>
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />
      </>
    )}
    <div className="relative px-6 py-9 sm:px-10 sm:py-12">
      <p className="animate-fade-up flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-glow">
        <SparkleIcon size={12} /> {eyebrow}
      </p>
      <h1
        className="animate-fade-up mt-3 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.92] tracking-[0.01em]"
        style={{ animationDelay: "70ms" }}
      >
        {title}
      </h1>
      <p
        className="animate-fade-up mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/60 sm:text-[15px]"
        style={{ animationDelay: "130ms" }}
      >
        {subtitle}
      </p>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
  </header>
);
