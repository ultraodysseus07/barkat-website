import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("requestfailed", (r) => {
  if (r.failure()?.errorText !== "net::ERR_ABORTED")
    errors.push(r.url() + " " + r.failure()?.errorText);
});
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(r.status() + " " + r.url());
});
await mkdir("qa", { recursive: true });
for (const [name, route, width] of [
  ["home-desktop", "/", 1440],
  ["home-mobile", "/", 375],
  ["vessels-desktop", "/vessels/", 1440],
  ["gifting-mobile", "/gifting/", 375],
]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://localhost:3000" + route, {
    waitUntil: "networkidle",
  });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.documentElement.scrollHeight));
    y += 700
  ) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "qa/" + name + ".png", fullPage: true });
}
await writeFile("qa/browser-errors.json", JSON.stringify(errors, null, 2));
console.log(JSON.stringify({ errors }));
await browser.close();
