import { Music, Users, Disc, ListMusic } from "lucide-react";
import styled from "@emotion/styled";
import css from "@styled-system/css";

const Grid = styled.div(
  css({
    display: "grid",
    gridTemplateColumns: [
      "1fr",
      "repeat(2, 1fr)",
      "repeat(3, 1fr)",
      "repeat(4, 1fr)",
    ],
    gap: 6,
  }),
);

export default function StatsView({ stats }: any) {
  return (
    <div>
      <div
        style={{
          marginBottom: "32px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.025em",
          }}
        >
          Library Statistics
        </h1>
        <p
          style={{
            color: "#64748b",
            marginTop: "6px",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Overview of your digital music collection
        </p>
      </div>

      <Grid>
        {[
          {
            label: "Total Tracks",
            value: stats.totalSongs,
            icon: Music,
            color: "#0055FF",
            bg: "#eff6ff",
          },
          {
            label: "Unique Artists",
            value: stats.artists,
            icon: Users,
            color: "#9333ea",
            bg: "#faf5ff",
          },
          {
            label: "Albums/EPs",
            value: stats.albums,
            icon: Disc,
            color: "#db2777",
            bg: "#fdf2f8",
          },
          {
            label: "Top Genre",
            value: stats.topGenre,
            icon: ListMusic,
            color: "#d97706",
            bg: "#fffbeb",
            textMd: true,
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: stat.bg,
                color: stat.color,
              }}
            >
              <stat.icon size={28} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: "2px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#0f172a",
                  fontSize: stat.textMd ? "20px" : "30px",
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </Grid>
    </div>
  );
}
