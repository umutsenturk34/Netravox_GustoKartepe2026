import { draftMode } from "next/headers";
import Link from "next/link";
import { Eye, X } from "lucide-react";

export async function DraftModeBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-3 rounded-full px-5 py-2.5 shadow-lg text-sm font-medium text-white"
      style={{ background: "var(--bordeaux)", boxShadow: "0 4px 24px rgba(130,23,27,0.4)" }}
    >
      <Eye size={15} className="shrink-0" />
      <span>Önizleme modu — taslak içerik görünüyor</span>
      <Link
        href="/api/disable-draft"
        className="flex items-center gap-1 ml-2 rounded-full border border-white/40 px-3 py-1 text-xs hover:bg-white/15 transition"
      >
        <X size={12} /> Çıkış
      </Link>
    </div>
  );
}
