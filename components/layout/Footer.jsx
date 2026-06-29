import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { SITE } from "@/lib/siteConfig";
import { getCompanyContact, getLocalizedText, sanitizePhone } from "@/lib/utils";

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.64a6.34 6.34 0 0 0 6.34-6.34V8.69a8.27 8.27 0 0 0 4.85 1.55V6.79a4.85 4.85 0 0 1-1.09-.1z" />
    </svg>
  );
}

const socials = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "facebook",  label: "Facebook",  icon: Facebook  },
  { key: "twitter",   label: "Twitter/X", icon: Twitter   },
  { key: "linkedin",  label: "LinkedIn",  icon: Linkedin  },
  { key: "youtube",   label: "YouTube",   icon: Youtube   },
  { key: "tiktok",    label: "TikTok",    icon: TikTokIcon},
];

function buildFooterLinks(items = []) {
  const seen = new Set();
  const links = [];

  for (const item of items) {
    const children = (item.children || []).filter((c) => c.url && c.url !== "#");
    const hasRealUrl = item.url && item.url !== "#";

    if (children.length > 0) {
      for (const child of children) {
        if (!seen.has(child.url)) {
          seen.add(child.url);
          links.push({ label: child.label, url: child.url });
        }
      }
    } else if (hasRealUrl) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        links.push({ label: item.label, url: item.url });
      }
    }
  }

  return links;
}

export default function Footer({ company, navItems = [] }) {
  const contact = getCompanyContact(company);
  const footerLinks = buildFooterLinks(navItems);

  // workingHours: eski format { days, hours, isOpen } VEYA yeni format { day, open, close, isOpen }
  const rawHours = company?.workingHours;
  let hours;
  if (Array.isArray(rawHours) && rawHours.length > 0) {
    const ORDER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    // Eski format: slot.days (string) + slot.hours (string)
    const isLegacy = rawHours.some((s) => s.days && s.hours);
    if (isLegacy) {
      hours = rawHours
        .filter((s) => s.isOpen !== false && s.days && s.hours)
        .map((s) => ({ label: s.days, hours: s.hours }));
    } else {
      // Yeni format: slot.day + slot.open + slot.close
      const grouped = {};
      for (const slot of rawHours) {
        if (!slot.isOpen || !slot.open || !slot.close) continue;
        const key = `${slot.open}-${slot.close}`;
        grouped[key] = grouped[key] || { open: slot.open, close: slot.close, days: [] };
        grouped[key].days.push(slot.day);
      }
      hours = Object.values(grouped).map(({ open, close, days }) => {
        const sorted = days.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
        const label = sorted.length > 1 ? `${sorted[0]} – ${sorted[sorted.length - 1]}` : sorted[0];
        return { label, hours: `${open} – ${close}` };
      });
    }
  }
  if (!hours?.length) {
    hours = [
      { label: "Pazartesi – Cuma", hours: "09:00 – 22:00" },
      { label: "Hafta Sonu",       hours: "09:00 – 23:00" },
    ];
  }

  // Bölüm başlıkları — panelden content alanından okunur, yoksa default
  const c = company?.content || {};
  const labels = {
    links:   c.footerLinksTitle   || "Hızlı Bağlantılar",
    contact: c.footerContactTitle || "İletişim",
    hours:   c.footerHoursTitle   || "Çalışma Saatleri",
  };

  return (
    <footer className="bg-[var(--cream)] pb-8 pt-8 text-[var(--dark)]">
      <div className="container-shell grid gap-10 border-t border-[var(--beige)] pt-6 pb-10 lg:grid-cols-[1.1fr_0.9fr_1fr_0.8fr]">

        {/* Marka */}
        <div>
          <Logo
            logoUrl={company?.branding?.logoLight}
            logoUrlDark={company?.branding?.logoDark}
          />
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            {getLocalizedText(company?.description,
              "Kartepe'nin dogasiyla lezzeti ayni sofrada bulusturan sakin, rafine ve samimi bir bulusma noktasi.")}
          </p>
        </div>

        {/* Hızlı Bağlantılar — dinamik */}
        <div>
          <h3 className="text-xs tracking-[0.08em] text-[var(--bordeaux)] uppercase">
            {labels.links}
          </h3>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted)]">
            {footerLinks.length > 0 ? (
              footerLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="transition hover:text-[var(--bordeaux)]"
                >
                  {getLocalizedText(link.label)}
                </Link>
              ))
            ) : (
              <span className="text-[var(--muted)]/50 text-xs">Navigasyon menüsü boş.</span>
            )}
          </nav>
        </div>

        {/* İletişim */}
        <div>
          <h3 className="text-xs tracking-[0.08em] text-[var(--bordeaux)] uppercase">{labels.contact}</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {contact.phone && (
              <a
                href={`tel:${sanitizePhone(contact.phone)}`}
                className="flex items-start gap-3 transition hover:text-[var(--bordeaux)]"
              >
                <Phone size={16} className="mt-1 text-[var(--bordeaux)] shrink-0" />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-3 transition hover:text-[var(--bordeaux)]"
              >
                <Mail size={16} className="mt-1 text-[var(--bordeaux)] shrink-0" />
                <span>{contact.email}</span>
              </a>
            )}
            {contact.address && (
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[var(--bordeaux)] shrink-0" />
                <span>{contact.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Çalışma Saatleri + Sosyal */}
        <div>
          <h3 className="text-xs tracking-[0.08em] text-[var(--bordeaux)] uppercase">
            {labels.hours}
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {hours.map((row, i) => (
              <p key={i}>
                {getLocalizedText(row.label)}<br />{getLocalizedText(row.hours)}
              </p>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            {socials
              .filter((item) => contact[item.key])
              .map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={contact[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--beige)] text-[var(--muted)] transition hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
                >
                  <Icon size={16} />
                </a>
              ))}
          </div>
        </div>
      </div>

      <div className="container-shell mt-16 flex items-center justify-between border-t border-[var(--beige)] pt-4 text-[11px] text-[var(--muted)]/60">
        <span>© {new Date().getFullYear()} {getLocalizedText(company?.name, SITE.name)}. Tüm hakları saklıdır.</span>
        <a href="https://netravox.com" target="_blank" rel="noreferrer" className="transition hover:text-[var(--bordeaux)]">Netravox tarafından geliştirildi</a>
      </div>
    </footer>
  );
}
