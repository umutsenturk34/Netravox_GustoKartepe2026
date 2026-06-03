"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

function getLocalizedText(obj, fallback = "") {
  if (!obj) return fallback;
  if (typeof obj === "string") return obj || fallback;
  const lang = typeof navigator !== "undefined" && navigator.language?.startsWith("en") ? "en" : "tr";
  return obj[lang] || obj.tr || obj.en || fallback;
}

function isPopupActive(popup) {
  const now = Date.now();
  if (popup.startDate && new Date(popup.startDate).getTime() > now) return false;
  if (popup.endDate && new Date(popup.endDate).getTime() < now) return false;
  return popup.isActive;
}

function wasDismissed(id) {
  try {
    return !!sessionStorage.getItem(`popup_dismissed_${id}`);
  } catch {
    return false;
  }
}

function dismiss(id) {
  try {
    sessionStorage.setItem(`popup_dismissed_${id}`, "1");
  } catch {}
}

// ── MODAL popup ───────────────────────────────────────────────────────────
function ModalPopup({ popup, onClose }) {
  const title      = getLocalizedText(popup.title);
  const content    = getLocalizedText(popup.content);
  const btnText    = getLocalizedText(popup.buttonText);
  const btnUrl     = popup.buttonUrl;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(12,10,8,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--cream)" }}
      >
        {/* Görsel */}
        {popup.image && (
          <div className="relative h-52 overflow-hidden">
            <img src={popup.image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4))" }} />
          </div>
        )}
        {/* İçerik */}
        <div className="p-7">
          {title && (
            <h2
              className="text-2xl font-bold text-[var(--dark)] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {title}
            </h2>
          )}
          {content && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{content}</p>
          )}
          {btnText && btnUrl && (
            <Link
              href={btnUrl}
              onClick={onClose}
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
              style={{ background: "var(--bordeaux)" }}
            >
              {btnText}
            </Link>
          )}
        </div>
        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
          aria-label="Kapat"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ── BANNER (üst) popup ────────────────────────────────────────────────────
function BannerPopup({ popup, onClose }) {
  const content = getLocalizedText(popup.content) || getLocalizedText(popup.title);
  const btnText = getLocalizedText(popup.buttonText);
  const btnUrl  = popup.buttonUrl;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[200] flex items-center justify-between gap-4 px-4 py-3 text-white text-sm font-medium"
      style={{ background: "var(--dark)" }}
    >
      <span className="flex-1 text-center">
        {content}
        {btnText && btnUrl && (
          <Link href={btnUrl} className="ml-3 underline underline-offset-2 text-white/80 hover:text-white">
            {btnText}
          </Link>
        )}
      </span>
      <button onClick={onClose} aria-label="Kapat" className="shrink-0 hover:opacity-70 transition">
        <X size={15} />
      </button>
    </div>
  );
}

// ── BAR (alt) popup ────────────────────────────────────────────────────────
function BarPopup({ popup, onClose }) {
  const content = getLocalizedText(popup.content) || getLocalizedText(popup.title);
  const btnText = getLocalizedText(popup.buttonText);
  const btnUrl  = popup.buttonUrl;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[200] flex items-center justify-between gap-4 px-4 py-3 text-white text-sm font-medium shadow-lg"
      style={{ background: "var(--bordeaux)" }}
    >
      <span className="flex-1 text-center">
        {content}
        {btnText && btnUrl && (
          <Link href={btnUrl} className="ml-3 underline underline-offset-2 text-white/80 hover:text-white">
            {btnText}
          </Link>
        )}
      </span>
      <button onClick={onClose} aria-label="Kapat" className="shrink-0 hover:opacity-70 transition">
        <X size={15} />
      </button>
    </div>
  );
}

// ── Ana bileşen ────────────────────────────────────────────────────────────
export default function PopupManager({ popups = [] }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const active = popups
      .filter((p) => isPopupActive(p) && !wasDismissed(p._id))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setVisible(active);
  }, []);

  function close(id) {
    dismiss(id);
    setVisible((v) => v.filter((p) => p._id !== id));
  }

  // Modal: sadece en öncelikli birini göster
  const modal   = visible.find((p) => p.type === "modal");
  const banner  = visible.find((p) => p.type === "banner");
  const bar     = visible.find((p) => p.type === "bar");

  return (
    <>
      {modal  && <ModalPopup  popup={modal}  onClose={() => close(modal._id)}  />}
      {banner && <BannerPopup popup={banner} onClose={() => close(banner._id)} />}
      {bar    && <BarPopup    popup={bar}    onClose={() => close(bar._id)}    />}
    </>
  );
}
