import React, { useState } from "react";
import type { ProposalCard } from "../../types/content";
import { Poster } from "../common/Poster";
import { HeartIcon } from "../common/Icons";

/** A letter that arrives "sealed" and unfolds when tapped. */
export const FramedCard: React.FC<{ card: ProposalCard; index: number }> = ({
  card,
  index,
}) => {
  const [opened, setOpened] = useState(false);
  const isPolaroid = (card.frameStyle ?? "polaroid") === "polaroid";

  const frame = {
    polaroid: "rotate-[-1.4deg] bg-[#f6f1e7] text-zinc-900 p-3 pb-11 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]",
    vintage:
      "bg-[#1d150e] border border-amber-700/35 text-amber-50 p-4 shadow-[inset_0_0_60px_rgba(120,72,20,0.25),0_30px_60px_-25px_rgba(0,0,0,0.9)]",
    minimal:
      "bg-white/[0.03] border border-white/10 text-white p-4 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]",
  }[card.frameStyle ?? "polaroid"];

  return (
    <article
      className="animate-fade-up grid items-center gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* photo frame */}
      <div
        className={`group/frame mx-auto w-full max-w-[300px] rounded-sm transition-transform duration-500 hover:rotate-0 ${frame}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Poster
            src={card.imageUrl}
            alt={card.letterTitle}
            label={card.letterTitle}
            className="h-full w-full"
            imgClassName="object-cover transition-transform duration-[1200ms] group-hover/frame:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {card.stamp && (
            <span className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/35 font-display text-sm text-white backdrop-blur">
              {card.stamp}
            </span>
          )}
        </div>
        <p
          className={`mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] ${
            isPolaroid ? "text-zinc-500" : "text-white/40"
          }`}
        >
          {card.letterTitle.split("—")[1]?.trim() ?? card.letterTitle}
        </p>
      </div>

      {/* letter body */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpened((o) => !o)}
          aria-expanded={opened}
          className="group/letter relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141419] to-[#0d0d11] p-6 text-left transition hover:border-brand/30 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl leading-tight tracking-wide text-white sm:text-[32px]">
              {card.letterTitle}
            </h2>
            <HeartIcon
              size={20}
              filled={opened}
              className={`shrink-0 transition-all duration-500 ${
                opened ? "scale-110 text-brand-glow" : "text-white/25 group-hover/letter:text-white/50"
              }`}
            />
          </div>

          <div
            className="grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ gridTemplateRows: opened ? "1fr" : "0fr", opacity: opened ? 1 : 0 }}
          >
            <div className="min-h-0 overflow-hidden">
              <p className="whitespace-pre-line pt-5 font-serif-romance text-[19px] leading-[1.75] text-rose-50/85 sm:text-[21px]">
                {card.letterBody}
              </p>
            </div>
          </div>

          {!opened && (
            <p className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-glow/80">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-brand/40">
                ✦
              </span>
              Tap to break the seal
            </p>
          )}
        </button>
      </div>
    </article>
  );
};
