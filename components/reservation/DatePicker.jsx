"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
const MONTH_LABELS = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDisplay(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${MONTH_LABELS[parseInt(m) - 1]} ${y}`;
}

export default function DatePicker({ value, onChange, min }) {
  const todayStr = getToday();
  const minStr = min || todayStr;

  const now = new Date();
  const [open, setOpen] = useState(false);
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [avail, setAvail] = useState({});
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  /* Fetch month availability when calendar opens or month changes */
  useEffect(() => {
    if (!open) return;
    const monthStr = `${vy}-${String(vm + 1).padStart(2, "0")}`;
    setLoading(true);
    setAvail({});
    fetch(`/api/availability-month?month=${monthStr}`)
      .then((r) => r.json())
      .then((d) => setAvail(d || {}))
      .catch(() => setAvail({}))
      .finally(() => setLoading(false));
  }, [open, vy, vm]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  function prevMonth() {
    if (vm === 0) { setVm(11); setVy((y) => y - 1); }
    else setVm((m) => m - 1);
  }
  function nextMonth() {
    if (vm === 11) { setVm(0); setVy((y) => y + 1); }
    else setVm((m) => m + 1);
  }

  function pickDate(dateStr) {
    const info = avail[dateStr];
    if (dateStr < minStr) return;
    if (info?.full) return;
    onChange(dateStr);
    setOpen(false);
  }

  const totalDays = daysInMonth(vy, vm);
  const startOffset = firstWeekday(vy, vm);
  const cells = Array(startOffset).fill(null).concat(
    Array.from({ length: totalDays }, (_, i) => i + 1)
  );
  // pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-[var(--dark)] mb-1.5">Tarih</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 rounded-xl border bg-[var(--cream)] px-3.5 py-3 text-sm text-left outline-none transition"
        style={{
          borderColor: open ? "var(--bordeaux)" : "var(--beige)",
          boxShadow: open ? "0 0 0 2px rgba(130,23,27,0.1)" : "none",
        }}
      >
        <Calendar size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
        <span style={{ color: value ? "var(--dark)" : "var(--muted)" }}>
          {value ? formatDisplay(value) : "Tarih seçin"}
        </span>
      </button>

      {/* Calendar popup */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 rounded-2xl border border-[var(--beige)] bg-white overflow-hidden"
          style={{
            width: "min(320px, calc(100vw - 2rem))",
            boxShadow: "0 20px 60px rgba(30,24,16,0.16)",
          }}
        >
          {/* Month header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--beige)" }}
          >
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg transition hover:bg-[var(--beige)]"
            >
              <ChevronLeft size={16} style={{ color: "var(--dark)" }} />
            </button>
            <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>
              {MONTH_LABELS[vm]} {vy}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg transition hover:bg-[var(--beige)]"
            >
              <ChevronRight size={16} style={{ color: "var(--dark)" }} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold uppercase tracking-widest pb-1.5"
                style={{ color: "var(--muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 px-3 pb-1 gap-y-px">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;

              const dateStr = `${vy}-${String(vm + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast = dateStr < minStr;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === value;
              const info = avail[dateStr];
              const isFull = info?.full === true;
              const hasInfo = !!info;
              const slots = info?.availableSlots ?? 0;

              let statusEl = null;
              if (!isPast) {
                if (loading && !hasInfo) {
                  statusEl = <span style={{ color: "var(--beige)" }}>···</span>;
                } else if (isFull) {
                  statusEl = <span style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "#dc2626" }}>Dolu</span>;
                } else if (hasInfo && info.totalSlots > 0) {
                  statusEl = <span style={{ color: isSelected ? "rgba(255,255,255,0.8)" : "#16a34a" }}>{slots} slot</span>;
                }
              }

              const isDisabled = isPast || isFull;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => pickDate(dateStr)}
                  className="flex flex-col items-center py-1 rounded-xl transition group"
                  style={{
                    background: isSelected ? "var(--bordeaux)" : "transparent",
                    cursor: isDisabled ? "default" : "pointer",
                    opacity: isPast ? 0.35 : 1,
                  }}
                >
                  {/* Day number */}
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition"
                    style={{
                      color: isSelected
                        ? "#fff"
                        : isToday
                        ? "var(--bordeaux)"
                        : isFull
                        ? "var(--muted)"
                        : "var(--dark)",
                      outline: isToday && !isSelected ? "2px solid var(--bordeaux)" : "none",
                      outlineOffset: "-2px",
                      background:
                        !isSelected && !isPast && !isFull
                          ? undefined
                          : undefined,
                    }}
                  >
                    {day}
                  </span>

                  {/* Availability badge */}
                  <span className="text-[9px] leading-none mt-0.5 min-h-[12px] font-medium">
                    {statusEl}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid var(--beige)" }}
          >
            <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--muted)" }}>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                Müsait
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                Dolu
              </span>
            </div>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(""); }}
                className="text-[10px] font-semibold underline underline-offset-2 transition hover:opacity-70"
                style={{ color: "var(--bordeaux)" }}
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
