import { chromium } from "playwright";
import type { Browser, BrowserContext, Locator, Page } from "playwright";
import { PlaywrightBlocker } from "@cliqz/adblocker-playwright";
import { TIMEOUTS_IN_MS } from "./constants";
import { getImageFromUrl } from "../helpers";
import { AzureBlobService } from "../lib";
import type { Chapter, Page as ChapterPage, Comic, Source } from "./types";

export async function openPage(url: string, headless: boolean = true) {
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ colorScheme: "dark", locale: "en-US" });
  const page = await context.newPage();

  const adBlocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);
  adBlocker.enableBlockingInPage(page);

  await page.goto(url);

  return { browser, context, page };
}

export async function navigateFromLocator(page: Page, locator: Locator) {
  await locator.click();
  await page.waitForTimeout(TIMEOUTS_IN_MS.LINK_CLICK);
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

async function reUploadImageFromSourceToAzure(name: string, imageUrl: string) {
  if (imageUrl.indexOf(AzureBlobService.connectionString) !== -1) return imageUrl;

  const urlFromAzure = await AzureBlobService.isImageUploaded(name);
  if (urlFromAzure) return urlFromAzure;

  const image = await getImageFromUrl(imageUrl);
  const newUrlFromAzure = await AzureBlobService.uploadImage(name, image);
  return newUrlFromAzure;
}

async function reUploadComicImagesToAzure(comic: Comic<Chapter>) {
  const comicImageFromAzure = await reUploadImageFromSourceToAzure(
    `${comic.slug}.webp`,
    comic.imageUrl
  );

  const chapters: Chapter[] = [];
  let pages: ChapterPage[] = [];

  for (const chapter of comic.chapters) {
    pages = [];
    const chapterNumber = chapter.number.toString().padStart(4, "0");

    for (const page of chapter.pages) {
      const pageNumber = page.number.toString().padStart(2, "0");
      const filename = `${comic.slug}-chapter-${chapterNumber}-page-${pageNumber}.webp`;

      const pageImageFromAzure = await reUploadImageFromSourceToAzure(filename, page.imageUrl);

      pages.push({ ...page, imageUrl: pageImageFromAzure });
    }

    chapters.push({ ...chapter, pages });
  }

  return { ...comic, chapters, imageUrl: comicImageFromAzure };
}

export async function reUploadComicsImagesToAzure(comicsWithImagesFromSource: Comic<Chapter>[]) {
  const comics: Comic<Chapter>[] = [];

  for (const comicWithImagesFromSource of comicsWithImagesFromSource) {
    const comic = await reUploadComicImagesToAzure(comicWithImagesFromSource);
    comics.push(comic);
  }

  return comics;
}

export async function reUploadSourceImageToAzure(source: Source) {
  const newLogoUrl = await reUploadImageFromSourceToAzure(
    `${source.slug}-logo.webp`,
    source.imageUrl
  );

  return { ...source, imageUrl: newLogoUrl };
}
