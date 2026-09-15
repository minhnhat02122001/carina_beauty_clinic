import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { getServiceOptions } from "@/sanity/lib/service";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const options = await getServiceOptions(locale);
  return NextResponse.json(options, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}
