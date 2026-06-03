import { getAvailability } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req) {
  const month = req.nextUrl.searchParams.get("month"); // "2026-06"
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Geçersiz ay" }, { status: 400 });
  }

  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const dates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
    if (dateStr >= today) dates.push(dateStr);
  }

  const results = await Promise.all(
    dates.map(async (date) => {
      const data = await getAvailability(date);
      const slots = data?.slots || [];
      const totalSlots = slots.length;
      const availableSlots = slots.filter((s) => !s.isFull && s.available !== false).length;
      return { date, totalSlots, availableSlots, full: totalSlots > 0 && availableSlots === 0 };
    })
  );

  const map = {};
  for (const r of results) {
    map[r.date] = { totalSlots: r.totalSlots, availableSlots: r.availableSlots, full: r.full };
  }

  return NextResponse.json(map);
}
