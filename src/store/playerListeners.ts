// store/playerListeners.ts — Bridges Redux actions to imperative audio engine
//
// Listener middleware effects run synchronously inside dispatch(), so when a
// click handler dispatches togglePlay/playSongById/etc., the call to
// audioEngine.play() lands in the same task as the user gesture. That's what
// keeps browser autoplay policies happy.

import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { audioEngine } from "../audio/engine";
import {
  clearPlayback,
  next,
  pause,
  play,
  playSongById,
  previous,
  seekTo,
  selectNowPlaying,
  setVolume,
  syncAudioSource,
  toggleMute,
  togglePlay,
  trackEnded,
} from "./playerSlice";
import type { AppDispatch, RootState } from "./index";

export const playerListenerMiddleware = createListenerMiddleware();

const startListening = playerListenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

// 1. Sync <audio>.src whenever the now-playing track changes.
startListening({
  predicate: (_action, current, previous) => {
    const cur = selectNowPlaying(current);
    const prev = selectNowPlaying(previous);
    return cur?.id !== prev?.id || cur?.audioUrl !== prev?.audioUrl;
  },
  effect: (_action, api) => {
    const song = selectNowPlaying(api.getState());
    if (song?.audioUrl) audioEngine.setSrc(song.audioUrl);
    else audioEngine.clearSrc();
  },
});

// 2. Play / pause whenever isPlaying flips.
//    Runs in the same call stack as the user click, satisfying gesture policy.
startListening({
  matcher: isAnyOf(
    togglePlay,
    play,
    pause,
    playSongById,
    next,
    previous,
    trackEnded,
    clearPlayback,
  ),
  effect: (_action, api) => {
    const state = api.getState();
    const song = selectNowPlaying(state);
    if (state.player.isPlaying && song?.audioUrl) {
      // Build the Web Audio graph + resume the context inside the gesture.
      audioEngine.ensureGraph();
      audioEngine.resume();
      const promise = audioEngine.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch((err) => {
          console.warn("audio.play() rejected", err);
          api.dispatch(pause());
        });
      }
    } else {
      audioEngine.pause();
    }
  },
});

// 3. Volume + mute.
startListening({
  matcher: isAnyOf(setVolume, toggleMute),
  effect: (_action, api) => {
    const { volume, muted } = api.getState().player;
    audioEngine.setVolume(volume);
    audioEngine.setMuted(muted);
  },
});

// 4. Imperative seek — no state change, just drive the engine.
startListening({
  actionCreator: seekTo,
  effect: (action) => {
    audioEngine.seek(action.payload);
  },
});

// 5. External request to resync the source (e.g. after engine attach).
startListening({
  actionCreator: syncAudioSource,
  effect: (_action, api) => {
    const song = selectNowPlaying(api.getState());
    if (song?.audioUrl) audioEngine.setSrc(song.audioUrl);
  },
});
