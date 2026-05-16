// constants/genres.ts — Available genre options

export const GENRES = [
  "All",
  "Electronic",
  "Jazz Fusion",
  "Industrial",
  "Ambient",
  "Progressive",
  "Rock",
  "Pop",
  "Hip Hop",
  "Classical",
] as const;

/** Genres available for form selection (excludes "All") */
export const SELECTABLE_GENRES = GENRES.filter((g) => g !== "All");

export type Genre = (typeof GENRES)[number];
