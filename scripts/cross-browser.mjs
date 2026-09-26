import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const results = [];
for (const [name, engine, options] of [
  ["Edge", chromium, { channel: "msedge" }],
  ["Firefox", firefox, {}],
  ["WebKit", webkit, {}],
]) {
  let browser;
  try {
    browser = await engine.launch({ headless: true, ...options });
    const page = await browser.newPage({
      viewport: { width: 375, height: 812 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://localhost:3000");
    await page.locator(".hero-config .btn").click();
    await page.locator("header .bag-btn").click();
    if (
      !(await page
        .getByRole("dialog")
        .getByText("Ivory Pearl Wax", { exact: true })
        .isVisible())
    )
      throw Error("Bag missing item");
    await page.keyboard.press("Escape");
    await page.goto("http://localhost:3000/vessels/");
    if ((await page.locator(".product-card").count()) !== 16)
      throw Error("Wrong vessel count");
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error("Horizontal overflow");
    results.push({ name, passed: errors.length === 0, errors });
  } catch (error) {
    results.push({ name, passed: false, error: String(error) });
  } finally {
    await browser?.close();
  }
}
await mkdir("qa", { recursive: true });
await writeFile("qa/cross-browser.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
