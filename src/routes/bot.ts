import { Hono } from "hono";
import { bots, type SourceSlug } from "../bots";

const bot = new Hono();

bot.post("/:bot/scrape/comics", async (c) => {
  const bot = c.req.param("bot") as SourceSlug;
  const headless = c.req.query("headless") !== undefined;
  const isHeadless = Boolean(headless);

  if (!(bot in bots)) {
    return c.json({ success: false, error: "provided bot is not implemented" });
  }

  const source = await bots[bot].scrapeSource(isHeadless);
  const comics = await bots[bot].scrapeComics(isHeadless);

  return c.json({ success: true, data: { source, comics } });
});

export default bot;
