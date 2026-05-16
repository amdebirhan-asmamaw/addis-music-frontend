// App.tsx — Main application shell

import { useState, useCallback } from "react";
import { Global, css as globalCss } from "@emotion/react";
import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";

// Components
import SongCard from "./components/SongCard";
import StatsView from "./components/StatsView";
import SongFormModal from "./components/SongFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { AddCard } from "./components/ui/Shared";
import AppHeader from "./components/Header";
import AppPlayer from "./components/Player";

// Hooks
import { useSongs } from "./hooks/useSongs";
import { useSongStats } from "./hooks/useSongStats";
import { useSongFilters } from "./hooks/useSongFilters";
import { useSongPlayer } from "./hooks/useSongPlayer";

// Constants
import { INITIAL_SONGS } from "./constants/songs";
import { GENRES } from "./constants/genres";
import { getStatusColor, getStatusDotColor } from "./constants/status";
import { colors, fontSizes, fontWeights } from "./constants/theme";

// Types
import type { Song } from "./types/song";

// ─── Styled Components ──────────────────────────────────────────────

const AppContainer = styled.div(
  css({
    minHeight: "100vh",
    bg: colors.pageBg,
    display: "flex",
    flexDirection: "column",
    color: colors.slate900,
    pb: "120px", // Accommodate fixed player height
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

const PageHeader = styled.div(
  css({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
    width: "100%",
  }),
);

const PageTitle = styled.h1(
  css({
    fontSize: fontSizes["2xl"],
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

const FilterWrapper = styled.div(
  css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    bg: colors.cardBg,
    border: "1px solid",
    borderColor: colors.slate200,
    borderRadius: "8px",
    height: "36px",
    padding: "0 12px",
    transition: "border-color 0.2s",
    "&:hover": { borderColor: colors.slate300 },
  }),
);

const FilterIcon = styled.div(
  css({
    paddingLeft: "12px",
    color: colors.slate400,
    display: "flex",
    alignItems: "center",
  }),
);

const Select = styled.select(
  css({
    pl: 2,
    pr: 4,
    py: "8px",
    bg: "transparent",
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.slate700,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    border: "none",
  }),
);

const FilterControls = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
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
    alignItems: "stretch",
  }),
);

const EmptyState = styled.div(
  css({
    textAlign: "center",
    padding: "80px 0",
    backgroundColor: colors.cardBg,
    borderRadius: "16px",
    border: "1px dashed",
    borderColor: colors.slate200,
  }),
);

const EmptyStateIcon = styled.div(
  css({
    width: "64px",
    height: "64px",
    backgroundColor: colors.slate50,
    color: colors.slate300,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  }),
);

const EmptyStateTitle = styled.h3(
  css({
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.slate900,
    margin: 0,
    mb: "4px",
  }),
);

const EmptyStateText = styled.p(
  css({
    color: colors.slate500,
    fontSize: fontSizes.base,
    margin: 0,
    mb: "16px",
  }),
);

const ClearFiltersButton = styled.button(
  css({
    color: colors.primary,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.base,
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
  }),
);

const TitleBlock = styled.div(
  css({
    flex: 1,
    minWidth: "300px",
    pr: "16px",
  }),
);

const AddTrackIcon = styled.div(
  css({
    width: "56px",
    height: "56px",
    backgroundColor: colors.primaryLight,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: "16px",
    color: colors.primary,
    transition: "all 0.2s",
  }),
);

const AddTrackTitle = styled.h3(
  css({
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.slate900,
    margin: 0,
    mb: "4px",
  }),
);

const AddTrackText = styled.p(
  css({
    fontSize: fontSizes.base,
    color: colors.slate500,
    textAlign: "center",
    px: "24px",
    margin: 0,
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

// ─── App Component ──────────────────────────────────────────────────

export default function App() {
  // State hooks
  const [activeTab, setActiveTab] = useState("songs");

  const player = useSongPlayer(INITIAL_SONGS[0]);
  const crud = useSongs(INITIAL_SONGS, player.stopIfDeleted);
  const filters = useSongFilters(crud.songs);
  const stats = useSongStats(crud.songs);

  const handleOpenFormFromHeader = useCallback(() => {
    crud.handleOpenForm();
  }, [crud.handleOpenForm]);

  return (
    <AppContainer>
      <Global styles={globalStyles} />

      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={filters.searchQuery}
        setSearchQuery={filters.setSearchQuery}
        handleOpenForm={handleOpenFormFromHeader}
      />

      <Main>
        {activeTab === "songs" && (
          <div>
            <PageHeader>
              <TitleBlock>
                <PageTitle>Song Management</PageTitle>
                <PageSubtitle>
                  Manage your digital assets, metadata, and distribution
                  settings.
                </PageSubtitle>
              </TitleBlock>

              <FilterControls>
                <FilterWrapper>
                  <FilterIcon>
                    <Filter size={16} />
                  </FilterIcon>
                  <Select
                    value={filters.selectedGenre}
                    onChange={(e) => filters.setSelectedGenre(e.target.value)}
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g === "All" ? "All Genres" : g}
                      </option>
                    ))}
                  </Select>
                </FilterWrapper>

                <FilterWrapper>
                  <FilterIcon>
                    <ArrowUpDown size={16} />
                  </FilterIcon>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) =>
                      filters.setSortBy(
                        e.target.value as "newest" | "alphabetical" | "artist",
                      )
                    }
                  >
                    <option value="newest">Recently Added</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="artist">Artist Name</option>
                  </Select>
                </FilterWrapper>
              </FilterControls>
            </PageHeader>

            {filters.filteredSongs.length === 0 && (
              <EmptyState>
                <EmptyStateIcon>
                  <Search size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>No songs found</EmptyStateTitle>
                <EmptyStateText>
                  Try adjusting your filters or search query.
                </EmptyStateText>
                <ClearFiltersButton onClick={filters.clearFilters}>
                  Clear all filters
                </ClearFiltersButton>
              </EmptyState>
            )}

            <Grid>
              {filters.filteredSongs.map((song: Song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={player.isPlaying}
                  nowPlaying={player.nowPlaying}
                  playSong={player.playSong}
                  handleOpenForm={crud.handleOpenForm}
                  confirmDelete={crud.confirmDelete}
                  getStatusColor={getStatusColor}
                  getStatusDotColor={getStatusDotColor}
                />
              ))}
              {!filters.isFiltered && (
                <AddCard onClick={() => crud.handleOpenForm()}>
                  <AddTrackIcon className="add-icon">
                    <Plus size={24} />
                  </AddTrackIcon>
                  <AddTrackTitle>Add New Track</AddTrackTitle>
                  <AddTrackText>
                    Upload your mastered files and populate metadata.
                  </AddTrackText>
                </AddCard>
              )}
            </Grid>
          </div>
        )}

        {activeTab === "stats" && <StatsView stats={stats} />}
      </Main>

      {player.nowPlaying && (
        <AppPlayer
          nowPlaying={player.nowPlaying}
          isPlaying={player.isPlaying}
          setIsPlaying={player.setIsPlaying}
        />
      )}

      {crud.isFormModalOpen && (
        <SongFormModal
          editingSong={crud.editingSong}
          setIsFormModalOpen={crud.setIsFormModalOpen}
          formData={crud.formData}
          setFormData={crud.setFormData}
          formErrors={crud.formErrors}
          handleSaveSong={crud.handleSaveSong}
          GENRES={GENRES}
        />
      )}

      {crud.isDeleteModalOpen && crud.songToDelete && (
        <DeleteConfirmModal
          songToDelete={crud.songToDelete}
          setIsDeleteModalOpen={crud.setIsDeleteModalOpen}
          setSongToDelete={crud.setSongToDelete}
          handleDelete={crud.handleDelete}
        />
      )}
    </AppContainer>
  );
}

