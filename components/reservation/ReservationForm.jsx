"use client";

import { useEffect, useState } from "react";
import {
  Users, Clock, ChevronDown, CheckCircle2, AlertCircle,
  Loader2, Layers, Building2, TreePine,
} from "lucide-react";
import DatePicker from "@/components/reservation/DatePicker";

const PARTY_OPTIONS = [
  { label: "1 Kişi",    value: 1 },
  { label: "2 Kişi",    value: 2 },
  { label: "3 Kişi",    value: 3 },
  { label: "4 Kişi",    value: 4 },
  { label: "5-6 Kişi",  value: 6 },
  { label: "7-8 Kişi",  value: 8 },
  { label: "9-10 Kişi", value: 10 },
  { label: "10+ Kişi",  value: 11 },
];

const AREA_ICONS = {
  ust_kat:  Layers,
  orta_kat: Building2,
  bahce:    TreePine,
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getEndTimeOptions(startTime) {
  if (!startTime) return [];
  const [h, m] = startTime.split(":").map(Number);
  const start = h * 60 + m;
  return [30, 60, 90, 120]
    .map((add) => {
      const total = start + add;
      if (total >= 24 * 60) return null;
      return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    })
    .filter(Boolean);
}

function IconSelect({ icon: Icon, label, children, loading, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--dark)]">
        {label}
        {loading && <Loader2 size={11} className="animate-spin" style={{ color: "var(--muted)" }} />}
      </label>
      <div className={`relative transition-opacity ${loading ? "opacity-60" : ""}`}>
        <Icon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <select
          {...props}
          className="w-full appearance-none rounded-xl border border-[var(--beige)] bg-[var(--cream)] pl-9 pr-8 py-3 text-sm text-[var(--dark)] outline-none transition focus:border-[var(--bordeaux)] focus:ring-2 focus:ring-[var(--bordeaux)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        {loading
          ? <Loader2 size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: "var(--muted)" }} />
          : <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        }
      </div>
    </div>
  );
}

function TextInput({ label, error, loading, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--dark)]">
        {label}
        {loading && <Loader2 size={11} className="animate-spin" style={{ color: "var(--muted)" }} />}
      </label>
      <div className={`relative transition-opacity ${loading ? "opacity-60" : ""}`}>
        <input
          {...props}
          className={`w-full rounded-xl border bg-[var(--cream)] px-4 py-3 text-sm text-[var(--dark)] outline-none transition placeholder:text-[var(--muted)] focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
              : "border-[var(--beige)] focus:border-[var(--bordeaux)] focus:ring-[var(--bordeaux)]/10"
          }`}
        />
        {loading && <Loader2 size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: "var(--muted)" }} />}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-red-500">
          <AlertCircle size={11} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Alan (kat) kartı ─────────────────────────────────────────────────────── */
function AreaCard({ area, selected, onSelect, partySize }) {
  const Icon = AREA_ICONS[area.area] || Layers;
  const tooSmall  = partySize > 0 && area.maxCapacity > 0 && area.maxCapacity < partySize;
  const isDisabled = area.isFull || tooSmall;
  const isSelected = selected === area.area;

  let statusText  = "";
  let statusColor = "#16a34a";
  if (area.isFull) {
    statusText  = "Dolu";
    statusColor = "#dc2626";
  } else if (tooSmall) {
    statusText  = `Max ${area.maxCapacity} kişi`;
    statusColor = "#9ca3af";
  } else if (area.available != null) {
    statusText  = `${area.available} masa müsait`;
    statusColor = "#16a34a";
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onSelect(isSelected ? "" : area.area)}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition"
      style={{
        borderColor: isSelected ? "var(--bordeaux)" : "var(--beige)",
        background:  isSelected ? "var(--bordeaux)" : isDisabled ? "#fafaf9" : "var(--cream)",
        opacity:     isDisabled ? 0.5 : 1,
        cursor:      isDisabled ? "default" : "pointer",
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: isSelected ? "rgba(255,255,255,0.18)" : "rgba(130,23,27,0.08)" }}>
        <Icon size={17} style={{ color: isSelected ? "#fff" : "var(--bordeaux)" }} />
      </div>
      <span className="text-sm font-bold leading-tight" style={{ color: isSelected ? "#fff" : "var(--dark)" }}>
        {area.areaLabel}
      </span>
      {statusText && (
        <span className="text-[10px] font-semibold" style={{ color: isSelected ? "rgba(255,255,255,0.75)" : statusColor }}>
          {statusText}
        </span>
      )}
    </button>
  );
}


