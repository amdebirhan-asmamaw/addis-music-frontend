// components/PlayerAudio.tsx — Mounts the singleton <audio> element
//
// Side effects (play/pause/seek/volume/src) are driven by the listener
// middleware in store/playerListeners.ts via audioEngine. This component
// only owns:
//   1. The <audio> DOM element + its lifecycle in the React tree
//   2. Wiring audio events back into Redux (timeupdate, ended, etc.)
//   3. Telling the engine to reload the src after attach

import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  pause,
  setCurrentTime,
  setDuration,
  syncAudioSource,
  trackEnded,
} from "../store/playerSlice";
import { audioEngine } from "../audio/engine";

export default function PlayerAudio() {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    audioEngine.attachElement(audio);
    // If a song was already selected before this component mounted, ask the
    // engine to load it.
    dispatch(syncAudioSource());

    const onTime = () => dispatch(setCurrentTime(audio.currentTime));
    const onLoaded = () => dispatch(setDuration(audio.duration || 0));
    const onEnded = () => dispatch(trackEnded());
    const onError = () => {
      console.warn("Audio element error", audio.error);
      dispatch(pause());
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioEngine.attachElement(null);
    };
  }, [dispatch]);

  return <audio ref={ref} preload="metadata" style={{ display: "none" }} />;
}
