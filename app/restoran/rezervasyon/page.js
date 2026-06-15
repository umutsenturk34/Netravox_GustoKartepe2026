import Image from "next/image";
import ReservationPageClient from "@/components/reservation/ReservationPageClient";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { getCompany, getGallery, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPage("reservation");
  return buildPageMetadata(page, {
    title: "Rezervasyon",
    description: "Gusto Kartepe'de masanızı ayırtın. Doğanın içinde unutulmaz bir deneyim için online rezervasyon yapın.",
    canonical: `${SITE.url}/restoran/rezervasyon`,
  });
}

export default async function ReservationPage() {
  const [company, gallery, page] = await Promise.all([getCompany(), getGallery(), getPage("reservation")]);

  const galleryImages = Array.isArray(gallery) ? gallery : [];

  // Sayfa bloklarından hero block'u bul
  const heroBlock = Array.isArray(page?.blocks)
    ? page.blocks.find((b) => b.type === "hero")
    : null;

  // Öncelik: page blocks hero → company ayarı → galeri fallback
  const heroBg =
    heroBlock?.data?.image ||
    company?.content?.reservationHeroImage ||
    galleryImages[0]?.url ||
    null;

  const heroTitle = heroBlock?.data?.title?.tr ||
    getLocalizedText(company?.content?.reservationHeroTitle, "Rezervasyon");
  const heroSubtitle = heroBlock?.data?.subtitle?.tr ||
    getLocalizedText(company?.content?.reservationHeroSubtitle, "Doğanın içinde özel masanızı ayırtın ve unutulmaz bir gastronomi deneyimine hazırlanın.");

  // Relative path (/uploads/...) production'da çalışmaz — sadece tam URL kabul et
  const isAbsoluteUrl = (url) => url && (url.startsWith("http://") || url.startsWith("https://"));
  const safeBg = isAbsoluteUrl(heroBg) ? heroBg : null;

  // Formun içindeki küçük fotoğraf için galeri[1] veya [0] kullanılır
  const sidebarImage = galleryImages[1]?.url || galleryImages[0]?.url || null;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Restoran", url: "/restoran" },
          { name: "Rezervasyon", url: "/restoran/rezervasyon" },
        ]}
      />

      {/* ── HERO BANNER ─────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        {safeBg ? (
          <Image
            src={safeBg}
            alt="Gusto Kartepe Rezervasyon"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "var(--dark)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(12,10,8,0.45) 0%, rgba(12,10,8,0.72) 100%)" }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.93] text-white">
            {heroTitle}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-md mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <ReservationPageClient company={company} galleryImage={sidebarImage} />
    </>
  );
}
