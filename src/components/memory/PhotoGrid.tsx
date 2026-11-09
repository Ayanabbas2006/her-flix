import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { OldImageMemory } from "../../types/content";
import { Poster } from "../common/Poster";
import { useEscapeKey } from "../common/Toast";
import {
  PhotoIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "../common/Icons";

/** Slight, deterministic tilt so the wall feels hand-placed but stable */
const TILTS = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.1, -2.8, 2.6];

export const PhotoGrid: React.FC<{ images: OldImageMemory[] }> = ({ images }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const step = (dir: -1 | 1) =>
    setOpenIndex((i) => (i === null ? null : (i + dir + images.length) % images.length));

  useEscapeKey(close, openIndex !== null);

  // keyboard nav in the lightbox
  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length]);

  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-glow">
            <PhotoIcon size={13} /> Side B
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Throwback Snapshots
          </h2>
        </div>
        <span className="text-[11px] text-white/35">{images.length} frames</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            style={{
              transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
              animationDelay: `${Math.min(i, 6) * 60}ms`,
            }}
            className="group animate-fade-up relative cursor-pointer rounded-[3px] bg-[#f5efe4] p-2.5 pb-10 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] transition-all duration-500 ease-out hover:z-10 hover:scale-[1.04] hover:rotate-0 hover:shadow-[0_30px_70px_-20px_rgba(229,9,20,0.45)] focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {/* tape */}
            <span
              aria-hidden
              className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-white/40 shadow-sm backdrop-blur-[1px] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
            />

            <div className="relative aspect-square overflow-hidden bg-zinc-800">
              <Poster
                src={img.imageUrl}
                alt={img.title}
                label={img.title}
                className="h-full w-full"
                imgClassName="object-cover saturate-[0.85] contrast-[1.02] transition-all duration-700 group-hover:scale-110 group-hover:saturate-100"
              />
              {/* warm vintage wash */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-200/15 via-transparent to-rose-900/25 mix-blend-soft-light" />
              <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full border border-white/60 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  View
                </span>
              </div>
            </div>

            <div className="absolute inset-x-3 bottom-2.5">
              <p className="truncate font-serif-romance text-[15px] italic leading-tight text-zinc-800">
                {img.title}
              </p>
              {img.date && (
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {img.date}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ── lightbox ── */}
      {openIndex !== null && images[openIndex] && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={images[openIndex].title}
        >
          <div className="absolute inset-0" onClick={close} aria-hidden />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black"
          >
            <CloseIcon size={18} />
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className="absolute left-2 z-20 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black sm:left-6"
          >
            <ChevronLeftIcon size={22} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className="absolute right-2 z-20 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black sm:right-6"
          >
            <ChevronRightIcon size={22} />
          </button>

          <figure
            key={images[openIndex].id}
            className="animate-scale-in relative z-10 flex max-h-full w-full max-w-3xl flex-col rounded-[4px] bg-[#f5efe4] p-3 pb-5 shadow-2xl"
          >
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-zinc-900">
              <img
                src={images[openIndex].imageUrl}
                alt={images[openIndex].title}
                className="max-h-[62vh] w-auto max-w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 flex items-start justify-between gap-4 px-1">
              <div>
                <p className="font-serif-romance text-lg italic leading-tight text-zinc-800">
                  {images[openIndex].title}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-600">
                  {images[openIndex].caption}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {images[openIndex].date ?? ""}
                </p>
                <HeartIcon size={14} filled className="ml-auto mt-1 text-brand" />
              </div>
            </figcaption>
          </figure>

          <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[11px] tabular-nums tracking-widest text-white/40">
            {String(openIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>
        </div>,
        document.body,
      )}
    </section>
  );
};
