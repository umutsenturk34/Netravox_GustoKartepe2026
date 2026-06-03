import { getAvailability } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Tarih zorunludur." }, { status: 400 });
  }

  const availability = await getAvailability(date);

  if (!availability) {
    return NextResponse.json({ error: "Musaitlik bilgisi alinamadi." }, { status: 503 });
  }

  return NextResponse.json(availability);
}
