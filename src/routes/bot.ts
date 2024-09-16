import { Hono } from "hono";
import { bots, type SourceSlug } from "../bots";
import { db } from "../db";
import { sources as SourcesTable } from "../db/schema";
const bot = new Hono();

bot.post("/:bot/scrape/comics", async (c) => {
  const bot = c.req.param("bot") as SourceSlug;
  const headless = c.req.query("headless") !== undefined;
  const isHeadless = Boolean(headless);

  if (!(bot in bots)) {
    return c.json({ success: false, error: "provided bot is not implemented" });
  }

  const { data: scrapedSource, wasScraped: sourceWasScraped } = await bots[bot].scrapeSource(
    isHeadless
  );
  const comics = await bots[bot].scrapeComics(isHeadless);

  let source: any = scrapedSource;
  if (sourceWasScraped) source = await db.insert(SourcesTable).values(scrapedSource).returning();

  return c.json({ success: true, data: { source, comics } });
});

export default bot;
