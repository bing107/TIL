import { getAllPosts } from "./content";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  AUTHOR_NAME,
} from "./constants";

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toRfc3339(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export function generateAtomFeed(): string {
  const posts = getAllPosts().filter((post) => isValidDate(post.date));
  const updated =
    posts.length > 0 ? toRfc3339(posts[0].date) : new Date().toISOString();

  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/${post.slug}" rel="alternate" />
    <id>${SITE_URL}/${post.slug}</id>
    <updated>${toRfc3339(post.date)}</updated>
    <summary>${escapeXml(post.summary)}</summary>
  </entry>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${SITE_URL}" rel="alternate" type="text/html" />
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(AUTHOR_NAME)}</name>
  </author>
${entries}
</feed>
`;
}
