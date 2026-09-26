import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { writeFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--remote-debugging-port=9223"],
});
try {
  await mkdir("qa", { recursive: true });
  for (const mode of ["mobile", "desktop"]) {
    const result = await lighthouse("http://localhost:3000", {
      port: 9223,
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(mode === "desktop"
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
            },
          }
        : {}),
    });
    await writeFile("qa/lighthouse-" + mode + ".json", result.report);
    console.log(
      mode,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
      ),
    );
  }
} finally {
  await browser.close();
}
