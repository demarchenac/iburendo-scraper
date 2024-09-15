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

export const monthMap: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};
