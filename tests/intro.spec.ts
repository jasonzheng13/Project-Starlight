import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { introTiming } from "../src/features/intro/intro-timing";
const hasVideo = existsSync(
  "music/sfx/GENSHIN IMPACT _ CELESTIA DOOR _ LOADING SCREEN (1).mp4",
);

test("cursor-free opening loops before the recorded click, then Start plays the door", async ({
  page,
}) => {
  test.skip(!hasVideo, "Local recording required");
  await page.goto("/");
  await expect(page.locator(".start-screen")).toHaveClass(/is-ready/);
  const player = page.locator("video");
  expect(
    await player.evaluate((v: HTMLVideoElement) => [
      v.videoWidth,
      v.videoHeight,
    ]),
  ).toEqual([1920, 1080]);
  await expect(player).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".celestial-scene")).toHaveCount(0);
  await expect(page.getByRole("button")).toHaveCount(1);
  // Sample across multiple rewinds; none may reach the cursor/click footage.
  let maximumTime = 0;
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(200);
    maximumTime = Math.max(
      maximumTime,
      await player.evaluate((v: HTMLVideoElement) => v.currentTime),
    );
  }
  expect(maximumTime).toBeLessThan(1.2);
  expect(await player.evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(
    0.5,
  );
  const time = await player.evaluate((v: HTMLVideoElement) => v.currentTime);
  expect(time).toBeGreaterThanOrEqual(introTiming.loopStart);
  expect(time).toBeLessThan(1.2);
  await page.screenshot({ path: ".local/video-1080p-start.png" });
  expect(await player.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.locator(".start-screen")).toHaveClass(/entering/);
  await expect.poll(() => page.locator("audio[data-intro-music]").evaluate((a: HTMLAudioElement) => a.paused)).toBe(false);
  await expect
    .poll(() => player.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(3);
  await expect.poll(() => player.evaluate((v: HTMLVideoElement) => v.muted), { timeout: 15000 }).toBe(false);
  expect(await page.locator("audio[data-intro-music]").evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
  await expect(page.locator(".start-screen")).toHaveCount(0, {
    timeout: 22000,
  });
  await expect(
    page.getByRole("button", { name: "Year I", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".memory-star")).toHaveCount(6);
});

test("reduced motion preserves the account-text crop on mobile", async ({
  page,
}) => {
  test.skip(!hasVideo, "Local recording required");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".start-screen")).toHaveClass(/is-ready/);
  const time = await page
    .locator("video")
    .evaluate((v: HTMLVideoElement) => v.currentTime);
  await page.waitForTimeout(250);
  expect(
    await page
      .locator("video")
      .evaluate((v: HTMLVideoElement) => v.currentTime),
  ).toBe(time);
  const bounds = await page.locator(".intro-frame").boundingBox();
  expect(bounds!.width / bounds!.height).toBeCloseTo(16 / (9 * 0.92), 2);
  const videoBounds = await page.locator("video").boundingBox();
  expect(bounds!.height / videoBounds!.height).toBeCloseTo(0.92, 2);
  await expect(page.locator(".intro-scenery")).toHaveCSS("overflow", "hidden");
  await page.screenshot({ path: ".local/video-1080p-mobile.png" });
  await page.getByRole("button", { name: "Start Game" }).press("Enter");
  await expect(page.locator(".start-screen")).toHaveCount(0);
});

test("missing recording still permits entry", async ({ page }) => {
  await page.route("**/api/local-intro", (r) => r.fulfill({ status: 404 }));
  await page.goto("/");
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.locator(".start-screen")).toHaveCount(0);
  await expect(page.locator(".memory-star")).toHaveCount(6);
});

test("local recording streams bounded byte ranges", async ({ request }) => {
  test.skip(!hasVideo, "Local recording required");
  const response = await request.get("/api/local-intro", {
    headers: { range: "bytes=0-99" },
  });
  expect(response.status()).toBe(206);
  expect(response.headers()["content-type"]).toBe("video/mp4");
  expect((await response.body()).length).toBe(100);
  expect(
    (
      await request.get("/api/local-intro", {
        headers: { range: "bytes=999999999999-" },
      })
    ).status(),
  ).toBe(416);
});
