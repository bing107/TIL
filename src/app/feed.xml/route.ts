import { generateAtomFeed } from "@/lib/feed";

export function GET() {
  const xml = generateAtomFeed();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
