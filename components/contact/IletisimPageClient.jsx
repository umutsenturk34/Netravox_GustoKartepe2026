import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Instagram, ArrowRight } from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";
import { getCompanyContact, sanitizePhone } from "@/lib/utils";

function InfoCard({ icon: Icon, label, value, href, featured }) {
  const inner = (
    <div
      className={`flex items-start gap-4 rounded-xl bg-white px-5 py-4 transition ${
        featured
          ? "border-2 border-[var(--bordeaux)] shadow-[0_4px_20px_rgba(139,30,40,0.10)]"
          : "border border-[var(--beige)] hover:border-[var(--bordeaux)]/40"
      }`}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: featured ? "var(--bordeaux)" : "#f5eded", color: featured ? "#fff" : "var(--bordeaux)" }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-[var(--dark)] leading-snug">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{inner}</a>;
  }
  return inner;
}

export default function IletisimPageClient({ company, galleryImages }) {
  const contact = getCompanyContact(company);

  const instagramUrl = contact.instagram || "https://instagram.com/gustokartepe";
  const instagramHandle = instagramUrl
    .replace(/https?:\/\/(www\.)?instagram\.com\/?/, "@")
    .replace(/\/$/, "");

  const workingHours =
    company?.workingHours?.[0]
      ? `${company.workingHours[0].days} ${company.workingHours[0].hours}`
      : "Pazartesi – Pazar 09:00 – 22:00";

  // Use gallery images for Instagram grid — falls back to placeholder divs if empty
  const instaPhotos = (galleryImages || []).filter((img) => img?.url).slice(0, 4);

  return (
    <main className="bg-[var(--cream)] min-h-screen pb-0">

      {/* ── Page header ──────────────────────────────── */}
      <div className="container-shell pt-16 pb-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-[var(--dark)]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          İletişim
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] max-w-md mx-auto">
          Gusto Kartepe ile her konuda iletişime geçin. Adres, telefon ve sosyal medya
          kanallarımızdan bize ulaşabilirsiniz.
        </p>
      </div>

      {/* ── Main two-column grid ─────────────────────── */}
      <div className="container-shell pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">

          {/* Left — contact cards + map */}
          <div className="space-y-3">
            <InfoCard
              icon={MapPin}
              label="Adres"
              featured
              value={contact.address || "Şirinsulhiye Mh. Değirmen Vadisi Sk No:14/1, Kartepe / Kocaeli"}
              href={company?.contact?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(contact.address || "Gusto Kartepe Kartepe Kocaeli")}`}
            />
            <InfoCard
              icon={Phone}
              label="Telefon"
              value={contact.phone || "+90 532 419 92 93"}
              href={`tel:${sanitizePhone(contact.phone)}`}
            />
            <InfoCard
              icon={Mail}
              label="E-posta"
              value={contact.email || "gustokartepe@gmail.com"}
              href={`mailto:${contact.email}`}
            />
            <InfoCard
              icon={Clock}
              label="Çalışma Saatleri"
              value={workingHours}
            />

            {/* Map embed — panelden mapEmbedUrl girilince görünür */}
            {company?.contact?.mapEmbedUrl && (
              <div className="overflow-hidden rounded-xl border border-[var(--beige)] shadow-sm">
                <iframe
                  title="Gusto Kartepe Konum"
                  src={company.contact.mapEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Right — contact form */}
          <ContactForm />
        </div>
      </div>

      {/* ── Reservation CTA banner ───────────────────── */}
      <div style={{ background: "var(--bordeaux)" }}>
        <div className="container-shell py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <h2
                className="text-2xl font-bold text-white md:text-3xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Rezervasyon yapmak mı istiyorsunuz?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Doğanın içinde unutulmaz bir sofra için yerinizi ayırtın. Hafta sonları için
                önceden rezervasyon yapmanızı öneririz.
              </p>
            </div>
            <Link
              href="/restoran/rezervasyon"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-white px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-[var(--bordeaux)]"
            >
              Rezervasyon Sayfasına Git
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Instagram section ────────────────────────── */}
      <div className="container-shell py-16 text-center">
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--beige)] mb-5 mx-auto"
          style={{ color: "var(--bordeaux)" }}
        >
          <Instagram size={22} />
        </div>
        <h2
          className="text-2xl font-bold text-[var(--dark)]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Bizi Instagram&apos;da Takip Edin
        </h2>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium transition hover:opacity-70"
          style={{ color: "var(--bordeaux)" }}
        >
          {instagramHandle}
          <ArrowRight size={13} />
        </a>

        {/* 4-photo grid — galeri modülünden yönetilir */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {instaPhotos.length > 0
            ? instaPhotos.map((img, i) => (
                <a
                  key={img._id || i}
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={img.url}
                    alt={`Gusto Kartepe Instagram ${i + 1}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Instagram size={20} className="text-white drop-shadow" />
                  </div>
                </a>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <a
                  key={i}
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-[#ede8e0] flex items-center justify-center"
                >
                  <Instagram size={22} style={{ color: "var(--bordeaux)", opacity: 0.4 }} />
                </a>
              ))
          }
        </div>
      </div>
    </main>
  );
}
