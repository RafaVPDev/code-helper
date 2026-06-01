import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { locale } = await req.json();
  const validLocales = ["pt-BR", "en"];
  if (!validLocales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}