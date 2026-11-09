import React, { useEffect, useRef, useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Logo } from "../common/Logo";
import { useEscapeKey } from "../common/Toast";
import {
  HeartIcon,
  LockIcon,
  SparkleIcon,
  ArrowLeftIcon,
} from "../common/Icons";

interface PasswordModalProps {
  onClose: () => void;
  onUnlocked: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  onClose,
  onUnlocked,
}) => {
  const { login, loadingScreen, error, clearError } = useContent();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = loadingScreen === "unlock";

  useEscapeKey(onClose, !busy);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 260);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || busy) return;
    const ok = await login(password);
    if (ok) {
      setSuccess(true);
      // let the heart beat once before the boot sequence starts
      window.setTimeout(onUnlocked, 900);
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 520);
      inputRef.current?.select();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Enter password"
    >
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/55 backdrop-blur-[6px]"
        onClick={() => !busy && onClose()}
      />

      <div
        className={`animate-scale-in relative w-full max-w-[420px] overflow-hidden rounded-[22px] border border-white/10 bg-[#121216]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ${
          shake ? "shake" : ""
        }`}
      >
        {/* top hairline glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand/25 blur-3xl"
        />

        <div className="relative px-7 pb-8 pt-7 sm:px-9">
          <div className="mb-6 flex items-center justify-between">
            <Logo className="text-2xl" compact />
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="text-xs font-medium text-white/40 transition hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>
          </div>

          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 ${
              success
                ? "border-rose-300/50 bg-rose-500/20 text-brand-glow"
                : "border-white/10 bg-white/5 text-white/80"
            }`}
          >
            {success ? (
              <HeartIcon
                size={26}
                filled
                className="animate-[heartbeat_0.9s_ease-in-out_infinite]"
              />
            ) : (
              <LockIcon size={24} />
            )}
          </div>

          <h2 className="text-center text-[22px] font-bold tracking-tight text-white">
            {success ? "Welcome home, love." : "This one's locked"}
          </h2>
          <p className="mx-auto mt-2 max-w-[250px] text-center text-[13px] leading-relaxed text-white/50">
            {success
              ? "Cueing up your evening…"
              : "Ahhh, The password hint is the date we met [DD-MM-YYYY]?"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div
              className={`group relative flex items-center rounded-xl border bg-black/40 transition-all ${
                error
                  ? "border-red-500/70 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus-within:border-red-500"
                  : "border-white/12 focus-within:border-white/35 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.07)]"
              }`}
            >
              <span className="pl-4 text-white/30">
                <SparkleIcon size={16} />
              </span>
              <input
                ref={inputRef}
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                placeholder="Our secret"
                autoComplete="current-password"
                disabled={busy || success}
                className="w-full bg-transparent px-3 py-3.5 text-[15px] tracking-wide text-white placeholder:text-white/25 focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShow((s) => !s)}
                className="mr-2 shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 transition hover:bg-white/5 hover:text-white/80"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="animate-fade-up flex items-start gap-1.5 text-[12px] leading-snug text-red-400"
              >
                <span aria-hidden className="mt-px">✕</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || success || !password.trim()}
              className="relative w-full overflow-hidden rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(229,9,20,0.9)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Unlocking…
                </span>
              ) : success ? (
                <span className="inline-flex items-center gap-2">
                  <HeartIcon size={16} filled /> Entering
                </span>
              ) : (
                "Unlock our story"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-[12px] text-white/35 transition hover:text-white/70 disabled:opacity-40"
          >
            <ArrowLeftIcon size={13} /> Back to profiles
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          25% { transform: scale(1.18); }
          45% { transform: scale(0.96); }
          65% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
