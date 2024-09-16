import type { Page } from "playwright";
import {
  openPage,
  close,
  goTo,
  navigateFromLocator,
  reUploadComicsImagesToAzure,
  reUploadSourceImageToAzure,
} from "./helpers";
import { monthMap, statusMap } from "./constants";
import type {
  ComicFromList,
  Comic,
  IncompleteChapter,
  Chapter,
  Page as ChapterPage,
  Source,
} from "./types";
import { parseStringToSlug } from "../helpers";

const url = "https://asuracomic.net/";

async function scrape() {
  const { browser, context, page } = await openPage(url);
  await close(browser, context, page);
}

async function scrapeSource(headless: boolean = true) {
  const { browser, context, page } = await openPage(url, headless);

  const title = await page.title();
  const imageUrlSegment = await page
    .getByRole("banner")
    .getByRole("img", { name: /asura logo/i })
    .getAttribute("src");
  const imageUrl = `${url}${imageUrlSegment!}`.replace("//", "/");

  const sourceWithImagesFromSource: Source = { title, imageUrl, slug: parseStringToSlug(title) };

  await close(browser, context, page);

  const source = await reUploadSourceImageToAzure(sourceWithImagesFromSource);

  return source;
}

async function scrapeComics(headless: boolean = true) {
  const { browser, context, page } = await openPage(url, headless);

  await goToComics(page);
  const comicsWithoutChapters = await getComicsFromList(page);
  const comicsWithIncompleteChapters = await getComicsWithIncompleteChapters(page, [
    comicsWithoutChapters.at(0)!,
  ]);
  const comicsWithImagesFromSource = await getComicsWithChapterPages(
    page,
    comicsWithIncompleteChapters
  );

  await close(browser, context, page);

  const comics = await reUploadComicsImagesToAzure(comicsWithImagesFromSource);

  return comics;
}

function goToComics(page: Page) {
  return navigateFromLocator(page, page.getByRole("link", { name: /comics/i }));
}

async function getComicsFromList(page: Page) {
  let shouldScrapePage = true;
  let comics: ComicFromList[] = [];

  while (shouldScrapePage) {
    const comicsInPage = await getComicsInPage(page);
    comics = comics.concat(comicsInPage);

    const nextBtn = page.getByText(/next/i).first();
    const nextBtnStyle = await nextBtn.getAttribute("style");
    if (!nextBtnStyle) {
      shouldScrapePage = false;
      continue;
    }

    shouldScrapePage = nextBtnStyle === "pointer-events: auto;";
    if (shouldScrapePage) await navigateFromLocator(page, nextBtn);
  }

  return comics.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function getComicsInPage(page: Page) {
  const comicsContainer = await page
    .locator("h3", { hasText: /series list/i })
    .locator("..")
    .locator("..");

  const links = await comicsContainer.getByRole("link").all();

  const comicsInPage: ComicFromList[] = [];

  for (const link of links) {
    const href = await link.getAttribute("href");
    if (!href) continue;
    if (!href.includes("series/")) continue;

    const [status, comicType, title, chapter, rating] = await link
      .locator("span")
      .allTextContents();

    const imageUrl = await link
      .locator("span", { hasText: status })
      .locator("..")
      .locator("img")
      .getAttribute("src");

    const comic: ComicFromList = {
      status: statusMap[status.toLowerCase()],
      comicType: comicType.toLowerCase(),
      title,
      slug: parseStringToSlug(title),
      lastChapter: Number.parseInt(chapter.replace(/chapter/i, "").trim()),
      rating: Number.parseFloat(rating),
      imageUrl: imageUrl!,
      url: `${url}${href}`,
    };

    comicsInPage.push(comic);
  }

  return comicsInPage;
}

async function getComicsWithIncompleteChapters(page: Page, incompleteComics: ComicFromList[]) {
  const comics: Comic<IncompleteChapter>[] = [];

  for (const incompleteComic of incompleteComics) {
    await goTo(page, incompleteComic.url);

    const firstChapterText = await page
      .locator("h3", { hasText: /first chapter/i })
      .locator("..")
      .locator("h3")
      .nth(1)
      .textContent();

    const firstChapter = Number.parseInt(firstChapterText!.replace(/chapter/i, "").trim());

    const chapters = await getChapterList(page, incompleteComic.title, incompleteComic.url);

    comics.push({ ...incompleteComic, firstChapter, chapters });
  }

  return comics;
}

async function getChapterList(page: Page, title: string, comicUrl: string) {
  const chapters: IncompleteChapter[] = [];

  const chapterContainers = await page
    .locator("h3", { hasText: `Chapter ${title}` })
    .locator("..")
    .locator("..")
    .locator("div > div > div")
    .all();

  for (const chapterContainer of chapterContainers.toReversed()) {
    const [chapterString, publishDateString] = await chapterContainer
      .locator("h3")
      .allTextContents();

    const chapterUrlSegment = await chapterContainer.locator("h3 > a").getAttribute("href");

    const [firstNumericMatch] = chapterString.match(/(\d+)/) as string[];
    const number = Number.parseInt(firstNumericMatch.trim());

    const chapterUrl = chapterUrlSegment?.includes(`chapter/${number}`)
      ? `${url}series/${chapterUrlSegment}`
      : `${comicUrl}/chapter/${number}`;

    const [monthDay, year] = (publishDateString.match(/(\d+)/g) ?? []).map((value) =>
      Number.parseInt(value)
    );
    const month = (publishDateString.split(" ").at(0) ?? "").toLowerCase();
    const monthNumber = monthMap[month] ?? 0;

    const publishedOn = new Date(year, monthNumber, monthDay);

    const chapter = {
      number,
      title: chapterString.trim(),
      url: chapterUrl,
      publishedOn: publishedOn,
      pageCount: 0,
    };

    chapters.push(chapter);
  }

  return chapters;
}

async function getComicsWithChapterPages(page: Page, incompleteComics: Comic<IncompleteChapter>[]) {
  const comics: Comic<Chapter>[] = [];

  for (const incompleteComic of incompleteComics) {
    const chapters = await getChaptersWithPages(page, incompleteComic.chapters);
    comics.push({ ...incompleteComic, chapters });
  }

  return comics;
}

async function getChaptersWithPages(page: Page, incompleteChapters: IncompleteChapter[]) {
  const chapters: Chapter[] = [];

  for (const incompleteChapter of incompleteChapters) {
    const pages = await getChapterPages(page, incompleteChapter);
    chapters.push({ ...incompleteChapter, pages, pageCount: pages.length });
  }

  return chapters;
}

async function getChapterPages(page: Page, chapter: IncompleteChapter) {
  const pages: ChapterPage[] = [];

  await goTo(page, chapter.url);

  const imgContainers = await page.getByRole("img", { name: /chapter page/i }).all();
  const srcPromises = imgContainers.map((img) => img.getAttribute("src")) as Promise<string>[];
  const images = await Promise.all(srcPromises);

  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    pages.push({
      number: imageIndex + 1,
      imageUrl: images[imageIndex],
      url: chapter.url,
    });
  }

  return pages;
}

export const asura = { scrape, scrapeComics, scrapeSource };
