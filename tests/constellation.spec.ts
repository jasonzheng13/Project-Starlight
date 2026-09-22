import { expect, test, type Page } from "@playwright/test";
import { existsSync } from "node:fs";

const syntheticPhoto =
  '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900"><rect width="700" height="900" fill="#273853"/><circle cx="350" cy="360" r="140" fill="#d4c2a0"/><text x="350" y="650" text-anchor="middle" fill="white" font-size="28">Synthetic test memory</text></svg>';
async function mockPhotos(page: Page) {
  await page.route("**/api/local-media/**", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: syntheticPhoto }),
  );
}

test("stars open memories; next, previous, Escape and focus restoration work", async ({
  page,
}) => {
  await mockPhotos(page);
  await page.goto("/");
  const star = page.getByRole("button", {
    name: "Open memory 01: The first little spark",
  });
  await star.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Next →" }).click();
  await expect(
    page.getByRole("heading", { name: "A moment, kept forever" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "← Previous" }).click();
  await expect(
    page.getByRole("heading", { name: "The first little spark" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(star).toBeFocused();
});

test("failed photos preserve text and navigation; retry illuminates only once", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/api/local-media/**", (route) =>
    fail
      ? route.fulfill({ status: 404 })
      : route.fulfill({ contentType: "image/svg+xml", body: syntheticPhoto }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "The photo couldn’t open",
  );
  await expect(page.getByText("DRAFT CAPTION")).toBeVisible();
  await expect(page.locator(".chapter-progress > p > span")).toHaveText("00");
  fail = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Close memory" }).click();
  await expect(page.locator(".chapter-progress > p > span")).toHaveText("01");
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
  await expect(page.locator(".chapter-progress > p > span")).toHaveText("01");
});

test("a delayed previous photo cannot replace the latest selection", async ({
  page,
}) => {
  await page.route("**/api/local-media/**", async (route) => {
    if (route.request().url().includes("memory-1"))
      await new Promise((resolve) => setTimeout(resolve, 700));
    await route
      .fulfill({ contentType: "image/svg+xml", body: syntheticPhoto })
      .catch(() => {});
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await page.getByRole("button", { name: "Next →" }).click();
  await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
  await expect(page.locator(".memory-photo")).toHaveAttribute(
    "src",
    /memory-2/,
  );
  await page.waitForTimeout(900);
  await expect(page.getByRole("dialog")).toHaveAccessibleName(
    "A moment, kept forever",
  );
});

test("all three memories illuminate; overview and list remain usable", async ({
  page,
}) => {
  await mockPhotos(page);
  await page.goto("/");
  for (let index = 0; index < 3; index++) {
    await page.locator(".memory-row").nth(index).click();
    await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
    await page.getByRole("button", { name: "Close memory" }).click();
  }
  await expect(
    page.getByText("Our first constellation, shining together."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Our universe" }).click();
  await expect(
    page.getByRole("heading", { name: "Written in the stars." }),
  ).toBeVisible();
  await page.getByRole("button", { name: /YEAR I Where we began/ }).click();
  await expect(page.locator(".chapter-progress > p > span")).toHaveText("03");
  await page.reload();
  await expect(page.locator(".chapter-progress > p > span")).toHaveText("00");
});

test("responsive layout and reduced motion", async ({ page }) => {
  await mockPhotos(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".nebula-one")).toHaveCSS("animation-name", "none");
  await page.screenshot({ path: ".local/desktop-preview.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".memory-row").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: ".local/mobile-preview.png", fullPage: true });
  await page.locator(".memory-row").first().click();
  await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
  await page.screenshot({ path: ".local/mobile-viewer.png", fullPage: true });
});

test("local media rejects unknown IDs and refuses cross-origin embedding", async ({
  request,
}) => {
  expect((await request.get("/api/local-media/not-a-memory")).status()).toBe(
    404,
  );
  expect((await request.get("/api/local-media/__proto__")).status()).toBe(404);
  const response = await request.get("/api/local-media/year-1-memory-1");
  // A fresh clone legitimately has no private pictures.
  expect([200, 404]).toContain(response.status());
  if (response.ok()) {
    expect(response.headers()["cache-control"]).toBe("private, no-store");
    expect(response.headers()["cross-origin-resource-policy"]).toBe(
      "same-origin",
    );
  }
});

test("supplied local photos decode and display without cropping", async ({
  page,
}) => {
  test.skip(
    !existsSync("pictures/first_year/first_year_1.png") ||
      process.env.CI === "true",
    "Private local photos are optional and never required in CI.",
  );
  await page.goto("/");
  for (let index = 0; index < 3; index++) {
    await page.locator(".memory-row").nth(index).click();
    await expect(page.locator(".memory-photo")).toHaveClass(/ready/);
    await expect(page.locator(".memory-photo")).toHaveCSS(
      "object-fit",
      "contain",
    );
    await expect(page.locator(".memory-photo")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `.local/local-memory-${index + 1}.png` });
    await page.getByRole("button", { name: "Close memory" }).click();
  }
});
