import { test, expect } from "@playwright/test";

test("record five controlled mobile auth cold starts", async ({ browser }, testInfo) => {
  const samples: { fcp: number | null; lcp: number; cls: number; longTasks: number }[] = [];
  for (let sample = 0; sample < 5; sample++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      const metrics = { lcp: 0, cls: 0, longTasks: 0 };
      Object.assign(window, { retainiqMetrics: metrics });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) metrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) { const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }; if (!shift.hadRecentInput) metrics.cls += shift.value; } }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => { metrics.longTasks += list.getEntries().length; }).observe({ type: "longtask", buffered: true });
    });
    await page.goto("/auth", { waitUntil: "networkidle", timeout: 60_000 });
    await expect(page.getByRole("button", { name: "Sign in to your workspace" })).toBeEnabled();
    const metrics = await page.evaluate(() => ({ ...(window as unknown as { retainiqMetrics: { lcp: number; cls: number; longTasks: number } }).retainiqMetrics, fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null }));
    samples.push(metrics);
    await context.close();
  }
  console.log("Mobile auth performance samples (local production, 4x CPU, 150ms RTT, 200KB/s):", JSON.stringify(samples));
  await testInfo.attach("auth-performance.json", { body: JSON.stringify({ route: "/auth", baseline: "Not captured before implementation; improvement unverified", samples }, null, 2), contentType: "application/json" });
});
