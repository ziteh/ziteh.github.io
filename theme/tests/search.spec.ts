import { expect, test } from "@playwright/test";

test.describe("Pagefind search", () => {
  test("search skeleton is replaced by the searchbox", async ({ page }) => {
    await page.goto("/search");

    await expect(page.locator("#search")).toBeVisible();
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();
    await expect(page.locator("#search-skeleton")).toBeHidden();
  });

  test("searchbox is horizontally centered and matches the skeleton's size", async ({ page }) => {
    await page.goto("/search");

    const skeleton = await page.locator(".skeleton-input").boundingBox();
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();
    const stack = await page.locator("#search-stack").boundingBox();
    const box = await page.locator(".pf-searchbox").boundingBox();

    if (!skeleton || !stack || !box) throw new Error("expected elements to have a layout box");

    // centered: equal left/right whitespace within the stack
    const leftGap = box.x - stack.x;
    const rightGap = stack.x + stack.width - (box.x + box.width);
    expect(leftGap).toBeCloseTo(rightGap, 0);

    // matches the skeleton so there's no layout shift when it's replaced
    expect(box.width).toBeCloseTo(skeleton.width, 0);
    expect(box.y).toBeCloseTo(skeleton.y, 0);
  });

  test("typing a query returns a matching result", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");

    const results = page.locator(".pf-searchbox-result");
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toHaveAttribute("href", /\/posts\/markdown-style-guide/);
  });

  test("clicking a result navigates to the matching page", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");
    await page.locator(".pf-searchbox-result").first().click();

    await page.waitForURL("**/posts/markdown-style-guide**");
  });
});
