export type Source = "asura";

export type Bot = {
  scrape: () => Promise<void>;
  scrapeComics: () => Promise<CompleteComic[]>;
};

export type BotBySource = Record<Source, Bot>;

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

export type CompleteComic = ComicFromList & {
  firstChapter: number;
};
