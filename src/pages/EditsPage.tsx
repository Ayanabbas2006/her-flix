import React, { useEffect, useMemo, useState } from "react";
import { useContent } from "../context/ContentContext";
import { HeroSection } from "../components/edits/HeroSection";
import { SeriesRow } from "../components/edits/SeriesRow";
import { VideoModal } from "../components/edits/VideoModal";
import { ScreenSkeleton, ErrorState } from "../components/common/Skeleton";
import { Poster } from "../components/common/Poster";
import { PlayIcon, HeartIcon, SparkleIcon } from "../components/common/Icons";
import type {
  EditSeries,
  PlayableItem,
  VideoEditItem,
} from "../types/content";

const ALL_TAG = "Her Top 10";
const ORIGINAL_TAG = "Made For Her";

/** Flattens every episode across every shelf into one playable list. */
const flatten = (episodes: (VideoEditItem | undefined)[]) =>
  episodes.filter((e): e is VideoEditItem => Boolean(e));

/**
 * Folds every shelf into exactly two rows — "Newly For You" (series-2) and
 * "Memory" (series-1) — without repeating a frame. The flags decide:
 * series-2 holds the 5 new edits, series-1 the 8 old ones. The hand-picked
 * shelf joins the new row; with no pick, series-2 is shown as it is.
 * If one side ends up empty, the tail of the other moves over.
 */
const buildShelves = (series: EditSeries[], pick?: EditSeries) => {
  const seen = new Set<string>();
  const fresh: VideoEditItem[] = [];
  const old: VideoEditItem[] = [];

  series.forEach((s) => {
    const bucket = (s.isNew ?? s.seriesId !== "series-1") ? fresh : old;
    s.episodes.forEach((ep) => {
      if (seen.has(ep.id)) return;
      seen.add(ep.id);
      bucket.push(ep);
    });
  });
  const hasPick = Boolean(pick?.episodes.length);
  pick?.episodes.forEach((ep) => {
    if (seen.has(ep.id)) return;
    seen.add(ep.id);
    fresh.push(ep);
  });

  if (!fresh.length && old.length > 1) fresh.push(old.shift()!);
  else if (!old.length && fresh.length > 1) old.push(fresh.pop()!);

  const shelves: EditSeries[] = [];
  if (fresh.length) {
    shelves.push({
      seriesId: "series-2",
      seriesTitle: "Newly For You",
      seriesSubtitle: hasPick
        ? "Freshly cut, plus the ones hand-picked just for you."
        : "The newly created edits — fresh from the cutting room.",
      isNew: true,
      episodes: fresh,
    });
  }
  if (old.length) {
    shelves.push({
      seriesId: "series-1",
      seriesTitle: "Memory",
      seriesSubtitle: "The old edits — where it all started.",
      isNew: false,
      episodes: old,
    });
  }
  return shelves;
};

const toPlayable = (ep: VideoEditItem): PlayableItem => ({
  videoUrl: ep.videoUrl,
  title: ep.title,
  caption: ep.caption,
  posterUrl: ep.posterUrl ?? ep.thumbnailUrl,
  duration: ep.duration,
  portrait: ep.portrait,
});

