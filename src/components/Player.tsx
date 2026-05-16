// components/Player.tsx — Spotify-style player bar wired to Redux

import styled from "@emotion/styled";
import css from "@styled-system/css";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  next,
  previous,
  requestSeek,
  setVolume,
  toggleMute,
  togglePlay,
  selectNowPlaying,
} from "../store/playerSlice";
import { formatTime } from "../utils/format";
import Waveform from "./Waveform";

const StyledPlayerFooter = styled.footer(
  css({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    bg: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid",
    borderColor: "#e2e8f0",
    zIndex: 40,
    px: [4, 6],
    py: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 -10px 30px -15px rgba(0,0,0,0.1)",
  }),
);

const IconBtn = styled.button<{ dim?: boolean }>(({ dim }) =>
  css({
    color: dim ? "#cbd5e1" : "#475569",
    background: "none",
    border: "none",
    cursor: dim ? "not-allowed" : "pointer",
    p: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:disabled": { color: "#cbd5e1", cursor: "not-allowed" },
  }),
);

const SeekRange = styled.input(
  css({
    flex: 1,
    height: "6px",
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
    "&::-webkit-slider-runnable-track": {
      height: "6px",
      borderRadius: "9999px",
      bg: "#e2e8f0",
    },
    "&::-moz-range-track": {
      height: "6px",
      borderRadius: "9999px",
      bg: "#e2e8f0",
    },
    "&::-webkit-slider-thumb": {
      appearance: "none",
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      bg: "#0055FF",
      border: "2px solid white",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      marginTop: "-4px",
      cursor: "pointer",
    },
    "&::-moz-range-thumb": {
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      bg: "#0055FF",
      border: "2px solid white",
      cursor: "pointer",
    },
  }),
);

const VolumeRange = styled.input(
  css({
    width: "120px",
    height: "6px",
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
    "&::-webkit-slider-runnable-track": {
      height: "6px",
      borderRadius: "9999px",
      bg: "#e2e8f0",
    },
    "&::-moz-range-track": {
      height: "6px",
      borderRadius: "9999px",
      bg: "#e2e8f0",
    },
    "&::-webkit-slider-thumb": {
      appearance: "none",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      bg: "#64748b",
      border: "2px solid white",
      marginTop: "-3px",
      cursor: "pointer",
    },
    "&::-moz-range-thumb": {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      bg: "#64748b",
      border: "2px solid white",
      cursor: "pointer",
    },
  }),
);

export default function AppPlayer() {
  const dispatch = useAppDispatch();
  const nowPlaying = useAppSelector(selectNowPlaying);
  const isPlaying = useAppSelector((s) => s.player.isPlaying);
  const currentTime = useAppSelector((s) => s.player.currentTime);
  const duration = useAppSelector((s) => s.player.duration);
  const volume = useAppSelector((s) => s.player.volume);
  const muted = useAppSelector((s) => s.player.muted);
  const currentIndex = useAppSelector((s) => s.player.currentIndex);
  const queueLength = useAppSelector((s) => s.player.queue.length);

  if (!nowPlaying) return null;

  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < queueLength - 1;
  const effectiveDuration = duration > 0 ? duration : 0;

  return (
    <StyledPlayerFooter>
      {/* Left third — now playing */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "33.333%",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#f1f5f9",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={nowPlaying.image}
            alt={nowPlaying.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ overflow: "hidden" }}>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {nowPlaying.title}
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {nowPlaying.artist}
          </p>
        </div>
      </div>

      {/* Center third — controls + waveform + seek */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "33.333%",
          maxWidth: "512px",
          flexShrink: 0,
          gap: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "2px",
          }}
        >
          <IconBtn dim title="Shuffle (coming soon)" disabled>
            <Shuffle size={16} />
          </IconBtn>
          <IconBtn
            onClick={() => dispatch(previous())}
            disabled={!canPrev && currentTime <= 3}
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </IconBtn>
          <button
            onClick={() => dispatch(togglePlay())}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>
          <IconBtn
            onClick={() => dispatch(next())}
            disabled={!canNext}
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </IconBtn>
          <IconBtn dim title="Repeat (coming soon)" disabled>
            <Repeat size={16} />
          </IconBtn>
        </div>

        <div style={{ width: "100%" }}>
          <Waveform width={360} height={28} barCount={48} />
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "11px",
            fontWeight: 500,
            color: "#64748b",
          }}
        >
          <span style={{ minWidth: "32px" }}>{formatTime(currentTime)}</span>
          <SeekRange
            type="range"
            min={0}
            max={effectiveDuration || 1}
            step={0.1}
            value={Math.min(currentTime, effectiveDuration || currentTime)}
            disabled={effectiveDuration === 0}
            onChange={(e) => dispatch(requestSeek(Number(e.target.value)))}
          />
          <span style={{ minWidth: "32px", textAlign: "right" }}>
            {formatTime(effectiveDuration)}
          </span>
        </div>
      </div>

      {/* Right third — volume + extras */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "16px",
          width: "33.333%",
          color: "#64748b",
        }}
      >
        <IconBtn onClick={() => dispatch(toggleMute())} title={muted ? "Unmute" : "Mute"}>
          {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </IconBtn>
        <VolumeRange
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
        />
        <IconBtn dim disabled title="Queue (coming soon)">
          <ListMusic size={20} />
        </IconBtn>
        <IconBtn dim disabled title="Fullscreen (coming soon)">
          <Maximize2 size={20} />
        </IconBtn>
      </div>
    </StyledPlayerFooter>
  );
}
