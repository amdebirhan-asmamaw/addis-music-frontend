// api/songApi.ts — Thin typed wrapper around the Songs REST API.
//
// All endpoints return the standard envelope:
//   { success: boolean; message: string; data?: T; error?: string | string[] }
// `request<T>` unwraps `data`, normalises errors, and surfaces a single
// `ApiError` type so sagas don't have to massage HTTP details.

import type { Song } from "../types/song";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:7000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | string[];
}

export class ApiError extends Error {
  status: number;
  details?: string | string[];

  constructor(message: string, status: number, details?: string | string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : "Network error",
      0,
    );
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // No body or invalid JSON
  }

  if (!res.ok || !envelope?.success) {
    throw new ApiError(
      envelope?.message ?? `Request failed (${res.status})`,
      res.status,
      envelope?.error,
    );
  }

  return envelope.data as T;
}

// ─── Payload shapes ────────────────────────────────────────────────

export interface SongTextPayload {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: string;
  status?: "LIVE" | "PROCESSING" | "DRAFT";
  releaseYear?: number;
  description?: string;
}

export interface SongFilesPayload {
  image?: File | null;
  audio?: File | null;
}

function buildFormData(
  text: Partial<SongTextPayload>,
  files: SongFilesPayload,
): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(text)) {
    if (value === undefined || value === null || value === "") continue;
    fd.append(key, String(value));
  }
  if (files.image) fd.append("image", files.image);
  if (files.audio) fd.append("audio", files.audio);
  return fd;
}

// ─── Endpoints ─────────────────────────────────────────────────────

export const songApi = {
  list: (): Promise<Song[]> => request<Song[]>("/songs"),

  getById: (id: string): Promise<Song> => request<Song>(`/songs/${id}`),

  create: (text: SongTextPayload, files: SongFilesPayload): Promise<Song> =>
    request<Song>("/songs", {
      method: "POST",
      body: buildFormData(text, files),
    }),

  update: (
    id: string,
    text: Partial<SongTextPayload>,
    files: SongFilesPayload,
  ): Promise<Song> =>
    request<Song>(`/songs/${id}`, {
      method: "PUT",
      body: buildFormData(text, files),
    }),

  remove: (id: string): Promise<Song> =>
    request<Song>(`/songs/${id}`, { method: "DELETE" }),
};
