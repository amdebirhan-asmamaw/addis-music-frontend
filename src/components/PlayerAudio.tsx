// components/PlayerAudio.tsx — Headless <audio> + Web Audio engine driven by Redux

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearSeekRequest,
  pause,
  setCurrentTime,
  setDuration,
  trackEnded,
  selectNowPlaying,
} from "../store/playerSlice";
import { useAudioEngine } from "../contexts/AudioEngineContext";

export default function PlayerAudio() {
  const dispatch = useAppDispatch();
  const { audioRef, setAnalyser } = useAudioEngine();

  const nowPlaying = useAppSelector(selectNowPlaying);
  const isPlaying = useAppSelector((s) => s.player.isPlaying);
  const volume = useAppSelector((s) => s.player.volume);
  const muted = useAppSelector((s) => s.player.muted);
  const seekRequest = useAppSelector((s) => s.player.seekRequest);

  const localRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Lazily build the Web Audio graph on first play (requires user gesture).
  const ensureAudioGraph = () => {
    const audio = localRef.current;
    if (!audio) return;
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtor();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      sourceRef.current = source;
      analyserRef.current = analyser;
      setAnalyser(analyser);
    } catch (err) {
      console.warn("Web Audio graph init failed", err);
    }
  };

  // Sync source URL when the track changes.
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;
    if (!nowPlaying?.audioUrl) {
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    if (audio.src !== nowPlaying.audioUrl) {
      audio.src = nowPlaying.audioUrl;
      audio.load();
    }
  }, [nowPlaying?.audioUrl]);

  // Play / pause.
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;
    if (isPlaying && nowPlaying?.audioUrl) {
      ensureAudioGraph();
      const promise = audio.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch((err) => {
          console.warn("Audio play() rejected", err);
          dispatch(pause());
        });
      }
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, nowPlaying?.audioUrl]);

  // Volume + mute.
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  // Handle imperative seek requests from the slider.
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;
    if (seekRequest === null) return;
    if (Number.isFinite(seekRequest)) {
      audio.currentTime = seekRequest;
    }
    dispatch(clearSeekRequest());
  }, [seekRequest, dispatch]);

  // Wire up audio element events.
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;

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
    };
  }, [dispatch]);

  return (
    <audio
      ref={(el) => {
        localRef.current = el;
        audioRef.current = el;
      }}
      preload="metadata"
      crossOrigin="anonymous"
      style={{ display: "none" }}
    />
  );
}
