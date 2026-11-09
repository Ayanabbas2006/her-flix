import React, { useEffect } from "react";
import { useContent } from "../context/ContentContext";
import { FramedCard } from "../components/proposal/FramedCard";
import { FinalSeal } from "../components/proposal/FinalSeal";
import { ScreenSkeleton, ErrorState } from "../components/common/Skeleton";
import { SectionIntro } from "../components/common/SectionIntro";
import { MailIcon, HeartIcon } from "../components/common/Icons";

export const ProposalPage: React.FC = () => {
  const { proposalData, loadProposal, error } = useContent();

  useEffect(() => {
    loadProposal();
  }, [loadProposal]);

  if (!proposalData) {
    return error ? (
      <ErrorState message="The letters are still being written." onRetry={() => loadProposal()} />
    ) : (
      <ScreenSkeleton label="Breaking the wax seal…" />
    );
  }

  return (
    <div className="px-4 pt-24 sm:px-8 sm:pt-32 lg:px-12">
      <SectionIntro
        eyebrow="Letters to You"
        title={proposalData.intro?.title ?? "The Finale"}
        subtitle={
          proposalData.intro?.subtitle ??
          "Every word I wanted to keep in one place for whenever you need to read it."
        }
        cover={proposalData.cards[proposalData.cards.length - 1]?.imageUrl}
      />

      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16">
        <div className="flex items-center gap-3 px-1">
          <MailIcon size={16} className="text-brand-glow" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {proposalData.cards.length} letters · written for you only
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        </div>

        {proposalData.cards.map((card, i) => (
          <FramedCard key={card.id} card={card} index={i} />
        ))}

        <FinalSeal
          label={proposalData.intro?.sealLabel ?? "Open my heart"}
          question="Ready for the next season — together?"
        />

        <p className="flex items-center justify-center gap-2 pb-4 text-center font-serif-romance text-sm italic text-white/30">
          The end… for now <HeartIcon size={13} filled className="text-brand/70" />
        </p>
      </div>
    </div>
  );
};
