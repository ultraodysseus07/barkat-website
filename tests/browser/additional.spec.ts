import { test, expect } from "@playwright/test";
test("product arrows are centered, round and turn Barkat green",async({page})=>{
  for(const width of [320,1440]){
    await page.setViewportSize({width,height:1000});
    await page.goto("/");
    await expect(page.locator("header .bag-btn")).toBeEnabled();
    const next=page.getByRole("button",{name:"Next products"});
    await next.scrollIntoViewIfNeeded();
    const arrow=await next.boundingBox(),row=await page.locator(".slider-shell").boundingBox();
    expect(arrow!.width).toBeGreaterThanOrEqual(48);
    expect(arrow!.width).toBe(arrow!.height);
    expect(Math.abs(arrow!.y+arrow!.height/2-(row!.y+row!.height/2-11))).toBeLessThan(2);
    expect(arrow!.x+arrow!.width).toBeLessThanOrEqual(width);
    await next.hover();
    await expect(next).toHaveCSS("background-color","rgb(163, 191, 24)");
    await expect(page.locator(".section-heading .slider-arrow")).toHaveCount(0);
  }
  await page.getByRole("button",{name:"Pearl wax shades",exact:true}).click();
  await expect(page.getByRole("button",{name:"Next products"})).toBeDisabled();
});
test("slider chips, keyboard and arrow buttons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  await page.getByRole("button", { name: "Vessels", exact: true }).click();
  await expect(page.locator(".slider .product-card")).toHaveCount(16);
  await page.getByRole("button", { name: "Next products" }).click();
  await expect
    .poll(() => page.locator(".slider").evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await page.locator(".slider").focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => page.locator(".slider").evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Pearl wax shades", exact: true })
    .click();
  await expect(page.locator(".slider .product-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Scents", exact: true }).click();
  await expect(page.locator(".slider .product-card")).toHaveCount(6);
});
test("home experiences load on approach and stay interactive", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#pour").scrollIntoViewIfNeeded();
  await page
    .locator(".pour-demo")
    .getByRole("button", { name: "Next →", exact: true })
    .click();
  await expect(page.locator(".demo-controls [role=status]")).toContainText(
    "Step 2 of 4: Pour",
  );
  await page.locator(".lazy-experience.ritual").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Step 5/ }).click();
  await expect(page.locator(".ritual-copy")).toContainText("Keep the ritual.");
});
test("all vessel cards have price, matching discount and working add", async ({
  page,
}) => {
  await page.goto("/vessels/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  const cards = page.locator(".product-card");
  for (let i = 0; i < (await cards.count()); i++) {
    const card = cards.nth(i);
    const price = Number(
      (await card.locator(".pricing strong").innerText()).replace(
        /[^0-9]/g,
        "",
      ),
    );
    const mrp = Number(
      (await card.locator(".pricing del").innerText()).replace(/[^0-9]/g, ""),
    );
    await expect(card.locator(".discount")).toHaveText(
      Math.round((1 - price / mrp) * 100) + "% off",
    );
    await card.getByRole("button", { name: "Add to cart" }).click();
  }
  await expect(page.locator("header .bag-btn")).toContainText("16");
  await cards
    .first()
    .getByRole("button", { name: /Quick view/ })
    .click();
  await expect(page.getByRole("dialog", { name: "Rose Basket" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("dialog").locator(":focus")).toHaveCount(1);
  await page.mouse.click(10, 200);
  await expect(
    page.getByRole("dialog", { name: "Rose Basket" }),
  ).not.toBeVisible();
});
test("mobile navigation, reduced motion and large text stay usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog", { name: "Explore" })
    .getByRole("link", { name: "Vessels", exact: true })
    .click();
  await expect(page).toHaveURL(/vessels/);
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test("corrupt storage, quantity cap and empty bag recover", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("barkat-bag-v2", "{broken");
  });
  await page.goto("/");
  await expect(page.locator("header .bag-btn")).toBeEnabled();
  await expect(page.locator("header .bag-btn")).toContainText("0");
  await page.evaluate(() => {
    localStorage.setItem("barkat-bag-v2", JSON.stringify({ "wax-ivory": 99 }));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "barkat-bag-v2",
        newValue: JSON.stringify({ "wax-ivory": 99 }),
      }),
    );
  });
  await page.locator("header .bag-btn").click();
  await expect(
    page.getByRole("button", { name: "Add one Ivory Pearl Wax" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Remove Ivory Pearl Wax", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("A little space");
});
