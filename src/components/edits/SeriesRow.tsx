import React, { useRef, useState } from "react";
import type { EditSeries, PlayableItem, VideoEditItem } from "../../types/content";
import { Poster } from "../common/Poster";
import {
  PlayIcon,
  PlusIcon,
  ThumbsUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "../common/Icons";
import { useToast } from "../common/Toast";

interface SeriesRowProps {
  series: EditSeries;
  index: number;
  onSelectEpisode: (episode: VideoEditItem) => void;
}



export const SeriesRow: React.FC<SeriesRowProps> = ({
  series,
  index,
  onSelectEpisode,
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });
  const { toast } = useToast();

  const updateScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  };

  const nudge = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.82), behavior: "smooth" });
  };

  return (
    <section
      className="group/row animate-fade-up relative mb-6 sm:mb-9"
      style={{ animationDelay: `${Math.min(index, 4) * 90}ms` }}
    >
      <div className="mb-1 flex items-end justify-between px-4 sm:px-8 lg:px-12">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-white/95 sm:text-lg">
            {series.seriesTitle}
            <span className="hidden text-[11px] font-medium text-brand-glow/0 transition-colors duration-300 group-hover/row:text-brand-glow/80 sm:inline">
              Explore all ›
            </span>
          </h2>
          {series.seriesSubtitle && (
            <p className="mt-0.5 hidden text-[11.5px] text-white/40 sm:block">
              {series.seriesSubtitle}
            </p>
          )}
        </div>
        <span className="hidden shrink-0 pl-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 sm:block">
          {series.episodes.length} titles
        </span>
      </div>

      <div className="relative">
        {/* edge controls */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className={`absolute left-0 top-0 z-20 hidden h-full w-9 cursor-pointer items-center justify-center bg-gradient-to-r from-[#08080a] to-transparent text-white/0 transition-all duration-300 hover:text-white sm:flex lg:w-12 ${
            canScroll.left ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronLeftIcon size={30} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className={`absolute right-0 top-0 z-20 hidden h-full w-9 cursor-pointer items-center justify-center bg-gradient-to-l from-[#08080a] to-transparent text-white/0 transition-all duration-300 hover:text-white sm:flex lg:w-12 ${
            canScroll.right ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronRightIcon size={30} />
        </button>

        <div
          ref={scroller}
          onScroll={updateScroll}
          className="hide-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto overflow-y-hidden scroll-smooth px-4 pb-16 pt-3 sm:gap-3 sm:px-8 lg:px-12"
        >
          {series.episodes.map((ep, i) => (
            <article
              key={ep.id}
              className="group/card relative w-[72vw] shrink-0 snap-start sm:w-[300px] lg:w-[330px]"
              style={{ zIndex: 1 }}
            >
              {/* stretch-link: the whole card opens the player, not just the poster */}
              <button
                type="button"
                onClick={() => onSelectEpisode(ep)}
                className="block w-full cursor-pointer text-left outline-none after:absolute after:inset-0 after:z-30 after:cursor-pointer after:content-[''] focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className="relative overflow-hidden rounded-md bg-[#15151a] ring-1 ring-white/[0.06] transition-all duration-300 ease-out group-hover/card:-translate-y-2 group-hover/card:scale-[1.045] group-hover/card:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12)] group-hover/card:z-30">
                  <div className="aspect-video">
                    <Poster
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      label={ep.title}
                      className="h-full w-full"
                      imgClassName="object-cover transition-transform duration-[1200ms] group-hover/card:scale-110"
                    />
                  </div>

                  {/* top badges */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
                    {ep.tag && (
                      <span className="rounded-sm bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow">
                        {ep.tag}
                      </span>
                    )}
                    <span className="rounded-sm bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur">
                      {ep.duration}
                    </span>
                  </div>

                  {/* center play on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 group-hover/card:scale-110">
                      <PlayIcon size={20} />
                    </span>
                  </div>

                  {/* progress bar, netflix continue-watching flavour */}
                  {index === 0 && (
                    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${[62, 24, 88, 41, 12][i % 5]}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>

              {/* expanded info panel (netflix hover card) */}
              <div className="absolute inset-x-2 top-[calc(100%-8px)] z-20 translate-y-1 scale-95 rounded-md bg-[#141419]/98 p-2.5 opacity-0 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:scale-100 group-hover/card:opacity-100">
                {/* controls sit above the card's stretch overlay and must not reach it */}
                <div className="relative z-40 mb-2 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEpisode(ep);
                    }}
                    aria-label={`Play ${ep.title}`}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-black transition hover:bg-white/80"
                  >
                    <PlayIcon size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("Already on your list ♥");
                    }}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/30 text-white/85 transition hover:border-white"
                    aria-label="Add to list"
                  >
                    <PlusIcon size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("Your favourites are my favourites.");
                    }}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/30 text-white/85 transition hover:border-white"
                    aria-label="Like"
                  >
                    <ThumbsUpIcon size={13} />
                  </button>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-white/55">
                    <HeartIcon size={11} filled className="text-brand-glow" /> 100%
                  </span>
                </div>
                <p className="relative z-40 line-clamp-2 text-[11.5px] leading-snug text-white/70">
                  {ep.caption}
                </p>
              </div>
            </article>
          ))}

          {/* a little "more coming" teaser at the end of each shelf */}
          <button
            type="button"
            onClick={() =>
              toast("More episodes are being edited right now…", "info")
            }
            className="flex w-[42vw] shrink-0 snap-start cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-white/12 bg-white/[0.02] text-white/35 transition hover:border-brand/40 hover:text-brand-glow sm:w-[200px] lg:w-[220px]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-current">
              <PlusIcon size={18} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              More coming
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export type { PlayableItem };
