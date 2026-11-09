import React, { useRef, useState } from "react";
import type { HeroBanner, PlayableItem, VideoEditItem } from "../../types/content";
import { PlayIcon, InfoIcon, PlusIcon, HeartIcon } from "../common/Icons";
import { useToast } from "../common/Toast";

interface HeroSectionProps {
  hero: HeroBanner;
  /** Every frame — rendered as the sliding strip beside the title card. */
  episodes?: VideoEditItem[];
  onPlayEpisode?: (episode: VideoEditItem) => void;
  onPlayFeatured: (item: PlayableItem) => void;
}

/** How many small frames the strip shows at once. */
const SLIDE_COUNT = 4;

export const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  episodes = [],
  onPlayEpisode,
  onPlayFeatured,
}) => {
  const { toast } = useToast();
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  const slideCount = Math.max(episodes.length - SLIDE_COUNT + 1, 1);
  const activeEpisode = episodes[active];

  const goTo = (i: number) => {
    const el = scroller.current;
    const clamped = Math.max(0, Math.min(i, slideCount - 1));
    setActive(clamped);
    const card = el?.children[clamped] as HTMLElement | undefined;
    if (el && card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft - 16,
        behavior: "smooth",
      });
    }
  };

  const syncFromScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const stride = first ? first.offsetWidth + 8 : 1;
    setActive(Math.max(0, Math.min(Math.round(el.scrollLeft / stride), slideCount - 1)));
  };

  /** The strip's primary button: the selected frame, or the featured cut. */
  const playSelected = () => {
    if (activeEpisode && onPlayEpisode) onPlayEpisode(activeEpisode);
    else onPlayFeatured(defaultFeatured);
  };

  const defaultFeatured: PlayableItem = {
    videoUrl: hero.featuredVideoUrl ?? "",
    title: hero.title,
    caption: hero.subtitle,
    posterUrl: hero.heroImageUrl,
  };

  return (
    <section className="relative flex w-full flex-col overflow-hidden">
      {/* ── Backdrop: an ambient, heavily-softened field ── */}
      <div className="absolute inset-0">
        <img
          src={hero.heroImageUrl}
          alt=""
          className="h-full w-full scale-125 object-cover object-center opacity-60 blur-2xl brightness-[0.9] saturate-125 animate-vignette-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div className="absolute inset-0 bg-[#08080a]/55" />
        {/* legibility wash for the copy side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/80 to-[#08080a]/20 lg:to-transparent" />
        {/* bottom dissolve into the page */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#08080a] via-[#08080a]/85 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#08080a]/80 to-transparent" />
        {/* warm spotlight behind the portrait */}
        <div className="absolute right-[-6%] top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.32),transparent_62%)] blur-2xl" />
      </div>

      {/* ── Title-card medal: a clean single-panel portrait ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[46%] hidden -translate-y-1/2 xl:right-[8%] lg:block"
      >
        <div className="relative h-[24rem] w-[17rem] xl:h-[27rem] xl:w-[19rem]">
          {/* halo ring */}
          <div className="absolute -inset-3 rounded-[2rem] border border-white/10" />
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/25 via-transparent to-transparent blur-md" />
          <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] ring-1 ring-white/20 shadow-[0_40px_90px_-30px_rgba(0,0,0,1)]">
            <img
              src={hero.heroPosterUrl ?? hero.heroImageUrl}
              alt={hero.title}
              className="h-full w-full object-cover object-[center_18%]"
              style={{
                maskImage:
                  "radial-gradient(120% 100% at 50% 42%, #000 58%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(120% 100% at 50% 42%, #000 58%, transparent 100%)",
              }}
            />
            {/* top + bottom fades so it melts into the stage */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#08080a] via-[#08080a]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-brand-glow">
                Her·Flix Original
              </p>
              <p className="mt-1 font-serif-romance text-lg italic leading-tight text-rose-50/90">
                the one it was made for
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full max-w-[1600px] flex-auto flex-col justify-end px-5 pb-32 pt-24 sm:px-8 lg:px-12 lg:pb-36">
        <div className="max-w-2xl lg:max-w-[30rem] xl:max-w-[34rem]">
          <div className="animate-fade-up flex items-center gap-2">
            <span className="font-display text-[13px] tracking-[0.35em] text-brand-glow">
              H
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/85">
              {hero.badge ?? "Her·Flix Original"}
            </span>
          </div>

          <h1
            className="animate-fade-up mt-3 font-display text-[clamp(2.8rem,7.2vw,6rem)] leading-[0.9] tracking-[0.01em] text-white"
            style={{ animationDelay: "80ms", textShadow: "0 12px 50px rgba(0,0,0,0.65)" }}
          >
            {hero.title}
          </h1>

          <div
            className="animate-fade-up mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-white/70"
            style={{ animationDelay: "140ms" }}
          >
            <span className="rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              #1 tonight
            </span>
            {(hero.meta ?? ["2026", "A-Z", "Romance", "Soft Hours"]).map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-white/30" />}
                {m}
              </span>
            ))}
          </div>

          <p
            className="animate-fade-up mt-5 max-w-xl text-[14px] leading-relaxed text-white/75 sm:text-[15.5px] sm:leading-[1.7]"
            style={{ animationDelay: "200ms" }}
          >
            {hero.subtitle}
          </p>

          {hero.tagline && (
            <p
              className="animate-fade-up mt-3 font-serif-romance text-lg italic text-rose-200/70 sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              “{hero.tagline}”
            </p>
          )}

          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <button
              type="button"
              onClick={playSelected}
              disabled={!activeEpisode && !hero.featuredVideoUrl}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white px-6 py-3 text-[15px] font-bold text-black shadow-[0_10px_35px_-12px_rgba(255,255,255,0.5)] transition hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-7"
            >
              <PlayIcon size={18} className="transition-transform group-hover:scale-110" />
              Play
            </button>
            <button
              type="button"
              onClick={() => toast("More ways to love you — coming in a future season.")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-white/[0.14] px-5 py-3 text-[15px] font-semibold text-white backdrop-blur-md transition hover:bg-white/25 sm:px-6"
            >
              <InfoIcon size={19} /> More Info
            </button>
            <button
              type="button"
              onClick={() => toast("Already on your list, forever ♥")}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:border-white/70 hover:bg-black/50"
              aria-label="Add to my list"
            >
              <PlusIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => toast("Forever yours. Obviously.", "love")}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-brand/40 bg-brand/15 text-brand-glow backdrop-blur-md transition hover:bg-brand/30"
              aria-label="Love this"
            >
              <HeartIcon size={19} filled />
            </button>
          </div>

          {/* ── sliding episode strip, netflix-episode flavour ── */}
          {episodes.length > 0 && (
            <div
              className="animate-fade-up mt-7 w-full"
              style={{ animationDelay: "320ms" }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
                  {activeEpisode
                    ? `Up next · ${activeEpisode.title}`
                    : "More for you"}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous frame"
                    onClick={() => goTo(active - 1)}
                    disabled={active === 0}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/35 text-white/80 backdrop-blur transition hover:border-white/60 hover:text-white disabled:cursor-default disabled:opacity-25"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next frame"
                    onClick={() => goTo(active + 1)}
                    disabled={active >= slideCount - 1}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/35 text-white/80 backdrop-blur transition hover:border-white/60 hover:text-white disabled:cursor-default disabled:opacity-25"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div
                ref={scroller}
                onScroll={syncFromScroll}
                className="hide-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1"
              >
                {episodes.map((ep, i) => {
                  const isActive = i === active;
                  return (
                    <div
                      key={ep.id}
                      className={`group/slide slide-w shrink-0 snap-start overflow-hidden rounded-md bg-[#15151a] ring-1 transition-all duration-300 ${
                        isActive
                          ? "ring-white/30"
                          : "opacity-70 ring-white/10 hover:opacity-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActive(i);
                          goTo(i);
                        }}
                        aria-label={`Select ${ep.title}`}
                        className="relative block aspect-video w-full cursor-pointer outline-none"
                      >
                        <img
                          src={ep.thumbnailUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {isActive && (
                          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" />
                        )}
                      </button>
                      <div className="flex items-center gap-1 px-1.5 py-1.5">
                        {/* one play button per video */}
                        <button
                          type="button"
                          onClick={() => onPlayEpisode?.(ep)}
                          aria-label={`Play ${ep.title}`}
                          className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-black transition hover:scale-110"
                        >
                          <PlayIcon size={9} />
                        </button>
                        <span className="truncate text-[9px] font-medium text-white/60 group-hover/slide:text-white/90">
                          {ep.tag ?? ep.duration}
                        </span>
                        <span className="ml-auto shrink-0 text-[9px] text-white/35">
                          {ep.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* rating strip + gentle scroll cue, bottom-right like netflix */}
      <div className="pointer-events-none absolute bottom-8 right-4 hidden items-center gap-5 md:flex lg:hidden xl:flex">
        <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30">
          Scroll to browse
          <span className="grid h-6 w-4 place-items-start rounded-full border border-white/25 p-0.5">
            <span className="h-1.5 w-1 animate-[scroll-dot_1.8s_ease-in-out_infinite] rounded-full bg-white/60" />
          </span>
        </span>
        <div className="flex items-center gap-3 border-l-2 border-white/60 bg-black/40 py-1.5 pl-3 pr-4 text-sm text-white/90 backdrop-blur-sm">
          <span className="text-[11px] uppercase tracking-widest text-white/60">Age</span>
          <span className="font-semibold">All hearts</span>
        </div>
      </div>

      <style>{`
        @keyframes scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(9px); opacity: 1; }
        }
      `}</style>
    </section>
  );
};
