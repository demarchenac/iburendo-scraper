import { asura } from "./bots/asura";

export async function scrape() {
  await asura.scrapeComics();
}

scrape();
