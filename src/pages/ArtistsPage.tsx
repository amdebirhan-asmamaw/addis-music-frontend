// pages/ArtistsPage.tsx — Artists listing page

import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Music, Disc } from "lucide-react";
import { useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSongs,
  selectSongs,
  selectSongsStatus,
} from "../store/songsSlice";
import { colors, fontSizes, fontWeights } from "../constants/theme";

// ─── Types ──────────────────────────────────────────────────────────

interface Artist {
  name: string;
  songCount: number;
  albumCount: number;
  genres: string[];
  image: string;
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

const ArtistCard = styled.div(
  css({
    bg: colors.cardBg,
    borderRadius: "16px",
    border: "1px solid",
    borderColor: colors.slate200,
    p: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-2px)",
    },
  }),
);

const ArtistAvatar = styled.div(
  css({
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    overflow: "hidden",
    mb: "16px",
    border: "3px solid",
    borderColor: colors.slate200,
    bg: colors.slate100,
  }),
);

const ArtistAvatarImg = styled.img(
  css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }),
);

const ArtistName = styled.h3(
  css({
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.xl,
    color: colors.slate900,
    margin: 0,
    mb: "8px",
  }),
);

const StatsRow = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    mt: "4px",
    mb: "12px",
  }),
);

const StatItem = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: fontSizes.sm,
    color: colors.slate500,
    fontWeight: fontWeights.medium,
  }),
);

const GenreTags = styled.div(
  css({
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    justifyContent: "center",
  }),
);

const GenreTag = styled.span(
  css({
    fontSize: "12px",
    fontWeight: fontWeights.medium,
    color: colors.primary,
    bg: colors.primaryLight,
    px: "10px",
    py: "3px",
    borderRadius: "9999px",
  }),
);

// ─── Component ──────────────────────────────────────────────────────

export default function ArtistsPage() {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongs);
  const status = useAppSelector(selectSongsStatus);

  useEffect(() => {
    if (status === "idle") dispatch(fetchSongs());
  }, [dispatch, status]);

  const artists = useMemo<Artist[]>(() => {
    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      const existing = artistMap.get(song.artist);
      if (existing) {
        existing.songCount++;
        if (!existing.genres.includes(song.genre)) {
          existing.genres.push(song.genre);
        }
        const albums = new Set(
          songs
            .filter((s) => s.artist === song.artist && s.album)
            .map((s) => s.album),
        );
        existing.albumCount = albums.size;
      } else {
        artistMap.set(song.artist, {
          name: song.artist,
          songCount: 1,
          albumCount: song.album ? 1 : 0,
          genres: [song.genre],
          image: song.image?.url ?? "",
        });
      }
    }

    return Array.from(artistMap.values());
  }, [songs]);

  return (
    <div>
      <PageHeader>
        <PageTitle>Artists</PageTitle>
        <PageSubtitle>
          Discover {artists.length} artists in your library
        </PageSubtitle>
      </PageHeader>

      <Grid>
        {artists.map((artist) => (
          <ArtistCard key={artist.name}>
            <ArtistAvatar>
              <ArtistAvatarImg src={artist.image} alt={artist.name} />
            </ArtistAvatar>
            <ArtistName>{artist.name}</ArtistName>
            <StatsRow>
              <StatItem>
                <Music size={14} />
                {artist.songCount} {artist.songCount === 1 ? "song" : "songs"}
              </StatItem>
              <StatItem>
                <Disc size={14} />
                {artist.albumCount} {artist.albumCount === 1 ? "album" : "albums"}
              </StatItem>
            </StatsRow>
            <GenreTags>
              {artist.genres.map((genre) => (
                <GenreTag key={genre}>{genre}</GenreTag>
              ))}
            </GenreTags>
          </ArtistCard>
        ))}
      </Grid>
    </div>
  );
}
