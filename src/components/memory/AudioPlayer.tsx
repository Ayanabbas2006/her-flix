import React, { useEffect, useRef, useState } from "react";
import type { AudioMemory } from "../../types/content";
import { Poster } from "../common/Poster";
import {
  PlayIcon,
  PauseIcon,
  NoteIcon,
  SpeakerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../common/Icons";

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const AudioPlayer: React.FC<{ audios: AudioMemory[] }> = ({ audios }) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  const track = audios[index];
  const isVideo = track?.kind === "video";

  // swap source cleanly whenever the track changes
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.load();
    setTime(0);
    setDuration(0);
    if (playing) el.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!audios.length || !track) return null;

  const toggle = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = mediaRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration;
  };

  const step = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + audios.length) % audios.length);
    setPlaying(true);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <section id="audio-notes" className="scroll-mt-24">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-glow">
            <NoteIcon size={13} /> Side A
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Voice Notes &amp; Audio
          </h2>
        </div>
        <span className="text-[11px] text-white/35">{audios.length} tracks</span>
      </div>

      {/* ── the deck ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#17131a] via-[#0f0f14] to-[#0b0b0f] p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-6">
        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-brand/20 blur-3xl" />

        <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          {/* artwork + vinyl */}
          <div className="relative mx-auto aspect-square w-36 shrink-0 sm:mx-0 sm:w-40">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className={`group/art absolute inset-0 cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl ${
                playing ? "animate-float" : ""
              }`}
              style={{ animationDuration: "9s" }}
            >
              <Poster
                src={track.coverImageUrl}
                alt={track.title}
                label={track.title}
                className="h-full w-full"
                eager
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur">
                {isVideo ? "Video note" : "Audio"}
              </span>
              <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition group-hover/art:opacity-100">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-xl">
                  {playing ? <PauseIcon size={17} /> : <PlayIcon size={17} className="ml-0.5" />}
                </span>
              </span>
            </button>
            {/* spinning record peeking out */}
            <div
              className="absolute -right-5 top-1/2 -z-10 h-[78%] w-[78%] -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,#e50914_0_14%,#1a1a1f_15%_100%)] shadow-2xl"
              style={{
                animation: "spin 6s linear infinite",
                animationPlayState: playing ? "running" : "paused",
              }}
            >
              <div className="absolute inset-[30%] rounded-full bg-black/60" />
            </div>
          </div>

          {/* controls + info */}
          <div className="min-w-0 flex-1 sm:w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-white sm:text-xl">
                  {track.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-white/50">
                  {track.caption}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-brand-glow">
                #{index + 1}
              </span>
            </div>

            {/* hidden host for both media types — the artwork is the UI */}
            {isVideo ? (
              <video
                ref={(el) => {
                  mediaRef.current = el;
                }}
                src={track.audioUrl}
                className="hidden"
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => step(1)}
              />
            ) : (
              <audio
                ref={(el) => {
                  mediaRef.current = el;
                }}
                src={track.audioUrl}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => step(1)}
              />
            )}

            {/* progress */}

            <div className="mt-4">
              <div
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                tabIndex={0}
                onClick={seek}
                className="group/seek relative h-1.5 cursor-pointer rounded-full bg-white/15"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-brand-glow"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow ring-2 ring-brand/50 transition group-hover/seek:opacity-100"
                  style={{ left: `calc(${progress}% - 7px)` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10.5px] tabular-nums text-white/40">
                <span>{fmt(time)}</span>
                <span>{fmt(duration) || track.duration}</span>
              </div>
            </div>


            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous track"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                type="button"
                onClick={toggle}
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-white text-black shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)] transition hover:scale-105"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <PauseIcon size={19} /> : <PlayIcon size={19} className="ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next track"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <ChevronRightIcon size={20} />
              </button>
              <span className="ml-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.2em] text-white/30">
                <SpeakerIcon size={13} /> Volume up, eyes closed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── track list ── */}
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        {audios.map((a, i) => {
          const active = i === index;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setPlaying(true);
              }}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                active
                  ? "border-brand/40 bg-brand/[0.08]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"
              }`}
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                <Poster
                  src={a.coverImageUrl}
                  alt={a.title}
                  label={a.title}
                  className="h-full w-full"
                />
                <span
                  className={`absolute inset-0 grid place-items-center bg-black/45 transition ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {active && playing ? (
                    <span className="flex items-end gap-[2px]">
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className="w-[3px] rounded-sm bg-brand-glow"
                          style={{
                            height: 10 + (b % 3) * 4,
                            animation: "eq 620ms ease-in-out infinite alternate",
                            animationDelay: `${b * 120}ms`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <PlayIcon size={12} className="text-white" />
                  )}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[13px] font-semibold ${
                    active ? "text-white" : "text-white/80"
                  }`}
                >
                  {a.title}
                </p>
                <p className="truncate text-[11px] text-white/35">{a.caption}</p>
              </div>
              <span className="shrink-0 text-[11px] tabular-nums text-white/35">
                {a.duration}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes eq { from { transform: scaleY(0.4); } to { transform: scaleY(1.1); } }
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
      `}</style>
    </section>
  );
};
