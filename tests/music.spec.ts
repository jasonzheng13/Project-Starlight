import { enterConstellation } from "./enter-constellation";
import { expect, test } from "@playwright/test";

// A generated silent WAV tests actual browser decoding without shipping OST audio.
function silentWav() {
  const data = Buffer.alloc(44 + 16000);
  data.write("RIFF", 0);
  data.writeUInt32LE(data.length - 8, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(8000, 24);
  data.writeUInt32LE(16000, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(16000, 40);
  return data;
}

test("cat B controls real audio playback, keyboard volume, mute, pause and dismissal", async ({
  page,
}) => {
  await page.route("**/api/local-music*", (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav() }),
  );
  await enterConstellation(page);
  await expect(page.locator(".cat-mascot")).toHaveAttribute("src", /cat-b/);
  await expect(page.getByRole("button", { name: "Preview cat A" })).toHaveCount(
    0,
  );
  const cat = page.getByRole("button", { name: "Music volume controls" });
  await cat.click();
  const panel = page.getByRole("region", { name: "Music controls" });
  await expect(panel).toBeVisible();
  if (
    await page
      .getByRole("button", { name: "Play music", exact: true })
      .isVisible()
  )
    await page.getByRole("button", { name: "Play music", exact: true }).click();
  await expect(panel).toContainText("Now playing");
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.currentTime),
    )
    .toBeGreaterThan(0);
  const slider = page.getByRole("slider", { name: "Music volume" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.volume),
    )
    .toBe(1);
  await page.getByRole("button", { name: "Mute music", exact: true }).click();
  await expect(slider).toHaveValue("0");
  await page.getByRole("button", { name: "Unmute music", exact: true }).click();
  await expect(slider).toHaveValue("100");
  await page.getByRole("button", { name: "Pause music", exact: true }).click();
  await expect(panel).toContainText("Paused");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(cat).toBeFocused();
  await cat.click();
  await page.getByRole("heading", { name: "Where we began." }).click();
  await expect(panel).toHaveCount(0);
});

test("each constellation owns its soundtrack and chapters without tracks are silent", async ({
  page,
  request,
}) => {
  await page.route("**/api/local-music*", (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav() }),
  );
  await enterConstellation(page);
  await page.getByRole("button", { name: "Music volume controls" }).click();
  const audio = page.locator("audio");
  await expect(audio).toHaveAttribute(
    "src",
    "/api/local-music?constellation=year-1",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Year III", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await expect(audio).not.toHaveAttribute("src");
  expect(
    await audio.evaluate((element: HTMLAudioElement) => element.paused),
  ).toBe(true);
  await page.getByRole("button", { name: "Year I", exact: true }).click();
  await expect(page.locator(".chapter-transition")).toHaveCount(0);
  await expect(audio).toHaveAttribute(
    "src",
    "/api/local-music?constellation=year-1",
  );
  await expect
    .poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused))
    .toBe(false);
  await page.getByRole("button", { name: /Open memory 01:/ }).click();
  expect(
    await audio.evaluate((element: HTMLAudioElement) => element.paused),
  ).toBe(false);
  expect(
    (await request.get("/api/local-music?constellation=unknown")).status(),
  ).toBe(404);
});

test("blocked autoplay retries when the cat is clicked", async ({ page }) => {
  await page.route("**/api/local-music*", (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav() }),
  );
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!navigator.userActivation.isActive)
        return Promise.reject(
          new DOMException("Gesture required", "NotAllowedError"),
        );
      return original.call(this);
    };
  });
  await enterConstellation(page);
  await page.getByRole("button", { name: "Music volume controls" }).click();
  await expect(
    page.getByRole("region", { name: "Music controls" }),
  ).toContainText("Now playing");
});

test("missing soundtrack is recoverable and volume panel fits mobile", async ({
  page,
}) => {
  await page.route("**/api/local-music*", (route) =>
    route.fulfill({ status: 404 }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await enterConstellation(page);
  await page.getByRole("button", { name: "Music volume controls" }).click();
  await expect(
    page.getByRole("region", { name: "Music controls" }),
  ).toContainText("Soundtrack not available yet");
  await page.screenshot({ path: ".local/music-mobile.png", fullPage: true });
  await page.unroute("**/api/local-music*");
  await page.route("**/api/local-music*", (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav() }),
  );
  await page.getByRole("button", { name: "Play music", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Music controls" }),
  ).toContainText("Now playing");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
