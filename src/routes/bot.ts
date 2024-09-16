import { Hono } from "hono";
import { bots, type Source } from "../bots";

const bot = new Hono();

bot.post("/:bot/scrape/comics", async (c) => {
  const bot = c.req.param("bot") as Source;
  const headless = typeof c.req.query("headless") !== undefined;

  if (!(bot in bots)) {
    return c.json({ success: false, error: "provided bot is not implemented" });
  }

  const comics = await bots[bot].scrapeComics(Boolean(headless));

  return c.json({ success: true, data: { bot, comics } });
});

export default bot;
