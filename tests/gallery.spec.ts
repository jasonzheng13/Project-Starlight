import { enterConstellation } from "./enter-constellation";
import { expect, test } from "@playwright/test";

test("gallery isolates photos, restores tile focus, and previews empty slots without progress", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/local-media/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#527582"/><circle cx="400" cy="300" r="150" fill="#e1c990"/></svg>',
    }),
  );
  await enterConstellation(page);
  await page.locator(".memory-row").first().click();
  await expect(page.locator(".gallery-tile")).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Memory 1", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveAttribute(
    "data-region",
    "mondstadt",
  );
  await page.evaluate(async () => {
    const image = new Image();
    image.src = "/images/regions/mondstadt.jpg";
    await image.decode();
  });
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
  await page.screenshot({ path: ".local/gallery-desktop.png" });
  await page
    .getByRole("button", { name: "Enlarge photo 1", exact: true })
    .click();
  await expect(page.locator(".gallery-grid")).toHaveCount(0);
  await expect(page.locator(".gallery-photo.ready")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(1);
  await page.screenshot({ path: ".local/gallery-focus.png" });
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("img", { name: "Empty photo preview" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Preview empty photo slot 2" }),
  ).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: ".local/gallery-mobile.png" });
  expect(
    await page
      .locator(".gallery-dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await expect(page.locator(".gallery-tile").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".memory-row").first()).toBeFocused();
  for (const [year, region] of [
    ["II", "liyue"],
    ["III", "fontaine"],
    ["IV", "liyue"],
    ["V", "inazuma"],
  ]) {
    await page
      .getByRole("button", { name: `Year ${year}`, exact: true })
      .click();
    await expect(page.locator(".memory-row-copy")).toHaveCount(0);
    await page.locator(".memory-row").first().click();
    await expect(page.getByRole("dialog")).toHaveAttribute(
      "data-region",
      region,
    );
    await expect(
      page.getByRole("heading", { name: "Memory 1", exact: true }),
    ).toBeVisible();
    await page.evaluate(async (region) => {
      const image = new Image();
      image.src = `/images/regions/${region}.${region === "inazuma" ? "png" : "jpg"}`;
      await image.decode();
    }, region);
    await page.screenshot({ path: `.local/gallery-region-${year}.png` });
    await page
      .getByRole("button", { name: "Preview empty photo slot 1" })
      .click();
    await expect(
      page.getByRole("img", { name: "Empty photo preview" }),
    ).toBeVisible();
    await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
    await page.getByRole("button", { name: "Close memory" }).click();
  }
});
