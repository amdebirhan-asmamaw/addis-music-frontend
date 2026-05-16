// types/song.ts — Core domain types for the application

export type SongStatus = "LIVE" | "PROCESSING" | "DRAFT";

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  status: SongStatus;
  image: string;
  releaseYear: number;
  description: string;
}

export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  releaseYear: number;
  description: string;
  image: string;
}

export interface SongFormErrors {
  title?: string;
  artist?: string;
  genre?: string;
}

export interface SongStats {
  totalSongs: number;
  artists: number;
  albums: number;
  genres: number;
  topGenre: string;
}

export interface StatusConfig {
  badge: string;
  dot: string;
}
