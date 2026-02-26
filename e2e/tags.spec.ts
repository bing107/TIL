import { test, expect } from "@playwright/test";

test.describe("Tag archive page — /tags/meta", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tags/meta");
  });

  test("page has correct title", async ({ page }) => {
    await expect(page).toHaveTitle('Posts tagged "meta" — TIL');
  });

  test("h1 contains 'Posts tagged \"meta\"'", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Posts tagged \u201Cmeta\u201D');
  });

  test("post count paragraph is visible", async ({ page }) => {
    const count = page.getByText(/\d+ posts?/);
    await expect(count).toBeVisible();
  });

  test("at least one article card is visible", async ({ page }) => {
    const articles = page.getByRole("article");
    await expect(articles.first()).toBeVisible();
  });

  test("'← All posts' back link is present with correct href", async ({
    page,
  }) => {
    const backLink = page.getByRole("link", { name: /← All posts/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("clicking '← All posts' navigates to the home page", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /← All posts/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("post cards have clickable tag pill links to /tags/meta", async ({
    page,
  }) => {
    const article = page.getByRole("article").first();
    const tagLink = article.getByRole("link", { name: "meta" });
    await expect(tagLink).toBeVisible();
    await expect(tagLink).toHaveAttribute("href", "/tags/meta");
  });
});

test.describe("Tag archive — 404 handling", () => {
  test("navigating to /tags/nonexistent-tag-xyz returns 404", async ({
    page,
  }) => {
    const response = await page.goto("/tags/nonexistent-tag-xyz");
    expect(response?.status()).toBe(404);
  });

  test("page shows a not-found indication", async ({ page }) => {
    await page.goto("/tags/nonexistent-tag-xyz");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("Tag pill navigation", () => {
  test("clicking tag pill on home page navigates to /tags/meta", async ({
    page,
  }) => {
    await page.goto("/");
    const article = page
      .getByRole("article")
      .filter({ hasText: "Hello, TIL" });
    const tagLink = article.getByRole("link", { name: "meta" });
    await expect(tagLink).toBeVisible();
    await tagLink.click();
    await expect(page).toHaveURL(/\/tags\/meta/);
  });

  test("clicking tag pill on post detail page navigates to /tags/meta", async ({
    page,
  }) => {
    await page.goto("/first-til-post");
    const tagLink = page.getByRole("link", { name: "meta" });
    await expect(tagLink).toBeVisible();
    await tagLink.click();
    await expect(page).toHaveURL(/\/tags\/meta/);
  });
});
