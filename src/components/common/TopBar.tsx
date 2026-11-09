import React, { useEffect, useState } from "react";
import type { ScreenKey } from "../../types/content";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./BottomNav";
import { HeartIcon, LockIcon, SparkleIcon, TVIcon } from "./Icons";

interface TopBarProps {
  activeScreen: ScreenKey;
  onSelectScreen: (screen: ScreenKey) => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
  onLogout,
}) => {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid
          ? "border-b border-white/[0.06] bg-[#08080a]/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[68px] sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-3 sm:gap-8">
          <button
            type="button"
            onClick={() => onSelectScreen("edits")}
            className="shrink-0 cursor-pointer transition hover:opacity-90"
            aria-label="Her·Flix home"
          >
            <Logo className="text-2xl sm:text-[28px]" compact />
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.key === activeScreen;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectScreen(item.key)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.hint}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:flex">
            <SparkleIcon size={12} className="text-brand-glow" />
            {activeScreen === "edits"
              ? "Tonight's line-up"
              : activeScreen === "memory"
                ? "The archive"
                : "The finale"}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex cursor-pointer items-center gap-1.5 rounded-md p-0.5 transition hover:bg-white/5 focus:outline-none"
            >
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-rose-400 via-red-500 to-fuchsia-700 ring-1 ring-white/20">
                <HeartIcon size={16} filled className="text-white" />
              </span>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div
                  role="menu"
                  className="animate-scale-in absolute right-0 z-10 mt-3 w-56 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#121216]/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-white/[0.07] px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <HeartIcon size={14} filled className="text-brand-glow" />{" "}
                      Her
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/40">
                      One profile · unlimited love
                    </p>
                  </div>
                  <div className="px-4 py-3 text-[11px] leading-relaxed text-white/50">
                    <p className="flex items-center gap-2">
                      <TVIcon size={13} /> Private screening mode active
                    </p>
                    <p className="mt-1.5 flex items-center gap-2">
                      <LockIcon size={13} /> No one else can find this
                    </p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full cursor-pointer border-t border-white/[0.07] px-4 py-3 text-left text-[13px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    Lock screen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
