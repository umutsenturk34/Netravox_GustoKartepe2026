import Image from "next/image";
import { CheckCircle2, Clock, MapPin, Phone, MessageCircle, Instagram } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { getCompanyContact, sanitizePhone } from "@/lib/utils";

const features = [
  "Doğa içinde özel ve sakin atmosfer",
  "Aile ve arkadaş buluşmaları için ideal düzen",
  "Yoğunluk nedeniyle ön rezervasyon önerilir",
];

export default function ReservationSidebar({ company, galleryImage }) {
  const contact = getCompanyContact(company);
  const phone = contact?.phone || SITE.phone;
  const phoneSanitized = sanitizePhone(phone).replace("+", "");
  const instagram = contact?.instagram || SITE.instagram;
  const address = contact?.address || `${SITE.address.streetAddress}, ${SITE.address.addressLocality}/${SITE.address.addressRegion}`;

  return (
    <aside className="space-y-8">
      {/* Başlık */}
      <div>
        <h1
          className="text-5xl font-bold leading-tight text-[var(--dark)]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Rezervasyon
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)] max-w-sm">
          Doğanın içinde özel masanızı ayırtın ve unutulmaz bir gastronomi deneyimine hazırlanın.
        </p>
      </div>

      {/* Fotoğraf */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--beige)]">
        {galleryImage ? (
          <Image
            src={galleryImage}
            alt="Gusto Kartepe restoran"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-end p-6"
            style={{
              background:
                "linear-gradient(135deg, #2d1f10 0%, #4a3420 50%, #6b4c2a 100%)",
            }}
          >
            <p
              className="text-2xl font-bold text-white/80"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Gusto Kartepe
            </p>
          </div>
        )}
      </div>

      {/* Özellikler */}
      <div className="space-y-3">
        {features.map((text) => (
          <div key={text} className="flex items-start gap-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
              style={{ color: "var(--bordeaux)" }}
            />
            <p className="text-sm leading-relaxed text-[var(--dark)]">{text}</p>
          </div>
        ))}
      </div>

      {/* Bilgi kutuları */}
      <div
        className="rounded-2xl border border-[var(--beige)] bg-white/70 p-5 space-y-4"
      >
        <div className="flex items-start gap-3">
          <Clock size={16} className="mt-0.5 shrink-0" style={{ color: "var(--bordeaux)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Çalışma Saatleri
            </p>
            <p className="mt-1 text-sm text-[var(--dark)]">Hafta İçi: 09:00 – 22:00</p>
            <p className="text-sm text-[var(--dark)]">Hafta Sonu: 09:00 – 22:00</p>
          </div>
        </div>

        <div className="h-px bg-[var(--beige)]" />

        <div className="flex items-start gap-3">
          <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--bordeaux)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Adres
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--dark)]">{address}</p>
          </div>
        </div>
      </div>

      {/* Hızlı iletişim */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
          Hızlı İletişim
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${sanitizePhone(phone)}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--beige)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--dark)] transition hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
          >
            <Phone size={14} />
            Ara
          </a>
          <a
            href={`https://wa.me/${phoneSanitized}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/30 bg-[#25d366]/8 px-4 py-2.5 text-sm font-medium text-[#16a34a] transition hover:bg-[#25d366]/15"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#e1306c]/20 bg-[#e1306c]/8 px-4 py-2.5 text-sm font-medium text-[#e1306c] transition hover:bg-[#e1306c]/15"
          >
            <Instagram size={14} />
            Instagram
          </a>
        </div>
      </div>
    </aside>
  );
}
