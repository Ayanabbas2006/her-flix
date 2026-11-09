import React, { useEffect, useRef, useState } from "react";
import type { ScreenKey } from "../../types/content";
import { FilmIcon, PhotoIcon, MailIcon, HeartIcon } from "./Icons";

export interface NavItem {
  key: ScreenKey;
  label: string;
  hint: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "edits", label: "Edits", hint: "Her·Flix home", icon: FilmIcon },
  { key: "memory", label: "Memories", hint: "Photos & notes", icon: PhotoIcon },
  { key: "proposal", label: "Letters", hint: "The finale", icon: MailIcon },
];

interface BottomNavProps {
  activeScreen: ScreenKey;
  onSelectScreen: (screen: ScreenKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((i) => i.key === activeScreen),
  );

  // Get out of the way while she is reading downwards, come back on the way up.
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current + 6;
      const goingUp = y < lastY.current - 6;
      if (goingDown && y > 160) setHidden(true);
      else if (goingUp || y < 120) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:px-6 ${
        hidden ? "translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="relative flex w-full max-w-md items-stretch gap-1 overflow-hidden rounded-[26px] border border-white/10 bg-[#0e0e12]/85 p-1.5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.9),0_25px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:max-w-lg"
      >
        {/* travelling glow behind the active pill */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 rounded-[20px] bg-[linear-gradient(180deg,rgba(229,9,20,0.22),rgba(229,9,20,0.06))] ring-1 ring-brand/30 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{
            width: `calc((100% - 0.75rem) / ${NAV_ITEMS.length} - 0.125rem)`,
            transform: `translateX(calc(${activeIndex} * (100% + 0.5rem)))`,
          }}
        />

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeScreen;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectScreen(item.key)}
              aria-current={active ? "page" : undefined}
              className={`group relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-[20px] py-2 transition-colors duration-300 ${
                active ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              <span className="relative">
                <Icon
                  size={21}
                  className={`transition-transform duration-300 ${
                    active
                      ? "-translate-y-px scale-110"
                      : "group-hover:scale-110"
                  }`}
                />
                {active && (
                  <span className="absolute -right-2 -top-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-glow opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-glow" />
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                {item.label}
              </span>
              {active && (
                <span className="absolute inset-x-6 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
              )}
            </button>
          );
        })}

        {/* the heart is a little easter-egg: it just loves you */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-3 right-3 text-brand-glow/70"
        >
          <HeartIcon size={12} filled />
        </span>
      </nav>
    </div>
  );
};
