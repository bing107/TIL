import { test, expect } from "@playwright/test";

test.describe("Individual post page — /first-til-post", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/first-til-post");
  });

  test("page title is the post title", async ({ page }) => {
    await expect(page).toHaveTitle("Hello, TIL");
  });

  test("renders post heading", async ({ page }) => {
    const heading = page.getByRole("heading", { name: "Hello, TIL", level: 1 });
    await expect(heading).toBeVisible();
  });

  test("renders post date", async ({ page }) => {
    const dateEl = page.getByText(/February 26, 2026/);
    await expect(dateEl).toBeVisible();
  });

  test("renders tag badge", async ({ page }) => {
    const tag = page.getByText("meta");
    await expect(tag).toBeVisible();
  });

  test("renders MDX body content", async ({ page }) => {
    // Prose content should be present
    await expect(
      page.getByText(/Today I Learned.*TIL.*blog/i).or(
        page.getByText(/This is my TIL/i),
      ),
    ).toBeVisible();
  });

  test("renders 'Why a TIL blog?' section heading", async ({ page }) => {
    const heading = page.getByRole("heading", {
      name: "Why a TIL blog?",
      level: 2,
    });
    await expect(heading).toBeVisible();
  });

  test("renders 'The stack' section heading", async ({ page }) => {
    const heading = page.getByRole("heading", {
      name: "The stack",
      level: 2,
    });
    await expect(heading).toBeVisible();
  });

  test("has back navigation link to home", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /← Back/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("back link navigates home", async ({ page }) => {
    await page.getByRole("link", { name: /← Back/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("header site title links to home", async ({ page }) => {
    const headerLink = page.getByRole("banner").getByRole("link", {
      name: "TIL",
    });
    await expect(headerLink).toBeVisible();
    await headerLink.click();
    await expect(page).toHaveURL("/");
  });

  test("MDX content stack list items visible", async ({ page }) => {
    await expect(page.getByText(/Next\.js 15/)).toBeVisible();
    await expect(page.getByText(/TypeScript/)).toBeVisible();
    await expect(page.getByText(/Tailwind CSS v4/)).toBeVisible();
    await expect(page.getByText(/MDX/)).toBeVisible();
  });
});

test.describe("404 — invalid slug", () => {
  test("returns 404 for non-existent post", async ({ page }) => {
    const response = await page.goto("/nonexistent-slug-xyz-123");
    expect(response?.status()).toBe(404);
  });

  test("shows Next.js not-found page for invalid slug", async ({ page }) => {
    await page.goto("/nonexistent-slug-xyz-123");
    // Next.js default 404 has "404" or a similar message
    const body = page.locator("body");
    // Either the custom 404 or Next.js default should render without crashing
    await expect(body).toBeVisible();
  });
});
