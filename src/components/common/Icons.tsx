import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  filled?: boolean;
};

const base = (size = 20): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const PlayIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M7 4.5v15a1 1 0 0 0 1.53.85l11.3-7.5a1 1 0 0 0 0-1.7L8.53 3.65A1 1 0 0 0 7 4.5Z" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M7 10.5V20h9.6a2 2 0 0 0 2-1.6l1.2-6A2 2 0 0 0 17.8 10H14V6a2 2 0 0 0-2-2l-3.4 6.5H7Z" />
    <path d="M3.5 10.5h3.5V20H3.5z" />
  </svg>
);

export const PosterIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 15.5 8.5 11l4 3.5 3-2.5L21 16" />
    <circle cx="9" cy="8.5" r="1.4" />
  </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

export const MuteIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
    <path d="m17 9.5 4 5M21 9.5l-4 5" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14.5v2.5" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size, filled, ...p }) => (
  <svg {...base(size)} {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.3s-7.6-4.7-7.6-9.7A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.6 2.7c0 5-7.6 9.7-7.6 9.7Z" />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M12 2.5c.5 3.9 2.4 5.8 6.3 6.3-3.9.5-5.8 2.4-6.3 6.3-.5-3.9-2.4-5.8-6.3-6.3 3.9-.5 5.8-2.4 6.3-6.3Z" />
    <path d="M18.5 14.5c.3 2.2 1.3 3.2 3.5 3.5-2.2.3-3.2 1.3-3.5 3.5-.3-2.2-1.3-3.2-3.5-3.5 2.2-.3 3.2-1.3 3.5-3.5Z" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

export const FilmIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M7.5 4v16M16.5 4v16M3 9h4.5M3 15h4.5M16.5 9H21M16.5 15H21" />
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 17 4.8-4.3 3.6 3.1 2.6-2.2L20 17" />
  </svg>
);

export const NoteIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M9 18V6.5l10-2V16" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="16.5" cy="16" r="2.5" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7.5 8 5.5 8-5.5" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
  </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M5 9.5v5h3.2L13 18.7V5.3L8.2 9.5H5Z" />
    <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const TVIcon: React.FC<IconProps> = ({ size, ...p }) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
    <path d="m8 3 4 3.5L16 3" />
  </svg>
);
