import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  (await draftMode()).enable();

  const base = new URL(req.url).origin;
  return NextResponse.redirect(new URL(slug, base));
}
