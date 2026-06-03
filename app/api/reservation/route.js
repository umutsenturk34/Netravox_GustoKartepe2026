import { postReservation } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await postReservation(body);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rezervasyon olusturulamadi.";
    const status = message.includes("dolu") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
