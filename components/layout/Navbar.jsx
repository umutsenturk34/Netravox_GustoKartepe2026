"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";

const transparentRoutes = new Set();

function isComingSoon(item) {
  const children = item.children || [];
  return (
    (item.url === "#" || !item.url) &&
    (children.length === 0 || children.every((c) => c.url === "#" || !c.url))
  );
}

function DropdownMenu({ items, isLight }) {
  return (
    <div className="absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 pt-3">
      <div className="overflow-hidden rounded-xl border border-[var(--beige)] bg-white shadow-[0_20px_60px_rgba(30,24,16,0.12)]">
        {items.map((child, i) => {
          const coming = child.url === "#" || !child.url;
          return (
            <div key={i}>
              {coming ? (
                <div className="flex items-center justify-between px-5 py-3 text-sm text-[var(--muted)]">
                  <span>{child.label}</span>
                  <span className="ml-3 rounded-full bg-[var(--beige)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--bordeaux)]">
                    Yakında
                  </span>
                </div>
              ) : (
                <Link
                  href={child.url}
                  className="block px-5 py-3 text-sm font-medium text-[var(--dark)] transition hover:bg-[var(--beige)] hover:text-[var(--bordeaux)]"
                >
                  {child.label}
                </Link>
              )}
              {i < items.length - 1 && <div className="mx-4 h-px bg-[var(--beige)]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavItem({ item, isLight }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();
  const hasChildren = (item.children || []).length > 0;
  const coming = isComingSoon(item);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive =
    pathname === item.url ||
    (hasChildren && item.children.some((c) => c.url && c.url !== "#" && pathname.startsWith(c.url)));

  const textClass = isActive
    ? "text-[var(--bordeaux)]"
    : isLight
    ? "text-white/80 hover:text-white"
    : "text-[var(--dark)] hover:text-[var(--bordeaux)]";

  if (coming) {
    return (
      <div className="relative flex items-center gap-1">
        <span className={`whitespace-nowrap text-[12px] font-bold tracking-[0.15em] uppercase opacity-50 cursor-default ${textClass}`}>
          {item.label}
        </span>
        <span className="rounded-full bg-[var(--bordeaux)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--bordeaux)]">
          Yakında
        </span>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`whitespace-nowrap flex items-center gap-1 text-[12px] font-bold tracking-[0.15em] uppercase transition ${textClass}`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && <DropdownMenu items={item.children} isLight={isLight} />}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      className={`whitespace-nowrap text-[12px] font-bold tracking-[0.15em] uppercase transition ${textClass}`}
    >
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const hasChildren = (item.children || []).length > 0;
  const coming = isComingSoon(item);

  const isActive =
    pathname === item.url ||
    (hasChildren && item.children.some((c) => c.url && c.url !== "#" && pathname.startsWith(c.url)));

  if (coming) {
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="text-2xl font-playfair text-[var(--muted)]">{item.label}</span>
        <span className="rounded-full bg-[var(--bordeaux)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--bordeaux)]">
          Yakında
        </span>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`flex w-full items-center justify-between py-4 text-xl font-playfair focus:outline-none ${
            isActive ? "text-[var(--bordeaux)]" : "text-[var(--dark)]"
          }`}
        >
          {item.label}
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        {expanded && (
          <div className="mb-3 flex flex-col">
            {item.children.map((child, i) => {
              const childComing = child.url === "#" || !child.url;
              return childComing ? (
                <div key={i} className="flex items-center gap-2 border-t border-[var(--beige)] py-3 pl-5">
                  <span className="text-lg text-[var(--muted)]">{child.label}</span>
                  <span className="text-xs text-[var(--bordeaux)]">(Yakında)</span>
                </div>
              ) : (
                <Link
                  key={i}
                  href={child.url}
                  onClick={onClose}
                  className="border-t border-[var(--beige)] py-3 pl-5 text-lg text-[var(--dark)] transition-colors hover:text-[var(--bordeaux)]"
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      onClick={onClose}
      className={`block py-4 text-xl font-playfair ${
        isActive ? "text-[var(--bordeaux)]" : "text-[var(--dark)]"
      }`}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar({ items, company }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isTransparentRoute = transparentRoutes.has(pathname);
  const isLight = isTransparentRoute && !scrolled && !isOpen;

  const primaryItems = items.filter((item) => item.url !== "/blog" && item.url !== "/sss");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-[var(--cream)]/97 shadow-[0_8px_32px_rgba(30,24,16,0.08)] backdrop-blur"
    >
      {/* Accent top bar */}
      <div className="h-[3px] bg-[var(--dark)]" />

      {/* ── Ana satır ── */}
      <div className="container-shell flex h-[84px] items-center justify-between gap-6">
        <Logo
          light={isLight}
          logoUrl={company?.branding?.logoLight}
          logoUrlDark={company?.branding?.logoDark}
        />

        {/* Desktop — primary nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {primaryItems.map((item, i) => (
            <NavItem key={`${item.url}-${i}`} item={item} isLight={isLight} />
          ))}
        </nav>

        <div className="hidden lg:block shrink-0">
          <Link
            href="/restoran/rezervasyon"
            className="inline-flex items-center rounded bg-[var(--bordeaux)] px-5 py-3 text-[11px] font-extrabold tracking-[0.25em] text-white uppercase transition hover:bg-[#6b1215]"
          >
            Rezervasyon Yap
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--beige)] text-[var(--dark)] lg:hidden"
          aria-label="Menüyü aç"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-[var(--beige)] bg-[var(--cream)] lg:hidden">
          <nav className="container-shell flex flex-col py-6">
            {items.filter((item) => !isComingSoon(item)).map((item, i) => (
              <div key={`m-${item.url}-${i}`} className="border-b border-[var(--beige)]">
                <MobileNavItem item={item} onClose={() => setIsOpen(false)} />
              </div>
            ))}
            <div className="pt-8 pb-4">
              <Link
                href="/restoran/rezervasyon"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--bordeaux)] px-6 py-4 text-sm font-bold tracking-[0.2em] text-white uppercase"
              >
                Rezervasyon Yap
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
