import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, ListMusic, Maximize2 } from "lucide-react";

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

export default function AppPlayer({ nowPlaying, isPlaying, setIsPlaying }: any) {
  if (!nowPlaying) return null;
  return (
    <StyledPlayerFooter>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "33.333%",
          maxWidth: "512px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "6px",
          }}
        >
          <button
            style={{
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Shuffle size={16} />
          </button>
          <button
            style={{
              color: "#475569",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play
                size={24}
                fill="currentColor"
                style={{ marginLeft: "2px" }}
              />
            )}
          </button>
          <button
            style={{
              color: "#475569",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button
            style={{
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Repeat size={16} />
          </button>
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
          <span>{isPlaying ? "0:24" : "0:00"}</span>
          <div
            style={{
              flex: 1,
              height: "8px",
              backgroundColor: "#e2e8f0",
              borderRadius: "9999px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                backgroundColor: "#0055FF",
                borderRadius: "9999px",
                width: isPlaying ? "25%" : "0%",
              }}
            ></div>
          </div>
          <span>{nowPlaying.duration}</span>
        </div>
      </div>
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
        <button
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <Volume2 size={20} />
        </button>
        <div
          style={{
            width: "120px",
            height: "6px",
            backgroundColor: "#e2e8f0",
            borderRadius: "9999px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              backgroundColor: "#64748b",
              borderRadius: "9999px",
              width: "66%",
            }}
          ></div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <ListMusic size={20} />
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </StyledPlayerFooter>
  );
}
