import { expect, test } from "@playwright/test";

test("local effects decode, respond to controls, and mute independently of music", async ({
  page,
  request,
}) => {
  const response = await request.get("/api/local-sounds/button");
  test.skip(
    response.status() === 404,
    "Local sound files are intentionally not committed",
  );
  expect(response.headers()["content-type"]).toBe("audio/mpeg");
  expect((await request.get("/api/local-sounds/unknown")).status()).toBe(404);
  await page.addInitScript(() => {
    Object.assign(window, { soundStarts: 0, decodedSounds: 0 });
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      (window as unknown as { soundStarts: number }).soundStarts++;
      return start.apply(this, args);
    };
    const decode = AudioContext.prototype.decodeAudioData;
    AudioContext.prototype.decodeAudioData = function (bytes) {
      return decode.call(this, bytes).then((buffer) => {
        (window as unknown as { decodedSounds: number }).decodedSounds++;
        return buffer;
      });
    };
  });
  await page.goto("/");
  const starts = () =>
    page.evaluate(
      () => (window as unknown as { soundStarts: number }).soundStarts,
    );
  await page.getByRole("button", { name: "Music volume controls" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { decodedSounds: number }).decodedSounds,
      ),
    )
    .toBe(4);
  const slider = page.getByRole("slider", { name: "Effects volume" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await expect.poll(starts).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Mute effects", exact: true }).click();
  await expect(slider).toHaveValue("0");
  const muted = await starts();
  await page.getByRole("button", { name: "Pause sky motion" }).click();
  expect(await starts()).toBe(muted);
  await page.getByRole("button", { name: "Music volume controls" }).click();
  await page
    .getByRole("button", { name: "Unmute effects", exact: true })
    .click();
  await expect(slider).toHaveValue("100");
  await expect(page.getByRole("slider", { name: "Music volume" })).toHaveValue(
    "30",
  );
  await page.keyboard.press("Escape");
  const before = await starts();
  await page
    .getByRole("button", { name: "Open memory 04:", exact: false })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect.poll(starts).toBeGreaterThan(before);
  const opened = await starts();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(starts).toBeGreaterThan(opened);
});

test("missing or invalid effects never block memory navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/local-sounds/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "audio/mpeg",
      body: "invalid audio",
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open memory 04:", exact: false })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: false }).click();
  await expect(
    page.getByRole("heading", { name: "Memory 05", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});
