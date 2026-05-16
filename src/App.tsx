// App.tsx — Root layout with routing

import { useState, useCallback } from "react";
import { Outlet } from "react-router";
import { Global, css as globalCss } from "@emotion/react";
import styled from "@emotion/styled";
import css from "@styled-system/css";

import AppHeader from "./components/Header";
import AppPlayer from "./components/Player";
import { useSongPlayer } from "./hooks/useSongPlayer";
import { INITIAL_SONGS } from "./constants/songs";
import { colors } from "./constants/theme";

// ─── Styled Components ──────────────────────────────────────────────

const AppContainer = styled.div(
  css({
    minHeight: "100vh",
    bg: colors.pageBg,
    display: "flex",
    flexDirection: "column",
    color: colors.slate900,
    pb: "120px",
  }),
);

const Main = styled.main(
  css({
    flex: 1,
    maxWidth: "1440px",
    width: "100%",
    mx: "auto",
    px: "32px",
    py: "32px",
  }),
);

// ─── Global Reset ───────────────────────────────────────────────────

const globalStyles = globalCss`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    overflow-x: hidden;
  }
`;

// ─── App Layout ─────────────────────────────────────────────────────

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const player = useSongPlayer(INITIAL_SONGS[0]);

  const handleOpenForm = useCallback(() => {
    // Dispatch a custom event that SongsPage listens to
    window.dispatchEvent(new CustomEvent("open-song-form"));
  }, []);

  return (
    <AppContainer>
      <Global styles={globalStyles} />

      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleOpenForm={handleOpenForm}
      />

      <Main>
        <Outlet context={{ searchQuery, player }} />
      </Main>

      {player.nowPlaying && (
        <AppPlayer
          nowPlaying={player.nowPlaying}
          isPlaying={player.isPlaying}
          setIsPlaying={player.setIsPlaying}
        />
      )}
    </AppContainer>
  );
}
