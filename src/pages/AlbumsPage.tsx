// pages/AlbumsPage.tsx — Albums listing page

import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Disc } from "lucide-react";
import { useMemo } from "react";

import { INITIAL_SONGS } from "../constants/songs";
import { colors, fontSizes, fontWeights } from "../constants/theme";

// ─── Types ──────────────────────────────────────────────────────────

interface Album {
  name: string;
  artist: string;
  songCount: number;
  image: string;
  genre: string;
}

// ─── Styled Components ──────────────────────────────────────────────

const PageHeader = styled.div(
  css({
    marginBottom: "32px",
    borderBottom: "1px solid",
    borderColor: colors.slate200,
    paddingBottom: "24px",
  }),
);

const PageTitle = styled.h1(
  css({
    fontSize: "42px",
    fontWeight: fontWeights.bold,
    color: colors.slate900,
    margin: 0,
    letterSpacing: "-0.025em",
  }),
);

const PageSubtitle = styled.p(
  css({
    color: colors.slate500,
    marginTop: "6px",
    fontSize: fontSizes.base,
    margin: 0,
    mt: "6px",
  }),
);

const Grid = styled.div(
  css({
    display: "grid",
    gridTemplateColumns: [
      "1fr",
      "repeat(2, 1fr)",
      "repeat(3, 1fr)",
      "repeat(4, 1fr)",
    ],
    gap: "24px",
  }),
);

const AlbumCard = styled.div(
  css({
    bg: colors.cardBg,
    borderRadius: "16px",
    border: "1px solid",
    borderColor: colors.slate200,
    overflow: "hidden",
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-2px)",
    },
  }),
);

const AlbumImageWrapper = styled.div(
  css({
    aspectRatio: "1",
    overflow: "hidden",
    bg: colors.slate100,
    position: "relative",
  }),
);

const AlbumImage = styled.img(
  css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease-out",
    "&:hover": { transform: "scale(1.05)" },
  }),
);

const AlbumInfo = styled.div(
  css({
    p: "16px 20px",
  }),
);

const AlbumName = styled.h3(
  css({
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    color: colors.slate900,
    margin: 0,
    mb: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
);

const AlbumArtist = styled.p(
  css({
    color: colors.slate500,
    fontSize: fontSizes.base,
    margin: 0,
    mb: "8px",
  }),
);

const AlbumMeta = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: "8px",
    pt: "8px",
    borderTop: "1px solid",
    borderColor: colors.slate100,
  }),
);

const GenreBadge = styled.span(
  css({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary,
    bg: colors.primaryLight,
    px: "10px",
    py: "4px",
    borderRadius: "9999px",
  }),
);

const SongCount = styled.span(
  css({
    fontSize: fontSizes.sm,
    color: colors.slate400,
    fontWeight: fontWeights.medium,
  }),
);

// ─── Component ──────────────────────────────────────────────────────

export default function AlbumsPage() {
  const albums = useMemo<Album[]>(() => {
    const albumMap = new Map<string, Album>();

    for (const song of INITIAL_SONGS) {
      if (!song.album) continue;
      const existing = albumMap.get(song.album);
      if (existing) {
        existing.songCount++;
      } else {
        albumMap.set(song.album, {
          name: song.album,
          artist: song.artist,
          songCount: 1,
          image: song.image,
          genre: song.genre,
        });
      }
    }

    return Array.from(albumMap.values());
  }, []);

  return (
    <div>
      <PageHeader>
        <PageTitle>Albums</PageTitle>
        <PageSubtitle>
          Browse your collection of {albums.length} albums
        </PageSubtitle>
      </PageHeader>

      <Grid>
        {albums.map((album) => (
          <AlbumCard key={album.name}>
            <AlbumImageWrapper>
              <AlbumImage src={album.image} alt={album.name} />
            </AlbumImageWrapper>
            <AlbumInfo>
              <AlbumName title={album.name}>{album.name}</AlbumName>
              <AlbumArtist>{album.artist}</AlbumArtist>
              <AlbumMeta>
                <GenreBadge>{album.genre}</GenreBadge>
                <SongCount>
                  <Disc size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  {album.songCount} {album.songCount === 1 ? "track" : "tracks"}
                </SongCount>
              </AlbumMeta>
            </AlbumInfo>
          </AlbumCard>
        ))}
      </Grid>
    </div>
  );
}