function isValidPhone(v) {
  const clean = v.replace(/[\s\-().]/g, "");
  return /^(\+?90)?0?5\d{9}$/.test(clean) || /^[+\d][\d\s\-().]{8,18}$/.test(v.trim());
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function ReservationForm() {
  const [form, setForm] = useState({
    partySize: "", date: "", time: "", endTime: "",
    tableArea: "", tableNumber: null,
    fullName: "", phone: "", email: "",
    note: "", kvkkConsent: false,
  });
  const [errors,  setErrors]  = useState({ phone: "", email: "" });
  const [touched, setTouched] = useState({ phone: false, email: false });
  const [availability, setAvailability] = useState({ slots: [], areas: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [result, setResult]             = useState(null);

  function validatePhone(v) {
    if (!v) return "Telefon numarası zorunludur.";
    if (!isValidPhone(v)) return "Geçerli bir telefon numarası girin (ör: 0532 123 45 67).";
    return "";
  }

  function validateEmail(v) {
    if (!v) return "";
    if (!isValidEmail(v)) return "Geçerli bir e-posta adresi girin.";
    return "";
  }

  function handlePhoneChange(e) {
    const v = e.target.value.replace(/[^\d\s+\-().]/g, "");
    set("phone", v);
    if (touched.phone) setErrors((prev) => ({ ...prev, phone: validatePhone(v) }));
  }

  function handlePhoneBlur() {
    setTouched((prev) => ({ ...prev, phone: true }));
    setErrors((prev) => ({ ...prev, phone: validatePhone(form.phone) }));
  }

  function handleEmailChange(e) {
    const v = e.target.value;
    set("email", v);
    if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
  }

  function handleEmailBlur() {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
  }

  useEffect(() => {
    if (!form.date) return;
    let active = true;
    setLoadingSlots(true);
    setAvailability({ slots: [], areas: [] });

    fetch(`/api/availability?date=${form.date}`)
      .then((r) => r.json())
      .then((data) => { if (active) setAvailability({ slots: data.slots || [], areas: data.areas || [] }); })
      .catch(() => { if (active) setAvailability({ slots: [], areas: [] }); })
      .finally(() => { if (active) setLoadingSlots(false); });

    return () => { active = false; };
  }, [form.date]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const phoneErr = validatePhone(form.phone);
    const emailErr = validateEmail(form.email);
    setTouched({ phone: true, email: true });
    setErrors({ phone: phoneErr, email: emailErr });
    if (phoneErr || emailErr) return;

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kvkkConsent: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Rezervasyon oluşturulamadı.");
      setResult({ ok: true });
      setForm({ partySize: "", date: "", time: "", endTime: "", tableArea: "", tableNumber: null, fullName: "", phone: "", email: "", note: "", kvkkConsent: false });
      setErrors({ phone: "", email: "" });
      setTouched({ phone: false, email: false });
      setAvailability({ slots: [], areas: [] });
    } catch (err) {
      setResult({ ok: false, text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  const slotLabel = loadingSlots ? "Saatler yükleniyor..."
    : !form.date ? "Önce tarih seçin"
    : "Saat Seçin";

  const selectedSlot = form.time ? availability.slots.find((s) => s.time === form.time) : null;
  const anySlot      = availability.slots[0];
  const areaSource   = selectedSlot?.areas?.length ? selectedSlot.areas
    : anySlot?.areas?.length ? anySlot.areas
    : availability.areas;
  const showAreaSelector = !!form.time && areaSource.length > 0;

  const partyNum = Number(form.partySize) || 0;

  return (
    <div className="rounded-2xl border border-[var(--beige)] bg-white p-7 shadow-[0_8px_40px_rgba(30,24,16,0.07)] sm:p-9">
      <h2 className="text-2xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
        Masanızı Ayırtın
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Lütfen detayları eksiksiz doldurunuz, ekibimiz en kısa sürede onay için sizinle iletişime geçecektir.
      </p>

      {result?.ok ? (
        <div className="mt-8 rounded-2xl bg-[#edf7f0] border border-[#a7d9b5] px-6 py-8 text-center">
          <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: "#2d8a4e" }} />
          <p className="font-semibold text-[#1e5c33]">Rezervasyon talebiniz alındı!</p>
          <p className="mt-1 text-sm text-[#2d8a4e]">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
          <button onClick={() => setResult(null)} className="mt-6 text-sm font-semibold underline underline-offset-2" style={{ color: "var(--bordeaux)" }}>
            Yeni rezervasyon yap
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`mt-7 space-y-5 transition-opacity ${submitting ? "pointer-events-none opacity-60" : ""}`}>

          {/* ── Satır 1: Kişi / Tarih ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconSelect icon={Users} label="Kişi Sayısı" value={form.partySize}
              onChange={(e) => { set("partySize", Number(e.target.value)); set("tableArea", ""); set("tableNumber", null); }}
              required
            >
              <option value="">Seçiniz</option>
              {PARTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </IconSelect>

            <DatePicker
              value={form.date}
              onChange={(val) => { set("date", val); set("time", ""); set("endTime", ""); set("tableArea", ""); set("tableNumber", null); }}
              min={getToday()}
            />
          </div>

          {/* ── Satır 2: Başlangıç / Bitiş Saati ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconSelect icon={Clock} label="Başlangıç Saati" value={form.time}
              onChange={(e) => {
                const t = e.target.value;
                const opts = getEndTimeOptions(t);
                set("time", t);
                set("endTime", opts[1] || opts[0] || ""); // varsayılan +1 saat
                set("tableArea", "");
                set("tableNumber", null);
              }}
              required disabled={!form.date || loadingSlots}
              loading={loadingSlots}
            >
              <option value="">{slotLabel}</option>
              {availability.slots.map((slot) => {
                const isFull = slot.isFull || slot.available === false;
                return (
                  <option key={slot.time} value={slot.time} disabled={isFull} style={isFull ? { color: "#9ca3af" } : {}}>
                    {slot.time}{isFull ? " — Dolu" : ""}
                  </option>
                );
              })}
            </IconSelect>

            <IconSelect icon={Clock} label="Bitiş Saati (maks. 2 saat)" value={form.endTime}
              onChange={(e) => set("endTime", e.target.value)}
              required disabled={!form.time}
              loading={loadingSlots && !form.time}
            >
              <option value="">{form.time ? "Seçiniz" : "Önce başlangıç saati seçin"}</option>
              {getEndTimeOptions(form.time).map((t) => {
                const [sh, sm] = form.time.split(":").map(Number);
                const [eh, em] = t.split(":").map(Number);
                const diff = (eh * 60 + em) - (sh * 60 + sm);
                const label = diff === 60 ? "1 saat" : diff === 120 ? "2 saat" : `${diff} dk`;
                return (
                  <option key={t} value={t}>{t} ({label})</option>
                );
              })}
            </IconSelect>
          </div>

          {/* ── Kat Seçimi ── */}
          {showAreaSelector && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-[var(--dark)]">
                Oturma Katı
                <span className="ml-1 font-normal text-[var(--muted)]">(İsteğe Bağlı)</span>
              </label>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(areaSource.length, 3)}, 1fr)` }}>
                {areaSource.map((area) => (
                  <AreaCard
                    key={area.area}
                    area={area}
                    selected={form.tableArea}
                    onSelect={(v) => { set("tableArea", v); set("tableNumber", null); }}
                    partySize={partyNum}
                  />
                ))}
              </div>
            </div>
          )}


          {/* ── Ad – Telefon – E-posta ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Ad Soyad" type="text" placeholder="Örn: Ahmet Yılmaz"
              value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
              loading={submitting} required />
            <TextInput
              label="Telefon Numarası"
              type="tel"
              placeholder="0 (5XX) XXX XX XX"
              value={form.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              error={touched.phone ? errors.phone : ""}
              loading={submitting}
              required
              maxLength={20}
            />
          </div>
          <TextInput
            label={<>E-posta Adresi <span className="font-normal text-[var(--muted)]">(İsteğe Bağlı)</span></>}
            type="email"
            placeholder="ornek@mail.com"
            value={form.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={touched.email ? errors.email : ""}
            loading={submitting}
            inputMode="email"
            autoComplete="email"
          />

          {/* ── Özel Not ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--dark)]">
              Özel Notunuz <span className="font-normal text-[var(--muted)]">(İsteğe Bağlı)</span>
            </label>
            <textarea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              rows={3}
              placeholder="Alerji durumu, özel kutlama veya masa tercihi gibi detayları belirtebilirsiniz."
              className="w-full resize-none rounded-xl border border-[var(--beige)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--dark)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--bordeaux)] focus:ring-2 focus:ring-[var(--bordeaux)]/10"
            />
          </div>

          {/* ── KVKK ── */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.kvkkConsent}
              onChange={(e) => set("kvkkConsent", e.target.checked)}
              required className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--beige)] accent-[var(--bordeaux)]" />
            <span className="text-xs leading-relaxed text-[var(--muted)]">
              Kişisel verilerimin işlenmesine ilişkin{" "}
              <span className="font-semibold text-[var(--dark)] underline underline-offset-2">KVKK Aydınlatma Metni</span>
              &apos;ni okudum ve onaylıyorum.
            </span>
          </label>

          {/* ── Hata ── */}
          {result?.ok === false && (
            <div className="flex items-start gap-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{result.text}</p>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--bordeaux)" }}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Gönderiliyor..." : "Rezervasyonu Tamamla"}
          </button>

          <p className="text-center text-xs text-[var(--muted)]">
            Rezervasyonunuz restoran onayından sonra kesinleşecektir.
          </p>
        </form>
      )}
    </div>
  );
}
