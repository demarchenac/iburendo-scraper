import { serve } from "@hono/node-server";
import { Hono } from "hono";
import botRouter from "./routes/bot";

const port = 3000;

const app = new Hono();

app.get("/", (c) => {
  return c.json({ success: true });
});

app.route("/bots", botRouter);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
