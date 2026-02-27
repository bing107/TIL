import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility — WCAG 2.1 AA", () => {
  test("home page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Log violations for the report
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        "Accessibility violations on /:",
        JSON.stringify(
          accessibilityScanResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => n.html),
          })),
          null,
          2,
        ),
      );
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("post page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/first-til-post");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        "Accessibility violations on /first-til-post:",
        JSON.stringify(
          accessibilityScanResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => n.html),
          })),
          null,
          2,
        ),
      );
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("home page — keyboard navigation reaches post links", async ({
    page,
  }) => {
    await page.goto("/");

    // Start from top, tab through page
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // At least one link should have focus at some point
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("home page — all images have alt text", async ({ page }) => {
    await page.goto("/");
    const imagesWithoutAlt = await page.locator("img:not([alt])").count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test("home page — page has exactly one main landmark", async ({ page }) => {
    await page.goto("/");
    const mainLandmarks = await page.getByRole("main").count();
    expect(mainLandmarks).toBe(1);
  });

  test("post page — page has exactly one main landmark", async ({ page }) => {
    await page.goto("/first-til-post");
    const mainLandmarks = await page.getByRole("main").count();
    expect(mainLandmarks).toBe(1);
  });

  test("home page — page has a header landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
  });

  test("home page — page has a footer landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("post page — time element has dateTime attribute", async ({ page }) => {
    await page.goto("/first-til-post");
    const timeEl = page.locator("time").first();
    await expect(timeEl).toHaveAttribute("dateTime", "2026-02-26");
  });

  test("home page — post article time has dateTime attribute", async ({
    page,
  }) => {
    await page.goto("/");
    const timeEl = page
      .getByRole("article")
      .filter({ hasText: "Hello, TIL" })
      .locator("time");
    await expect(timeEl).toHaveAttribute("dateTime", "2026-02-26");
  });

  test("tag archive page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/tags/meta");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        "Accessibility violations on /tags/meta:",
        JSON.stringify(
          accessibilityScanResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => n.html),
          })),
          null,
          2,
        ),
      );
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("tag pills are keyboard-focusable and activatable", async ({
    page,
  }) => {
    await page.goto("/");

    const tagPillLink = page.locator('a[href="/tags/meta"]').first();
    await expect(tagPillLink).toBeVisible();

    await tagPillLink.focus();
    await expect(tagPillLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/tags\/meta/);
  });
});
