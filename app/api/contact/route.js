import { postContact } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await postContact(body);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mesaj gonderilemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
