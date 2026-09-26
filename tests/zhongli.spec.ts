import { enterConstellation } from "./enter-constellation";
import { expect, test } from "@playwright/test";

test("Zhongli placeholders, emblems, music and chapter progress stay separate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("year-2-memory")) requests.push(request.url());
  });
  await page.route("**/api/local-media/year-1-memory-1**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="gold"/></svg>',
    }),
  );
  await enterConstellation(page);
  await page.locator(".memory-row").first().click();
  await page
    .getByRole("button", { name: "Enlarge photo 1", exact: true })
    .click();
  await expect(page.locator(".gallery-photo")).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Close memory" }).click();
  await page.getByRole("button", { name: "Year II", exact: true }).click();
  await expect(page.locator(".chapter-description")).toHaveText(
    "Osmanthus wine tastes the same as I remember... But where are those who share the memory?",
  );
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(0);
  await expect(page.locator(".memory-row").first()).toHaveText("");
  await expect(page.locator("audio")).toHaveAttribute(
    "src",
    "/api/local-music?constellation=year-2",
  );
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  for (let i = 0; i < 6; i++) {
    await page.locator(".memory-row").nth(i).click();
    await expect(page.locator(".gallery-empty")).toHaveCount(6);
    await expect(
      page.getByRole("heading", { name: `Memory ${i + 1}`, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".gallery-photo")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(page.locator(".memory-row").nth(i)).toBeFocused();
  }
  await page.locator(".memory-row").first().click();
  await page.getByRole("button", { name: "Previous memory" }).click();
  await expect(page.locator(".gallery-footer")).toContainText("06 / 06");
  await page.keyboard.press("Escape");
  expect(requests).toEqual([]);
  await page.screenshot({ path: ".local/zhongli-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: ".local/zhongli-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Year I", exact: true }).click();
  await expect(page.locator(".memory-star.is-viewed")).toHaveCount(1);
});

test("element loading transition reveals the next chapter and resets for the return", async ({
  page,
}) => {
  await enterConstellation(page);
  await page.getByRole("button", { name: "Year II", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toBeVisible();
  await expect(page.locator(".loading-element")).toHaveCount(7);
  await expect(page.locator(".chapter-transition")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  const cycle = await page
    .locator(".loading-element")
    .first()
    .evaluate((element) => {
      const animation = element.getAnimations()[0];
      const previous = animation.currentTime;
      animation.pause();
      const sample = (time: number) => {
        animation.currentTime = time;
        return Number(getComputedStyle(element).opacity);
      };
      const values = [sample(360), sample(720), sample(1360)];
      animation.currentTime = previous;
      animation.play();
      return values;
    });
  expect(cycle).toEqual([1, 0, 1]);
  await page.locator(".chapter-transition").evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime =
        (animation.effect as KeyframeEffect).target === element ? 600 : 0;
    }
  });
  await expect(page.locator(".chapter-transition")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: ".local/element-loading-desktop.png" });
  await expect(
    page.getByRole("heading", { name: "Where memories endure." }),
  ).toBeVisible();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Year II", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Year I", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Where we began." }),
  ).toBeVisible();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await page.getByRole("button", { name: "Pause sky motion" }).click();
  await page.getByRole("button", { name: "Year II", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
});

test("Zhongli stars remain usable without WebGL and chapter navigation preserves focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await enterConstellation(page);
  await page.getByRole("button", { name: "Year II", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Year II", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".three-constellation")).toHaveAttribute(
    "data-state",
    "fallback",
  );
  await page.locator(".memory-star").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".gallery-empty")).toHaveCount(6);
  await page.keyboard.press("Escape");
  await expect(page.locator(".memory-star").first()).toBeFocused();
});
