import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const errors = [];
const origin = process.env.TEST_BASE_URL || "http://localhost:3000";
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(r.status() + " " + r.url());
});
const routes = [
  "/",
  "/fragrances/",
  "/vessels/",
  "/gifting/",
  "/how-to-use/",
  "/ritual/",
  "/contact/",
  "/fragrances/marigold-morning/",
  "/fragrances/first-rain/",
  "/fragrances/cardamom-smoke/",
  "/fragrances/old-delhi-rose/",
  "/fragrances/nagpur-orange/",
  "/fragrances/mysore-dusk/",
];
const links = new Set();
for (const route of routes) {
  await page.goto(origin + route, {
    waitUntil: "networkidle",
  });
  const missing = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
  errors.push(...missing);
  for (const href of await page
    .locator('a[href^="/"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute("href").split("#")[0])))
    if (href) links.add(href);
}
for (const href of links) {
  const response = await page.request.get(origin + href);
  if (response.status() !== 200) errors.push(response.status() + " " + href);
}
await mkdir("qa", { recursive: true });
await writeFile(
  "qa/route-check.json",
  JSON.stringify({ routes: routes.length, links: links.size, errors }, null, 2),
);
console.log(
  JSON.stringify({ routes: routes.length, links: links.size, errors }),
);
await browser.close();
if (errors.length) process.exitCode = 1;
