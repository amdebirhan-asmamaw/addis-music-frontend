// App.tsx — Root layout with routing

import { useState } from "react";
import { Outlet } from "react-router";
import { Global, css as globalCss } from "@emotion/react";
import styled from "@emotion/styled";
import css from "@styled-system/css";

import AppHeader from "./components/Header";
import AppPlayer from "./components/Player";
import PlayerAudio from "./components/PlayerAudio";
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
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 0.9s linear infinite;
  }
`;

// ─── App Layout ─────────────────────────────────────────────────────

export interface AppOutletContext {
  searchQuery: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppContainer>
      <Global styles={globalStyles} />

      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Main>
        <Outlet context={{ searchQuery } satisfies AppOutletContext} />
      </Main>

      <PlayerAudio />
      <AppPlayer />
    </AppContainer>
  );
}
