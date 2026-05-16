// components/Header.tsx — App header with router navigation + song form

import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import css from "@styled-system/css";
import { NavLink, useLocation } from "react-router";
import { Music, BarChart2, Disc, Users, Search, Plus } from "lucide-react";

import SongFormModal from "./SongFormModal";
import { GENRES } from "../constants/genres";
import { DEFAULT_FORM_STATE, songFormSchema } from "../constants/forms";
import type { Song, SongFormData, SongFormErrors } from "../types/song";

// ─── Styled Components ──────────────────────────────────────────────

const Header = styled.header(
  css({
    bg: "white",
    borderBottom: "1px solid",
    borderColor: "#e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 30,
  }),
);

const HeaderContent = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 6,
    py: 3,
    maxWidth: "1600px",
    width: "100%",
    mx: "auto",
  }),
);

const LogoGroup = styled.div(
  css({ display: "flex", alignItems: "center", gap: "12px" }),
);

const Logo = styled(NavLink)(
  css({
    display: "flex",
    alignItems: "center",
    gap: 2,
    color: "#0055FF",
    fontWeight: 700,
    fontSize: "28px",
    letterSpacing: "tight",
    cursor: "pointer",
    textDecoration: "none",
  }),
);

const Nav = styled.nav(
  css({ display: ["none", "none", "flex"], alignItems: "center", gap: 1 }),
);

const StyledNavItem = styled(NavLink)<{ "data-active"?: string }>(
  (props) =>
    css({
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: "20px",
      py: "10px",
      borderRadius: "14px",
      fontSize: "14px",
      fontWeight: 500,
      transition: "all 0.2s",
      textDecoration: "none",
      bg: props["data-active"] === "true" ? "#0055FF" : "transparent",
      color: props["data-active"] === "true" ? "white" : "#475569",
      boxShadow:
        props["data-active"] === "true"
          ? "0 4px 6px -1px rgba(0, 85, 255, 0.2)"
          : "none",
      border: "none",
      cursor: "pointer",
      "&:hover": {
        bg: props["data-active"] === "true" ? "#0055FF" : "#f1f5f9",
      },
    }),
);

const HeaderActions = styled.div(
  css({ display: "flex", alignItems: "center", gap: 4 }),
);

const SearchWrapper = styled.div(
  css({
    position: "relative",
    display: ["none", "none", "none", "block"],
    "&:focus-within svg": { color: "#0055FF" },
  }),
);

export const SearchInput = styled.input(
  css({
    width: "220px",
    height: "40px",
    pl: "36px",
    pr: 4,
    borderRadius: "9999px",
    border: "1px solid transparent",
    bg: "#f8fafc",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
    "&::placeholder": { color: "#94a3b8" },
    "&:focus": {
      bg: "white",
      borderColor: "#cbd5e1",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
  }),
);

const AddButton = styled.button(
  css({
    bg: "#0055FF",
    color: "white",
    px: "24px",
    height: "48px",
    borderRadius: "9999px",
    fontSize: "14px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 2,
    transition: "all 0.2s",
    boxShadow: "0 8px 20px rgba(0,85,255,0.18)",
    border: "none",
    cursor: "pointer",
    "&:hover": { bg: "#1d4ed8" },
    "&:active": { transform: "scale(0.95)" },
  }),
);

// ─── Navigation Config ──────────────────────────────────────────────

const NAV_ITEMS = [
  { path: "/songs", label: "Songs", icon: Music },
  { path: "/stats", label: "Stats", icon: BarChart2 },
  { path: "/albums", label: "Albums", icon: Disc },
  { path: "/artists", label: "Artists", icon: Users },
] as const;

// ─── Props ──────────────────────────────────────────────────────────

interface AppHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// ─── Component ──────────────────────────────────────────────────────

export default function AppHeader({
  searchQuery,
  setSearchQuery,
}: AppHeaderProps) {
  const location = useLocation();

  // Form modal state — owned by the header
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<SongFormData>(DEFAULT_FORM_STATE);
  const [formErrors, setFormErrors] = useState<SongFormErrors>({});

  const handleOpenForm = useCallback(() => {
    setFormData(DEFAULT_FORM_STATE);
    setFormErrors({});
    setIsFormModalOpen(true);
  }, []);

  const handleSaveSong = useCallback(() => {
    const result = songFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: SongFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SongFormErrors;
        if (field in DEFAULT_FORM_STATE) {
          fieldErrors[field] = issue.message;
        }
      }
      setFormErrors(fieldErrors);
      return;
    }

    const newSong: Song = {
      ...result.data,
      id: Date.now(),
      status: "LIVE",
      image:
        result.data.image ||
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=600&h=600&fit=crop&q=80`,
    };

    // Notify listening pages about the new song
    window.dispatchEvent(
      new CustomEvent<Song>("song-created", { detail: newSong }),
    );

    setIsFormModalOpen(false);
  }, [formData]);

  return (
    <>
      <Header>
        <HeaderContent>
          <LogoGroup>
            <Logo to="/songs">
              <Music size={24} fill="currentColor" />
              <span>MusicBox</span>
            </Logo>
            <Nav>
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <StyledNavItem
                    key={path}
                    to={path}
                    data-active={String(isActive)}
                  >
                    <Icon size={16} /> {label}
                  </StyledNavItem>
                );
              })}
            </Nav>
          </LogoGroup>
          <HeaderActions>
            <SearchWrapper>
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              >
                <Search size={16} />
              </div>
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search music library..."
              />
            </SearchWrapper>
            <AddButton onClick={handleOpenForm}>
              <Plus size={16} /> Add New Song
            </AddButton>
          </HeaderActions>
        </HeaderContent>
      </Header>

      {isFormModalOpen && (
        <SongFormModal
          editingSong={null}
          setIsFormModalOpen={setIsFormModalOpen}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          handleSaveSong={handleSaveSong}
          GENRES={GENRES}
        />
      )}
    </>
  );
}
