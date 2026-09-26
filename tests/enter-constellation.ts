import { expect, type Page } from "@playwright/test";

export async function enterConstellation(page: Page) {
  const reduced = await page.evaluate(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Start Game", exact: true }).click();
  await expect(page.locator(".start-screen")).toHaveCount(0);
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
}
