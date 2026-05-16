// store/playerSlice.ts — Global music player state

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../types/song";

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  seekRequest: number | null;
}

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  seekRequest: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setQueue(state, action: PayloadAction<Song[]>) {
      state.queue = action.payload;
      if (state.currentIndex >= 0) {
        const current = state.queue[state.currentIndex];
        const idx = action.payload.findIndex((s) => s.id === current?.id);
        state.currentIndex = idx;
        if (idx === -1) {
          state.isPlaying = false;
          state.currentTime = 0;
          state.duration = 0;
        }
      }
    },
    playSongById(state, action: PayloadAction<number>) {
      const idx = state.queue.findIndex((s) => s.id === action.payload);
      if (idx === -1) return;
      if (state.currentIndex === idx) {
        state.isPlaying = !state.isPlaying;
      } else {
        state.currentIndex = idx;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = 0;
      }
    },
    togglePlay(state) {
      if (state.currentIndex >= 0) state.isPlaying = !state.isPlaying;
    },
    play(state) {
      if (state.currentIndex >= 0) state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    next(state) {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = 0;
      } else {
        state.isPlaying = false;
      }
    },
    previous(state) {
      if (state.currentTime > 3 && state.currentIndex >= 0) {
        state.seekRequest = 0;
        return;
      }
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = 0;
      }
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(1, action.payload));
      if (state.volume > 0) state.muted = false;
    },
    toggleMute(state) {
      state.muted = !state.muted;
    },
    requestSeek(state, action: PayloadAction<number>) {
      state.seekRequest = action.payload;
    },
    clearSeekRequest(state) {
      state.seekRequest = null;
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    trackEnded(state) {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = 0;
      } else {
        state.isPlaying = false;
        state.currentTime = 0;
      }
    },
    clearPlayback(state) {
      state.currentIndex = -1;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
    },
  },
});

export const {
  setQueue,
  playSongById,
  togglePlay,
  play,
  pause,
  next,
  previous,
  setVolume,
  toggleMute,
  requestSeek,
  clearSeekRequest,
  setCurrentTime,
  setDuration,
  trackEnded,
  clearPlayback,
} = playerSlice.actions;

export default playerSlice.reducer;

// ─── Selectors ──────────────────────────────────────────────────────

import type { RootState } from "./index";

export const selectPlayer = (state: RootState) => state.player;

export const selectNowPlaying = (state: RootState) => {
  const { queue, currentIndex } = state.player;
  return currentIndex >= 0 ? queue[currentIndex] ?? null : null;
};

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;

export const selectQueueLength = (state: RootState) => state.player.queue.length;
