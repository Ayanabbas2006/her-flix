export interface UnlockResponse {
  accessToken: string;
  message: string;
}

// 1. Edits Screen Types
export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
  heroImageUrlMobile?: string;
  /** Clean single-panel portrait used for the hero title-card medal */
  heroPosterUrl?: string;
  heroPosterUrlMobile?: string;
  featuredVideoUrl?: string;
  badge?: string;
  meta?: string[];
  tagline?: string;
}

export interface VideoEditItem {
  id: string;
  title: string;
  caption: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  posterUrl?: string;
  tag?: string;
  portrait?: boolean;
}

export interface EditSeries {
  seriesId: string;
  seriesTitle: string;
  seriesSubtitle?: string;
  /** true → the "New Edits" shelf, false → the "Old Edits" shelf */
  isNew?: boolean;
  episodes: VideoEditItem[];
}

export interface EditsSection {
  hero: HeroBanner;
  series: EditSeries[];
  pick?: EditSeries;
}

// 2. Memory Screen Types
export interface AudioMemory {
  id: string;
  title: string;
  caption: string;
  duration: string;
  audioUrl: string;
  coverImageUrl?: string;
  kind?: "audio" | "video";
}

export interface OldImageMemory {
  id: string;
  title: string;
  caption: string;
  date?: string;
  imageUrl: string;
}

export interface SectionIntro {
  title: string;
  subtitle: string;
  sealLabel?: string;
}

export interface MemorySection {
  intro?: SectionIntro;
  audios: AudioMemory[];
  oldImages: OldImageMemory[];
}

// 3. Proposal Screen Types
export interface ProposalCard {
  id: string;
  letterTitle: string;
  letterBody: string;
  imageUrl: string;
  frameStyle?: "polaroid" | "vintage" | "minimal";
  stamp?: string;
}

export interface ProposalSection {
  intro?: SectionIntro;
  cards: ProposalCard[];
}

export type ScreenKey = "edits" | "memory" | "proposal";

// 4. Profile picker (her avatar)
export interface ProfileSection {
  herAvatarUrl?: string;
}

/** Shared shape used everywhere a video needs a poster for its <video> */
export interface PlayableItem {
  videoUrl: string;
  title: string;
  caption: string;
  posterUrl?: string;
  duration?: string;
  /** 9:16 reel — shown letterboxed instead of cropped to 16:9 */
  portrait?: boolean;
}
