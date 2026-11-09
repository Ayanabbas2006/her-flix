import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PlayableItem } from "../../types/content";
import { useEscapeKey } from "../common/Toast";
import {
  CloseIcon,
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  MuteIcon,
  HeartIcon,
  ThumbsUpIcon,
  PlusIcon,
} from "../common/Icons";
import { useToast } from "../common/Toast";

interface VideoModalProps {
  item: PlayableItem;
  onClose: () => void;
  onNext?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ item, onClose, onNext }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEscapeKey(onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // The player is its own scroll context — never inherit a scrolled one.
    const scroller = panelRef.current?.parentElement;
    if (scroller) scroller.scrollTop = 0;
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const scroller = panelRef.current?.parentElement;
    if (scroller) scroller.scrollTop = 0;
  }, [item.videoUrl]);

  // Autoplay attempts are allowed because this is a user gesture chain
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setPlaying(false));
  }, [item.videoUrl]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex max-h-[100dvh] items-center justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-sm sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        className="animate-scale-in relative z-10 my-auto flex w-full max-w-5xl flex-col overflow-hidden bg-[#0b0b0f] shadow-2xl ring-1 ring-white/10 sm:rounded-2xl"
      >
        {/* player */}
        <div className="group/player relative flex h-[min(56dvh,32rem)] w-full shrink-0 items-center justify-center overflow-hidden bg-black sm:h-[min(58vh,36rem)]">
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.posterUrl}
            playsInline
            loop
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration) setProgress((el.currentTime / el.duration) * 100);
            }}
            className={`h-full w-full cursor-pointer ${item.portrait ? "object-contain bg-black" : "object-cover"}`}
          />

          {/* top gradient + title */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/75 to-transparent p-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-glow">
                Now playing
              </p>
              <h3 className="mt-0.5 truncate text-base font-bold text-white sm:text-xl">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close player"
            className="absolute right-3 top-3 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-white hover:text-black"
          >
            <CloseIcon size={20} />
          </button>

          {/* center play state */}
          {!playing && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Play"
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition hover:scale-105">
                <PlayIcon size={26} />
              </span>
            </button>
          )}

          {/* bottom controls */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10">
            <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full bg-brand transition-[width]" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggle}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white transition hover:bg-white/15"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white transition hover:bg-white/15"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MuteIcon size={18} /> : <VolumeIcon size={18} />}
              </button>
              <span className="ml-2 hidden text-[11px] text-white/55 sm:block">
                {item.duration ?? "Her·Flix"}
              </span>

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toast("Added to your forever list ♥")}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
                  aria-label="Add to list"
                >
                  <PlusIcon size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Liked. Obviously.")}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
                  aria-label="Like"
                >
                  <ThumbsUpIcon size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Love you more, though.", "love")}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-brand-glow transition hover:bg-brand/20"
                  aria-label="Love"
                >
                  <HeartIcon size={17} filled />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* meta panel below */}
        <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-relaxed text-white/75">{item.caption}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
              <span className="rounded border border-white/15 px-1.5 py-0.5">HD</span>
              <span className="rounded border border-white/15 px-1.5 py-0.5">Dolby</span>
              <span className="rounded border border-white/15 px-1.5 py-0.5">Made for one</span>
              <span className="flex items-center gap-1 text-brand-glow/80">
                <HeartIcon size={11} filled /> 100% match
              </span>
            </div>
          </div>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="shrink-0 cursor-pointer self-start rounded-md bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-white/85"
            >
              Next episode
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
