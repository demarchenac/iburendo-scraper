import { chromium } from "playwright";
import type { Browser, BrowserContext, Page } from "playwright";
import { PlaywrightBlocker } from "@cliqz/adblocker-playwright";
import { TIMEOUTS_IN_MS } from "./constants";

export async function openPage(url: string) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ colorScheme: "dark", locale: "en-US" });
  const page = await context.newPage();

  const adBlocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);
  adBlocker.enableBlockingInPage(page);

  await page.goto(url);

  return { browser, context, page };
}

export async function goTo(page: Page, url: string) {
  await page.goto(url);
  await page.waitForTimeout(TIMEOUTS_IN_MS.LINK_CLICK);
}

export async function close(browser: Browser, context: BrowserContext, page: Page) {
  await page.close();
  await context.close();
  await browser.close();
}
