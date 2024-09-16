export type SourceSlug = "asura";

export type Bot = {
  scrape: (headless?: boolean) => Promise<void>;
  scrapeComics: (headless?: boolean) => Promise<Comic<Chapter>[]>;
  scrapeSource: (headless?: boolean) => Promise<Source>;
};

export type BotBySource = Record<SourceSlug, Bot>;

export type Source = {
  title: string;
  slug: string;
  imageUrl: string;
};

export type ComicStatus =
  | "on-going"
  | "paused"
  | "finished"
  | "dropped-by-source"
  | "to-be-released";

export type ComicFromList = {
  status: ComicStatus;
  comicType: string;
  title: string;
  slug: string;
  lastChapter: number;
  rating: number;
  imageUrl: string;
  url: string;
};

export type Comic<ChapterType extends IncompleteChapter | Chapter> = ComicFromList & {
  firstChapter: number;
  chapters: ChapterType[];
};

export type IncompleteChapter = {
  number: number;
  title: string;
  url: string;
  publishedOn: Date;
};

export type Chapter = IncompleteChapter & {
  pageCount: number;
  pages: Page[];
};

export type Page = {
  number: number;
  imageUrl: string;
  url: string;
};
