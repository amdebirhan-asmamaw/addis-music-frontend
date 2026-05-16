import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Play, Pause, Edit2, Trash2 } from "lucide-react";

export const Card = styled.div(
  css({
    bg: "white",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
    border: "1px solid",
    borderColor: "#e2e8f0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s",
    position: "relative",
    height: "100%",
    "&:hover": { boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
    "&:hover .play-overlay": { opacity: 1 },
    "&:hover .card-img": { transform: "scale(1.05)" },
  }),
);
export const CardImageWrapper = styled.div(
  css({
    position: "relative",
    aspectRatio: "1",
    overflow: "hidden",
    bg: "#f1f5f9",
    borderRadius: "24px 24px 0 0",
  }),
);
export const CardImage = styled.img(
  css({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.7s ease-out",
  }),
);
export const Badge = styled.div(
  css({
    position: "absolute",
    top: 4,
    left: 4,
    bg: "white",
    px: "14px",
    py: "6px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#0f172a",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  }),
);
export const PlayOverlay = styled.div(
  css({
    position: "absolute",
    inset: 0,
    bg: "rgba(15, 23, 42, 0.25)",
    opacity: 0,
    transition: "opacity 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
);
export const PlayButton = styled.button(
  css({
    width: "48px",
    height: "48px",
    bg: "#0055FF",
    color: "white",
    borderRadius: "full",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    border: "none",
    cursor: "pointer",
    transform: "scale(0.9)",
    ".play-overlay &": { transform: "scale(1)" },
    "&:hover": { bg: "#3b82f6" },
  }),
);
export const IconButton = styled.button<{
  hoverColor: string;
  hoverBg: string;
  hoverBorder: string;
}>(({ hoverColor, hoverBg, hoverBorder }) =>
  css({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1.5px solid",
    borderColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    bg: "white",
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": { color: hoverColor, borderColor: hoverBorder, bg: hoverBg },
  }),
);
export const StatusBadge = styled.span<{ statusColor: string }>(({ statusColor }) =>
  css({
    flexShrink: 0,
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    px: "12px",
    py: "4px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    bg: statusColor.split(" ")[0],
    color: statusColor.split(" ")[1],
  }),
);
export const StatusDot = styled.div<{ dotColor: string }>(({ dotColor }) =>
  css({
    width: "6px",
    height: "6px",
    borderRadius: "full",
    bg: dotColor,
  }),
);

export default function SongCard({
  song,
  isPlaying,
  nowPlaying,
  playSong,
  handleOpenForm,
  confirmDelete,
  getStatusColor,
  getStatusDotColor,
}: any) {
  return (
    <Card>
      <CardImageWrapper>
        <CardImage
          src={song.image || "https://via.placeholder.com/600x600?text=No+Cover"}
          alt={song.title}
          className="card-img"
        />
        <Badge>{song.genre}</Badge>
        <PlayOverlay className="play-overlay">
          <PlayButton onClick={() => playSong(song)}>
            {isPlaying && nowPlaying?.id === song.id ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play
                size={20}
                fill="currentColor"
                style={{ marginLeft: "2px" }}
              />
            )}
          </PlayButton>
        </PlayOverlay>
      </CardImageWrapper>
      <div
        style={{
          padding: "16px 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <h3
            style={{
              fontWeight: 800,
              fontSize: "22px",
              color: "#0f172a",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={song.title}
          >
            {song.title}
          </h3>
          <StatusBadge statusColor={getStatusColor(song.status)}>
            <StatusDot dotColor={getStatusDotColor(song.status)} />
            {song.status}
          </StatusBadge>
        </div>
        <p
          style={{
            color: "#64748b",
            fontSize: "15px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
          }}
          title={`${song.artist} • ${song.album}`}
        >
          {song.artist} <span style={{ opacity: 0.5, margin: "0 4px" }}>•</span> {song.album}
        </p>
        
        <div
          style={{
            height: "1px",
            backgroundColor: "#f1f5f9",
            margin: "auto 0 20px",
            width: "100%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <IconButton
              hoverColor="#0055FF"
              hoverBg="#eff6ff"
              hoverBorder="#bfdbfe"
              onClick={() => handleOpenForm(song)}
              title="Edit Song"
            >
              <Edit2 size={18} strokeWidth={2} />
            </IconButton>
            <IconButton
              hoverColor="#dc2626"
              hoverBg="#fef2f2"
              hoverBorder="#fecaca"
              onClick={() => confirmDelete(song)}
              title="Delete Song"
            >
              <Trash2 size={18} strokeWidth={2} />
            </IconButton>
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "#f1f5f9",
              color: "#0f172a",
              padding: "8px 14px",
              borderRadius: "8px",
            }}
          >
            {song.duration || "--:--"}
          </span>
        </div>
      </div>
    </Card>
  );
}
