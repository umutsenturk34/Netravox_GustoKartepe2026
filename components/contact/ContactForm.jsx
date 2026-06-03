"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--dark)]">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[var(--beige)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--dark)] outline-none placeholder:text-[var(--muted)]/60 transition focus:border-[var(--bordeaux)] focus:ring-2 focus:ring-[var(--bordeaux)]/10";

export default function ContactForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "", kvkkConsent: false });
  const [state, setState] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setState(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          email: form.email,
          message: form.message,
          kvkkConsent: form.kvkkConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mesaj gönderilemedi.");
      setState("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "", kvkkConsent: false });
    } catch (err) {
      setState("error");
      setErrorText(err.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--beige)] bg-white p-8 shadow-[0_8px_40px_rgba(30,24,16,0.07)] md:p-10">
      <h2 className="text-2xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
        Bize Mesaj Gönderin
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        İsim ve iletişim bilgilerini doldurarak bize mesaj gönderebilirsiniz. Ekibimiz en kısa sürede size dönüş yapacaktır.
      </p>

      {state === "success" ? (
        <div className="mt-8 rounded-2xl border border-[#a7d9b5] bg-[#edf7f0] px-6 py-8 text-center">
          <CheckCircle2 size={36} className="mx-auto mb-3" style={{ color: "#2d8a4e" }} />
          <p className="font-semibold text-[#1e5c33]">Mesajınız iletildi!</p>
          <p className="mt-1 text-sm text-[#2d8a4e]">En kısa sürede sizinle iletişime geçeceğiz.</p>
          <button
            onClick={() => setState(null)}
            className="mt-5 text-sm font-semibold underline underline-offset-2"
            style={{ color: "var(--bordeaux)" }}
          >
            Yeni mesaj gönder
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {/* Ad + Soyad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ad">
              <input
                type="text"
                className={inputCls}
                placeholder="Adınız"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </Field>
            <Field label="Soyad">
              <input
                type="text"
                className={inputCls}
                placeholder="Soyadınız"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </Field>
          </div>

          {/* E-posta + Telefon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="E-posta">
              <input
                type="email"
                className={inputCls}
                placeholder="ornek@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </Field>
            <Field label="Telefon">
              <input
                type="tel"
                className={inputCls}
                placeholder="0 (5XX) XXX XX XX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </div>

          {/* Mesaj */}
          <Field label="Mesajınız">
            <textarea
              rows={5}
              className={inputCls + " resize-none"}
              placeholder="Rezervasyon, etkinlik veya diğer sorularınızı buraya yazabilirsiniz..."
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              required
            />
          </Field>

          {/* KVKK */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.kvkkConsent}
              onChange={(e) => set("kvkkConsent", e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--beige)] accent-[var(--bordeaux)]"
            />
            <span className="text-xs leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-[var(--dark)] underline underline-offset-2 cursor-pointer">
                KVKK Aydınlatma Metni
              </span>
              &apos;ni okudum ve kişisel verilerimin işlenmesine onay veriyorum.
            </span>
          </label>

          {state === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              {errorText}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold tracking-[0.12em] uppercase text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--bordeaux)" }}
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Gönderiliyor...</>
            ) : (
              <><Send size={14} /> Mesaj Gönder</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
