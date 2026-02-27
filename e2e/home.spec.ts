import { test, expect } from "@playwright/test";

test.describe("Home page — post listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/TIL — Hassan Syed/);
  });

  test("header is visible with site title linking to home", async ({
    page,
  }) => {
    const headerLink = page.getByRole("banner").getByRole("link", {
      name: "TIL",
    });
    await expect(headerLink).toBeVisible();
    await expect(headerLink).toHaveAttribute("href", "/");
  });

  test("footer is visible with copyright info", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Hassan Syed");
    await expect(footer).toContainText("Today I Learned");
  });

  test("displays at least one TIL post", async ({ page }) => {
    const articles = page.getByRole("article");
    await expect(articles.first()).toBeVisible();
  });

  test("first-til-post card shows expected metadata", async ({ page }) => {
    const article = page
      .getByRole("article")
      .filter({ hasText: "Hello, TIL" });
    await expect(article).toBeVisible();

    // title link
    const titleLink = article.getByRole("link", { name: "Hello, TIL" });
    await expect(titleLink).toBeVisible();
    await expect(titleLink).toHaveAttribute("href", "/first-til-post");

    // date is present
    await expect(article.getByText(/February 26, 2026/)).toBeVisible();

    // summary is present
    await expect(
      article.getByText(
        /The first post on this TIL blog — what it is and why it exists/,
      ),
    ).toBeVisible();

    // tag "meta" is shown
    await expect(article.getByText("meta")).toBeVisible();
  });

  test("does not show boilerplate content", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).not.toContainText("Create Next App");
    await expect(body).not.toContainText("this is a header");
    await expect(body).not.toContainText("this is a footer");
    await expect(body).not.toContainText("this is the blog page");
  });

  test("clicking post card navigates to post page", async ({ page }) => {
    const titleLink = page
      .getByRole("article")
      .filter({ hasText: "Hello, TIL" })
      .getByRole("link", { name: "Hello, TIL" });
    await titleLink.click();
    await expect(page).toHaveURL(/\/first-til-post/);
  });

  test("responsive — renders correctly on mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const articles = page.getByRole("article");
    await expect(articles.first()).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
  });
});
