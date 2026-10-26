import { NextResponse } from "next/server";
import { getCompany } from "@/lib/api";

// Tarayıcılar ve botlar /favicon.ico'yu doğrudan ister; panelde seçilen favicon'a yönlendir.
export async function GET(request) {
  const company = await getCompany();
  const icon = company?.branding?.favicon || company?.branding?.logoLight;
  if (!icon) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(icon, 307);
}
