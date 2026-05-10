import { profile } from "@/content";
import { buildChangelogEntries, escapeXml, statusLabel } from "@/lib/changelog";

const SITE_URL = "https://hassanansari.dev";

function pubDateFromYyyyMm(yyyy_mm: string): string {
  // Use the 1st of the month at noon UTC for a stable RFC-822 string
  const [yyyy, mm] = yyyy_mm.split("-");
  const date = new Date(Date.UTC(Number(yyyy) || 2025, Math.max(0, Number(mm) - 1), 1, 12));
  return date.toUTCString();
}

export async function GET() {
  const entries = buildChangelogEntries();
  const items = entries
    .map((entry) => {
      const description = [
        entry.body.join(" "),
        entry.added?.length ? `Added: ${entry.added.join("; ")}.` : null,
        entry.removed?.length ? `Removed: ${entry.removed.join("; ")}.` : null,
        entry.stack ? `Stack: ${entry.stack}.` : null,
        `Status: ${statusLabel(entry.status)}.`,
      ]
        .filter(Boolean)
        .join(" ");

      return [
        "    <item>",
        `      <title>${escapeXml(entry.title)}</title>`,
        `      <link>${SITE_URL}/?theme=changelog#${entry.id}</link>`,
        `      <guid isPermaLink="false">${SITE_URL}/changelog/${entry.id}</guid>`,
        `      <pubDate>${pubDateFromYyyyMm(entry.date)}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(profile.name)} — changelog</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(`What's shipped, what's in flight from ${profile.name}.`)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
