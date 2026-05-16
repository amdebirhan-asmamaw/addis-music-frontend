// store/songsSlice.ts — Server-state for the songs collection
//
// Pure reducers + bare-action triggers consumed by songsSaga. Per-action
// busy flags (creating/updating/deleting) drive UI spinners on the
// matching buttons without coupling the global `status` to mutations.

import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../types/song";
import type { SongTextPayload } from "../api/songApi";
import type { RootState } from "./index";

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

export interface SongsState {
  items: Song[];
  status: LoadStatus;
  loadError: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  actionError: string | null;
}

const initialState: SongsState = {
  items: [],
  status: "idle",
  loadError: null,
  creating: false,
  updating: false,
  deleting: false,
  actionError: null,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsPending(state) {
      state.status = "loading";
      state.loadError = null;
    },
    fetchSongsSucceeded(state, action: PayloadAction<Song[]>) {
      state.status = "succeeded";
      state.items = action.payload;
      state.loadError = null;
    },
    fetchSongsFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.loadError = action.payload;
    },

    createSongPending(state) {
      state.creating = true;
      state.actionError = null;
    },
    createSongSucceeded(state, action: PayloadAction<Song>) {
      state.creating = false;
      state.items = [action.payload, ...state.items];
    },
    createSongFailed(state, action: PayloadAction<string>) {
      state.creating = false;
      state.actionError = action.payload;
    },

    updateSongPending(state) {
      state.updating = true;
      state.actionError = null;
    },
    updateSongSucceeded(state, action: PayloadAction<Song>) {
      state.updating = false;
      const idx = state.items.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    updateSongFailed(state, action: PayloadAction<string>) {
      state.updating = false;
      state.actionError = action.payload;
    },

    deleteSongPending(state) {
      state.deleting = true;
      state.actionError = null;
    },
    deleteSongSucceeded(state, action: PayloadAction<string>) {
      state.deleting = false;
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
    deleteSongFailed(state, action: PayloadAction<string>) {
      state.deleting = false;
      state.actionError = action.payload;
    },

    clearActionError(state) {
      state.actionError = null;
    },
  },
});

export const {
  fetchSongsPending,
  fetchSongsSucceeded,
  fetchSongsFailed,
  createSongPending,
  createSongSucceeded,
  createSongFailed,
  updateSongPending,
  updateSongSucceeded,
  updateSongFailed,
  deleteSongPending,
  deleteSongSucceeded,
  deleteSongFailed,
  clearActionError,
} = songsSlice.actions;

export default songsSlice.reducer;

// ─── Saga-only trigger actions (no reducer) ────────────────────────
//
// These carry File payloads, which Redux Toolkit's serializableCheck
// would normally flag. They never land in state — sagas consume them and
// dispatch the pending/succeeded/failed reducer actions above. The store
// adds these types to `ignoredActions`.

export interface CreateSongPayload {
  text: SongTextPayload;
  imageFile?: File | null;
  audioFile?: File | null;
}

export interface UpdateSongPayload {
  id: string;
  text: Partial<SongTextPayload>;
  imageFile?: File | null;
  audioFile?: File | null;
}

export const fetchSongs = createAction("songs/fetchSongs");
export const createSong = createAction<CreateSongPayload>("songs/createSong");
export const updateSong = createAction<UpdateSongPayload>("songs/updateSong");
export const deleteSong = createAction<string>("songs/deleteSong");

// ─── Selectors ─────────────────────────────────────────────────────

export const selectSongs = (state: RootState) => state.songs.items;
export const selectSongsStatus = (state: RootState) => state.songs.status;
export const selectSongsLoadError = (state: RootState) =>
  state.songs.loadError;
export const selectSongsCreating = (state: RootState) => state.songs.creating;
export const selectSongsUpdating = (state: RootState) => state.songs.updating;
export const selectSongsDeleting = (state: RootState) => state.songs.deleting;
export const selectSongsActionError = (state: RootState) =>
  state.songs.actionError;