export const EditsPage: React.FC = () => {
  const { editsData, loadEdits, error } = useContent();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    loadEdits();
  }, [loadEdits]);

  const shelves = useMemo(
    () => (editsData ? buildShelves(editsData.series, editsData.pick) : []),
    [editsData],
  );

  /** Every frame, de-duplicated, in shelf order — the pool for everything. */
  const allEpisodes = useMemo(
    () => flatten(shelves.flatMap((s) => s.episodes)),
    [shelves],
  );

  /** A different frame every press — never the one that is already playing. */
  const playRandom = () => {
    if (!allEpisodes.length) return;
    const pool =
      allEpisodes.length > 1
        ? allEpisodes.filter((ep) => ep.id !== allEpisodes[activeIndex ?? -1]?.id)
        : allEpisodes;
    const next = pool[Math.floor(Math.random() * pool.length)];
    const idx = allEpisodes.findIndex((e) => e.id === next.id);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  if (!editsData) {
    return error ? (
      <ErrorState message="Your edits couldn't be loaded." onRetry={() => loadEdits()} />
    ) : (
      <ScreenSkeleton label="Rolling out the red carpet…" />
    );
  }

  const { hero } = editsData;

  const openItem = (ep: VideoEditItem) => {
    const idx = allEpisodes.findIndex((e) => e.id === ep.id);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const topTen = allEpisodes.slice(0, 5);

  return (
    <div className="text-white">
      <HeroSection
        hero={hero}
        episodes={allEpisodes}
        onPlayEpisode={openItem}
        onPlayFeatured={(item) => {
          const idx = allEpisodes.findIndex((e) => e.videoUrl === item.videoUrl);
          setActiveIndex(idx >= 0 ? idx : 0);
        }}
      />

      <div className="relative z-10 mt-2 sm:-mt-8 lg:-mt-12">
        {shelves.map((s, i) => (
          <SeriesRow key={s.seriesId} series={s} index={i} onSelectEpisode={openItem} />
        ))}

        {/* ── Top 10 ♥ ── */}
        {topTen.length > 0 && (
          <section className="animate-fade-up mb-9">
            <div className="mb-3 flex items-center gap-2 px-4 sm:px-8 lg:px-12">
              <span className="rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-black tracking-widest text-white">
                TOP 10
              </span>
              <h2 className="text-[15px] font-bold sm:text-lg">
                In Her Heart, Today
              </h2>
              <HeartIcon size={14} filled className="text-brand-glow" />
            </div>
            <div className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8 lg:px-12">
              {topTen.map((ep, i) => (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => openItem(ep)}
                  className="group/ten relative flex w-[240px] shrink-0 cursor-pointer items-center sm:w-[300px]"
                >
                  <span
                    aria-hidden
                    className="select-none font-display text-[92px] leading-none transition-colors duration-300 group-hover/ten:text-white/10 sm:text-[116px]"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "2.5px rgba(255,255,255,0.28)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="relative -ml-4 h-[116px] w-[124px] overflow-hidden rounded-md shadow-xl ring-1 ring-white/10 transition-transform duration-300 group-hover/ten:scale-105 sm:h-[130px] sm:w-[170px]">
                    <Poster
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      label={ep.title}
                      className="h-full w-full"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/35 opacity-0 transition group-hover/ten:opacity-100">
                      <PlayIcon size={22} className="text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}



        {/* ── closing vanity row ── */}
        <section className="animate-fade-up relative mx-4 mb-10 mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#1a0a10] via-[#0f0f14] to-[#0b0b0f] p-6 sm:mx-8 sm:p-9 lg:mx-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-glow">
                <SparkleIcon size={12} /> Because you're still here
              </p>
              <h2 className="mt-2 font-display text-3xl leading-none sm:text-4xl">
                {allEpisodes.length} originals waiting for you
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                The shelf never empties. New frames get added whenever I miss you,
                which is… constantly.
              </p>
            </div>
            <button
              type="button"
              onClick={playRandom}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md bg-white px-5 py-2.5 text-[14px] font-bold text-black transition hover:bg-white/85"
            >
              <PlayIcon size={15} /> Play something new
            </button>
          </div>
        </section>

        <p className="pb-2 text-center font-serif-romance text-sm italic text-white/25">
          {ORIGINAL_TAG} · {ALL_TAG} · {allEpisodes.length} frames and counting
        </p>
      </div>

      {activeIndex !== null && allEpisodes[activeIndex] && (
        <VideoModal
          item={toPlayable(allEpisodes[activeIndex])}
          onClose={() => setActiveIndex(null)}
          onNext={
            activeIndex < allEpisodes.length - 1
              ? () => setActiveIndex((i) => (i === null ? 0 : i + 1))
              : undefined
          }
        />
      )}
    </div>
  );
};
