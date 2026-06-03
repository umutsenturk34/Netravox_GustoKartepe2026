import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  (await draftMode()).disable();
  const base = new URL(req.url).origin;
  return NextResponse.redirect(new URL("/", base));
}
