import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { secret, tags } = await req.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tagsToRevalidate =
      tags || [
        "company", "navigation", "menu", "gallery", "testimonials", "team", "faqs", "blog", "redirects",
        "page-home", "page-about", "page-contact", "page-generic", "page-reservation", "page-menu", "page-gallery",
        "featured",
      ];

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ revalidated: true, tags: tagsToRevalidate });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
