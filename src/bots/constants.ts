import type { ComicStatus } from "./types";

export const TIMEOUTS_IN_MS = {
  LINK_CLICK: 500,
};

export const statusMap: Record<string, ComicStatus> = {
  completed: "finished",
  dropped: "dropped-by-source",
  hiatus: "paused",
  ongoing: "on-going",
  "season-end": "paused",
};
