// types/song.ts — Core domain types for the application

export type SongStatus = "LIVE" | "PROCESSING" | "DRAFT";

export interface CloudinaryAsset {
  url: string;
  id: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  status: SongStatus;
  image: CloudinaryAsset | null;
  releaseYear: number;
  description: string;
  audioUrl: CloudinaryAsset | null;
  createdAt?: string;
  updatedAt?: string;
}

// Form-side shape — text fields + optional File objects for new uploads.
export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  releaseYear: number;
  description: string;
  status: SongStatus;
  imageFile: File | null;
  audioFile: File | null;
  // Preview URLs (object URLs for new files or existing Cloudinary URLs).
  imagePreview: string;
  audioPreview: string;
}

export interface SongFormErrors {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: string;
  releaseYear?: string;
  status?: string;
  imageFile?: string;
  audioFile?: string;
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
