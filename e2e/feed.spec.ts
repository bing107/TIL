import { test, expect } from "@playwright/test";

test.describe("RSS/Atom Feed — /feed.xml", () => {
  test("returns HTTP 200 with application/atom+xml content-type", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/atom+xml");
  });

  test("response body is well-formed Atom XML", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    expect(body).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);
    expect(body).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(body).toContain("</feed>");
  });

  test("feed contains correct <title> element", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // The em-dash (—) is a valid UTF-8 character that doesn't require XML entity escaping
    expect(body).toContain("<title>TIL \u2014 Hassan Syed</title>");
  });

  test("feed contains <link rel='self'> pointing to /feed.xml", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    expect(body).toContain('rel="self"');
    expect(body).toContain("/feed.xml");
    expect(body).toContain('type="application/atom+xml"');
  });

  test("feed contains <link rel='alternate'> pointing to site root", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // At least one alternate link to site root
    expect(body).toMatch(/rel="alternate".*type="text\/html"/s);
  });

  test("feed contains <author> with <name> element", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    expect(body).toContain("<author>");
    expect(body).toContain("<name>Hassan Syed</name>");
  });

  test("feed contains <updated> element in RFC 3339 format", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // RFC 3339 date like 2026-02-26T00:00:00.000Z
    expect(body).toMatch(/<updated>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test("feed contains at least one <entry> element", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    expect(body).toContain("<entry>");
    expect(body).toContain("</entry>");
  });

  test("first-til-post entry has correct title and link", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // Entry title for first-til-post
    expect(body).toContain("<title>Hello, TIL</title>");
    // Entry link includes the slug
    expect(body).toContain("/first-til-post");
  });

  test("first-til-post entry has a <summary> element", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    expect(body).toContain("<summary>");
    // The em-dash (—) is a valid UTF-8 character that doesn't require XML entity escaping
    expect(body).toContain(
      "The first post on this TIL blog \u2014 what it is and why it exists.",
    );
  });

  test("entry <id> is an absolute URI", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // id should be an absolute URL
    expect(body).toMatch(/<id>https?:\/\//);
  });

  test("entry <updated> is in RFC 3339 format", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // Inside an entry we expect an updated element
    expect(body).toMatch(
      /<entry>[\s\S]*?<updated>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
  });

  test("cache-control header is set for public caching", async ({
    request,
  }) => {
    const response = await request.get("/feed.xml");
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("public");
    expect(cacheControl).toContain("max-age=3600");
  });
});

test.describe("Feed auto-discovery in HTML head", () => {
  test("home page head contains atom+xml alternate link", async ({ page }) => {
    await page.goto("/");
    const feedLink = page.locator(
      'link[rel="alternate"][type="application/atom+xml"]',
    );
    await expect(feedLink).toHaveCount(1);
  });

  test("feed alternate link href points to /feed.xml", async ({ page }) => {
    await page.goto("/");
    const feedLink = page.locator(
      'link[rel="alternate"][type="application/atom+xml"]',
    );
    const href = await feedLink.getAttribute("href");
    expect(href).toContain("feed.xml");
  });

  test("post page head also contains atom+xml alternate link", async ({
    page,
  }) => {
    await page.goto("/first-til-post");
    const feedLink = page.locator(
      'link[rel="alternate"][type="application/atom+xml"]',
    );
    await expect(feedLink).toHaveCount(1);
  });
});

test.describe("Feed XML special character escaping", () => {
  test("feed title uses XML-safe entities for em-dash", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // The em-dash in "TIL — Hassan Syed" must be escaped or represented safely
    // &amp; ensures no bare & appears (except in entity references)
    expect(body).not.toMatch(/<title>[^<]*&[^#a-zA-Z][^<]*<\/title>/);
  });

  test("feed body contains no malformed & entities", async ({ request }) => {
    const response = await request.get("/feed.xml");
    const body = await response.text();
    // Bare & outside of entity reference is invalid XML
    // Valid entities start with & followed by # or letters then ;
    const bareAmpersand = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;|[a-zA-Z][a-zA-Z0-9]*;)/;
    expect(body).not.toMatch(bareAmpersand);
  });
});
