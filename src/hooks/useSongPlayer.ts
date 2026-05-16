// hooks/useSongPlayer.ts — Encapsulates playback state

import { useState, useCallback } from "react";
import type { Song } from "../types/song";

interface SongPlayerState {
  nowPlaying: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  stopIfDeleted: (deletedId: number) => void;
}

export function useSongPlayer(initialSong: Song | null = null): SongPlayerState {
  const [nowPlaying, setNowPlaying] = useState<Song | null>(initialSong);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = useCallback(
    (song: Song) => {
      if (nowPlaying?.id === song.id) {
        setIsPlaying((prev) => !prev);
      } else {
        setNowPlaying(song);
        setIsPlaying(true);
      }
    },
    [nowPlaying?.id],
  );

  const stopIfDeleted = useCallback(
    (deletedId: number) => {
      if (nowPlaying?.id === deletedId) {
        setNowPlaying(null);
        setIsPlaying(false);
      }
    },
    [nowPlaying?.id],
  );

  return { nowPlaying, isPlaying, playSong, setIsPlaying, stopIfDeleted };
}
