import { test, expect } from "@playwright/test";

test("auth remains usable without WebGL and with reduced motion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/auth?mode=signup");
  await expect(
    page.getByRole("button", { name: "Create your account" }),
  ).toBeEnabled();
  await expect(page.locator(".talent-fallback")).toBeVisible();
  await page.getByLabel("Work email").fill("not-an-email");
  await page.getByRole("button", { name: "Create your account" }).click();
  await expect(page).toHaveURL(/mode=signup/);
});

test("auth key text meets AA contrast in both themes", async ({ page }) => {
  await page.goto("/auth");
  const ratios = async () =>
    page.evaluate(() => {
      const rgb = (value: string) =>
        (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const lum = (color: number[]) =>
        color
          .map((n) => {
            const v = n / 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
      const contrast = (a: string, b: string) => {
        const x = lum(rgb(a)),
          y = lum(rgb(b));
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      const button = getComputedStyle(document.querySelector(".auth-submit")!);
      const panel = getComputedStyle(
        document.querySelector(".auth-form-area")!,
      );
      const muted = getComputedStyle(
        document.querySelector(".auth-form-inner > p.text-muted-foreground")!,
      );
      return [
        contrast(button.color, button.backgroundColor),
        contrast(muted.color, panel.backgroundColor),
      ];
    });
  for (const ratio of await ratios()) expect(ratio).toBeGreaterThanOrEqual(4.5);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  for (const ratio of await ratios()) expect(ratio).toBeGreaterThanOrEqual(4.5);
});
