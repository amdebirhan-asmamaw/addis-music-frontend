// hooks/useSongStats.ts — Computed statistics from song list

import { useMemo } from "react";
import type { Song, SongStats } from "../types/song";

export function useSongStats(songs: Song[]): SongStats {
  return useMemo(() => {
    const uniqueArtists = new Set(songs.map((s) => s.artist)).size;
    const uniqueAlbums = new Set(songs.map((s) => s.album).filter(Boolean)).size;
    const uniqueGenres = new Set(songs.map((s) => s.genre)).size;

    const genreCounts = songs.reduce<Record<string, number>>((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1;
      return acc;
    }, {});

    const mostCommonGenre =
      Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      totalSongs: songs.length,
      artists: uniqueArtists,
      albums: uniqueAlbums,
      genres: uniqueGenres,
      topGenre: mostCommonGenre,
    };
  }, [songs]);
}
