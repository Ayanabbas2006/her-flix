import React, { useEffect } from "react";
import { useContent } from "../context/ContentContext";
import { AudioPlayer } from "../components/memory/AudioPlayer";
import { PhotoGrid } from "../components/memory/PhotoGrid";
import { ScreenSkeleton, ErrorState } from "../components/common/Skeleton";
import { SectionIntro } from "../components/common/SectionIntro";
import { ArrowLeftIcon, HeartIcon } from "../components/common/Icons";

interface MemoryPageProps {
  onGoNext?: () => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({ onGoNext }) => {
  const { memoryData, loadMemory, error } = useContent();

  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  if (!memoryData) {
    return error ? (
      <ErrorState message="The archive is locked away." onRetry={() => loadMemory()} />
    ) : (
      <ScreenSkeleton label="Dusting off the photo album…" />
    );
  }

  return (
    <div className="px-4 pt-24 sm:px-8 sm:pt-32 lg:px-12">
      <SectionIntro
        eyebrow="The Archive"
        title={memoryData.intro?.title ?? "Memories"}
        subtitle={
          memoryData.intro?.subtitle ??
          "The quiet archive — every photo, every note, kept safe."
        }
        cover={memoryData.oldImages[0]?.imageUrl}
      />

      <div className="mx-auto max-w-5xl space-y-14">
        <AudioPlayer audios={memoryData.audios} />
        <PhotoGrid images={memoryData.oldImages} />

        {onGoNext && (
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-r from-[#1a0a10] to-[#0b0b0f] p-6 text-center sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-brand/15 blur-3xl" />
            <p className="relative flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-glow">
              <HeartIcon size={12} filled /> One last thing
            </p>
            <h3 className="relative mt-2 font-display text-3xl leading-none sm:text-4xl">
              There's a letter with your name on it
            </h3>
            <button
              type="button"
              onClick={onGoNext}
              className="relative mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition hover:bg-white/85"
            >
              Read it <ArrowLeftIcon size={15} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
