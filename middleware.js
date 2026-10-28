import { NextResponse } from "next/server";

// Panelden (Yönlendirmeler) tanımlanan 301/302 kuralları. Kurallar 5 dakika bellekte tutulur.
const TTL = 5 * 60 * 1000;
let cache = { at: 0, rules: [] };

async function loadRules() {
  const base = process.env.BACKEND_URL;
  const slug = process.env.TENANT_SLUG;
  if (!base || !slug) return [];
  if (Date.now() - cache.at < TTL) return cache.rules;
  try {
    const res = await fetch(`${base}/api/public/${slug}/redirects`, { cache: "no-store" });
    if (res.ok) {
      const rules = await res.json();
      cache = { at: Date.now(), rules: Array.isArray(rules) ? rules : [] };
    } else cache.at = Date.now();
  } catch {
    cache.at = Date.now();
  }
  return cache.rules;
}

const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p).toLowerCase();

export async function middleware(req) {
  const rules = await loadRules();
  if (!rules.length) return NextResponse.next();
  const here = norm(req.nextUrl.pathname);
  const rule = rules.find((r) => r?.from && norm(String(r.from)) === here);
  if (!rule?.to || norm(String(rule.to)) === here) return NextResponse.next();
  const target = /^https?:\/\//i.test(rule.to) ? rule.to : new URL(rule.to, req.url).toString();
  return NextResponse.redirect(target, rule.type === 302 ? 302 : 301);
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
