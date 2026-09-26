import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("hero bundle matrix, persistence and cross-tab sync", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.locator(".hero-config .btn").waitFor({ state: "visible" });
  for (const [choice, expected] of [
    ["Wax only", { "wax-ivory": 1 }],
    ["Vessel only", { "vase-4": 1 }],
    ["Both", { "wax-ivory": 1, "vase-4": 1 }],
  ] as const) {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator("header .bag-btn")).toBeEnabled();
    await page
      .locator(".hero-config")
      .getByRole("button", { name: new RegExp(choice) })
      .click();
    await page
      .locator(".hero-config")
      .getByRole("button", { name: /Add to cart/ })
      .click();
    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(localStorage.getItem("barkat-bag-v2") || "{}"),
        ),
      )
      .toEqual(expected);
  }
  await page.reload();
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  await expect(page.locator("header .bag-btn")).toContainText("2");
  const tab = await context.newPage();
  await tab.goto("/");
  await tab.locator("header .bag-btn").click();
  await tab.getByRole("button", { name: "Add one Ivory Pearl Wax" }).click();
  await expect(page.locator("header .bag-btn")).toContainText("3");
  await tab.close();
  await page.locator("header .bag-btn").click();
  await expect(page.getByRole("dialog", { name: "Your bag" })).toContainText(
    "₹1,797",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("header .bag-btn")).toBeFocused();
});
test("catalog filters, finder and detail gallery", async ({ page }) => {
  await page.goto("/fragrances/");
  await page.getByRole("button", { name: "Woody", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await expect(page).toHaveURL(/family=Woody/);
  await page.getByRole("searchbox").fill("no such fragrance");
  await expect(
    page.getByRole("heading", { name: "No matches yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Find my fragrance" }).click();
  await page.getByRole("button", { name: /Slow mornings/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /Warm/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Marigold Morning");
  await page.getByRole("link", { name: /Explore fragrance/ }).click();
  await expect(page).toHaveURL(/marigold-morning/);
  await page.getByRole("button", { name: "The texture", exact: true }).click();
  await expect(page.locator(".detail-photo img")).toHaveAttribute(
    "src",
    /real-wax/,
  );
});
test("pour and ritual controls complete without continuous animation", async ({
  page,
}) => {
  await page.goto("/how-to-use/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  const demo = page.locator(".pour-demo");
  await expect(demo.getByRole("button")).toHaveCount(2);
  await expect(
    demo.getByRole("button", { name: "← Back", exact: true }),
  ).toBeDisabled();
  for (const name of ["Pour", "Place", "Light"]) {
    await demo.getByRole("button", { name: "Next →", exact: true }).click();
    await expect(demo.locator('[aria-current="step"]')).toContainText(name);
  }
  await expect(demo.locator(".flame")).toBeVisible();
  await expect(
    demo.getByRole("button", { name: "Next →", exact: true }),
  ).toBeDisabled();
  for (const name of ["Place", "Pour", "Choose"]) {
    await demo.getByRole("button", { name: "← Back", exact: true }).click();
    await expect(demo.locator('[aria-current="step"]')).toContainText(name);
  }
  await expect(demo.locator(".pearls")).toHaveCount(0);
  await page.goto("/ritual/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  await page.getByRole("button", { name: /Step 5/ }).click();
  await expect(page.locator(".ritual-copy")).toContainText("Keep the ritual.");
});
test("sample contact submission is not sent", async ({ page }) => {
  await page.goto("/contact/");
  await page.getByLabel("Your name").fill("Test Customer");
  await page.getByLabel("Email or phone").fill("user@example.com");
  await page.getByLabel("Your idea").fill("A small custom hamper");
  await page.getByRole("button", { name: /Prepare my request/ }).click();
  await expect(page.locator("form [role=alert]")).toContainText(
    "has not been sent",
  );
});
for (const width of [320, 375, 768, 1024, 1440])
  test("home fits " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
for (const route of [
  "/",
  "/vessels/",
  "/gifting/",
  "/fragrances/",
  "/how-to-use/",
  "/contact/",
])
  test("accessibility " + route, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
test("server rendering and blocked storage", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".product-card")).not.toHaveCount(0);
  await context.close();
  const c = await browser.newContext();
  await c.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("Storage blocked");
      },
    });
  });
  const p = await c.newPage();
  await p.goto("http://localhost:3000/");
  await p.locator(".hero-config .btn").click();
  await p.locator("header .bag-btn").click();
  await expect(p.getByRole("dialog", { name: "Your bag" })).toContainText(
    "Ivory Pearl Wax",
  );
  await c.close();
});
