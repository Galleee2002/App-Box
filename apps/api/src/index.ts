import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { listCapsules, syncCapsules } from "./capsules.js";
import { getPort, getSyncApiSecret } from "./env.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

app.use("/v1/*", async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token || token !== getSyncApiSecret()) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});

app.get("/v1/capsules", listCapsules);
app.post("/v1/capsules/sync", syncCapsules);

const port = getPort();

serve({ fetch: app.fetch, port }, () => {
  console.log(`Lovebox API listening on http://localhost:${port}`);
});
