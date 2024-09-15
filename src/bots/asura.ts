import type { Page } from "playwright";
import { openPage, close, goTo, navigateFromLocator } from "./helpers";
import { statusMap, TIMEOUTS_IN_MS } from "./constants";
import { ComicFromList, CompleteComic } from "./types";

const url = "https://asuracomic.net/";

async function scrape() {
  const { browser, context, page } = await openPage(url);
  await close(browser, context, page);
}

async function scrapeComics() {
  const { browser, context, page } = await openPage(url);

  await goToComics(page);
  const inCompleteComics = await getComicsFromList(page);
  const comics = await getCompleteComics(page, inCompleteComics);

  await close(browser, context, page);

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
      slug: title.toLowerCase().replaceAll(",", "").replace(/ /g, "-"),
      lastChapter: Number.parseInt(chapter.replace(/chapter/i, "").trim()),
      rating: Number.parseFloat(rating),
      imageUrl: imageUrl!,
      url: `${url}${href}`,
    };

    comicsInPage.push(comic);
  }

  return comicsInPage;
}

async function getCompleteComics(page: Page, incompleteComics: ComicFromList[]) {
  const comics: CompleteComic[] = [];

  for (const incompleteComic of incompleteComics) {
    await goTo(page, incompleteComic.url);

    const firstChapterText = await page
      .locator("h3", { hasText: /first chapter/i })
      .locator("..")
      .locator("h3")
      .nth(1)
      .textContent();

    const firstChapter = Number.parseInt(firstChapterText!.replace(/chapter/i, "").trim());

    comics.push({ ...incompleteComic, firstChapter });
  }

  return comics;
}

export const asura = { scrape, scrapeComics };
