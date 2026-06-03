import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/siteConfig";

function TreeIcon({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
      {/* Tree trunk */}
      <rect x="18.5" y="27" width="3" height="5" rx="0.5" fill="currentColor" />
      {/* Tree layers */}
      <polygon points="20,8 28,22 12,22" fill="currentColor" opacity="0.9" />
      <polygon points="20,14 27,26 13,26" fill="currentColor" />
    </svg>
  );
}

export function Logo({ light = false, logoUrl = null, logoUrlDark = null }) {
  const src = light ? (logoUrl || logoUrlDark) : (logoUrlDark || logoUrl);

  if (src) {
    return (
      <Link href="/" className="inline-flex items-center">
        <Image
          src={src}
          alt={SITE.name}
          width={440}
          height={144}
          className="h-[64px] w-auto object-contain"
          priority
          quality={100}
        />
      </Link>
    );
  }

  const color = light ? "text-white" : "text-[var(--dark)]";
  const mutedColor = light ? "text-white/60" : "text-[var(--muted)]";

  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <TreeIcon className={`h-14 w-14 shrink-0 ${color}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.75rem] font-black tracking-[0.22em] uppercase leading-none ${color}`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Gusto
        </span>
        <span className={`text-[0.78rem] tracking-[0.5em] uppercase leading-none mt-0.5 ${mutedColor}`}>
          Kartepe
        </span>
      </span>
    </Link>
  );
}
