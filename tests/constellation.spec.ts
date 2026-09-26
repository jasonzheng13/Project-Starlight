import { enterConstellation } from "./enter-constellation";
import { expect, test, type Page } from "@playwright/test";
import { existsSync } from "node:fs";

const syntheticPhoto =
  '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900"><rect width="700" height="900" fill="#273853"/><circle cx="350" cy="360" r="140" fill="#d4c2a0"/><text x="350" y="650" text-anchor="middle" fill="white" font-size="28">Synthetic test memory</text></svg>';
async function mockPhotos(page: Page) {
  await page.route("**/api/local-media/**", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: syntheticPhoto }),
  );
}

test("six star targets open six distinct memories and navigation wraps", async ({
  page,
}) => {
  await mockPhotos(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterConstellation(page);
  await expect(page.locator(".memory-star")).toHaveCount(6);
  for (let index = 0; index < 6; index++) {
    await page.locator(".memory-star").nth(index).click();
    await expect(page.getByRole("dialog")).toHaveAccessibleName(
      `Year I, memory ${String(index + 1).padStart(2, "0")} gallery`,
    );
    await expect(page.locator(".gallery-tile")).toHaveCount(6);
    await page.getByRole("button", { name: "Close memory" }).click();
  }
  await page.locator(".memory-star").first().click();
  await page.getByRole("button", { name: "Previous memory" }).click();
  await expect(page.locator(".gallery-footer")).toContainText("06 / 06");
  await page.getByRole("button", { name: "Next memory" }).click();
  await expect(page.locator(".gallery-footer")).toContainText("01 / 06");
});

test("unfilled memories explain missing content without illuminating", async ({
  page,
}) => {
  await page.route("**/api/local-media/year-1-memory-4**", (route) =>
    route.fulfill({ status: 404 }),
  );
  await enterConstellation(page);
  await page.locator(".memory-row").nth(3).click();
  await expect(page.locator(".gallery-empty")).toHaveCount(6);
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
});

test("Three.js renders without shader errors and the pause control freezes the sky", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /THREE|shader|WebGL/i.test(message.text())
    )
      errors.push(message.text());
  });
  await enterConstellation(page);
  await expect(page.locator(".three-sky")).toHaveAttribute(
    "data-state",
    "ready",
  );
  await expect(page.locator(".three-sky")).toHaveAttribute(
    "data-motion",
    "running",
  );
  await page.getByRole("button", { name: "Pause sky motion" }).click();
  await expect(page.locator(".three-sky")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await expect(page.locator(".three-constellation")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await page.evaluate(() => document.fonts.ready);
  const paused = await page.screenshot({
    path: ".local/paused-before.png",
    animations: "disabled",
  });
  await page.waitForTimeout(350);
  expect(
    (
      await page.screenshot({
        path: ".local/paused-after.png",
        animations: "disabled",
      })
    ).equals(paused),
  ).toBe(true);
  await page.getByRole("button", { name: "Enable sky motion" }).click();
  await expect(page.locator(".three-sky")).toHaveAttribute(
    "data-motion",
    "running",
  );
  const moving = await page.screenshot();
  await page.waitForTimeout(350);
  expect((await page.screenshot()).equals(moving)).toBe(false);
  expect(errors).toEqual([]);
});

test("memory list and stars remain usable when WebGL cannot initialize", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        kind: string,
        ...args: unknown[]
      ) {
        return kind.startsWith("webgl")
          ? null
          : Reflect.apply(original, this, [kind, ...args]);
      },
    });
  });
  await mockPhotos(page);
  await enterConstellation(page);
  await expect(page.locator(".three-constellation")).toHaveAttribute(
    "data-state",
    "fallback",
  );
  await page.locator(".memory-row").first().click();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Close memory" }).click();
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("stars open memories; next, previous, Escape and focus restoration work", async ({
  page,
}) => {
  await mockPhotos(page);
  await enterConstellation(page);
  const star = page.getByRole("button", {
    name: "Open memory 01: The first little spark",
  });
  await star.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Next memory" }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName(
    "Year I, memory 02 gallery",
  );
  await page.getByRole("button", { name: "Previous memory" }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName(
    "Year I, memory 01 gallery",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(star).toBeFocused();
});

test("failed photos preserve navigation; retry illuminates only once", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/api/local-media/**", (route) =>
    fail
      ? route.fulfill({ status: 404 })
      : route.fulfill({ contentType: "image/svg+xml", body: syntheticPhoto }),
  );
  await enterConstellation(page);
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await page
    .getByRole("button", { name: "Enlarge photo 1", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("alert"),
  ).toHaveAccessibleName("Photo unavailable");
  await expect(page.getByText("DRAFT CAPTION")).toHaveCount(0);
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
  fail = false;
  await page.getByRole("button", { name: "Retry photo" }).click();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Close memory" }).click();
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(1);
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
  await enterConstellation(page);
  await page
    .getByRole("button", { name: "Open memory 01: The first little spark" })
    .click();
  await page.getByRole("button", { name: "Next memory" }).click();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await expect(page.locator(".gallery-photo")).toHaveAttribute(
    "src",
    /memory-2/,
  );
  await page.waitForTimeout(900);
  await expect(page.getByRole("dialog")).toHaveAccessibleName(
    "Year I, memory 02 gallery",
  );
});

test("only supplied photos illuminate; progress remains session only", async ({
  page,
}) => {
  await mockPhotos(page);
  await enterConstellation(page);
  for (let index = 0; index < 3; index++) {
    await page.locator(".memory-row").nth(index).click();
    await page
      .getByRole("button", { name: "Enlarge photo 1", exact: true })
      .click();
    await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
    await page.getByRole("button", { name: "Close memory" }).click();
  }
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(3);
  await page.getByRole("button", { name: "Year II", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await page.getByRole("button", { name: "Year I", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: "Start Game", exact: true }).click();
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
});

test("responsive layout and reduced motion", async ({ page }) => {
  await mockPhotos(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterConstellation(page);
  await expect(page.locator(".three-constellation")).toHaveAttribute(
    "data-state",
    "ready",
  );
  await expect(page.locator(".three-sky")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await expect(page.locator(".site-footer")).toHaveCount(0);
  await expect(page.locator(".map-caption")).toHaveCount(0);
  await expect(page.locator(".chapter-description")).toHaveText(
    "I am Jean, the Dandelion Knight, requesting approval to join your party. From this day onwards, my honor and loyalty lie with you.",
  );
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
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
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
  await enterConstellation(page);
  for (let index = 0; index < 3; index++) {
    await page.locator(".memory-row").nth(index).click();
    await page
      .getByRole("button", { name: "Enlarge photo 1", exact: true })
      .click();
    await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
    await expect(page.locator(".gallery-photo")).toHaveCSS(
      "object-fit",
      "contain",
    );
    await expect(page.locator(".gallery-photo")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `.local/local-memory-${index + 1}.png` });
    await page.getByRole("button", { name: "Close memory" }).click();
  }
});
