// pages/SongsPage.tsx — Song management page

import { useCallback, useEffect, useRef } from "react";
import { useOutletContext } from "react-router";
import { Search, Plus, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import styled from "@emotion/styled";
import css from "@styled-system/css";

import SongCard from "../components/SongCard";
import SongFormModal from "../components/SongFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { AddCard } from "../components/ui/Shared";

import { useSongs, type SaveSongIntent } from "../hooks/useSongs";
import { useSongFilters } from "../hooks/useSongFilters";

import { GENRES } from "../constants/genres";
import { getStatusColor, getStatusDotColor } from "../constants/status";
import { colors, fontSizes, fontWeights } from "../constants/theme";
import type { Song } from "../types/song";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearPlayback,
  playSongById,
  selectNowPlaying,
  setQueue,
} from "../store/playerSlice";
import {
  clearActionError,
  createSong,
  deleteSong,
  fetchSongs,
  selectSongs,
  selectSongsActionError,
  selectSongsCreating,
  selectSongsDeleting,
  selectSongsLoadError,
  selectSongsStatus,
  selectSongsUpdating,
  updateSong,
} from "../store/songsSlice";
import type { AppOutletContext } from "../App";

// ─── Styled Components ──────────────────────────────────────────────

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
    fontSize: fontSizes.base,
    margin: 0,
    mt: "6px",
  }),
);

const TitleBlock = styled.div(
  css({ flex: 1, minWidth: "300px", pr: "16px" }),
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
  css({ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }),
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

const LoadingState = styled.div(
  css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    gap: "12px",
    color: colors.slate500,
  }),
);

const ErrorBanner = styled.div(
  css({
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: fontSizes.base,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
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

export default function SongsPage() {
  const { searchQuery } = useOutletContext<AppOutletContext>();
  const dispatch = useAppDispatch();

  // ─── Server state ───────────────────────────────────────────────
  const songs = useAppSelector(selectSongs);
  const status = useAppSelector(selectSongsStatus);
  const loadError = useAppSelector(selectSongsLoadError);
  const creating = useAppSelector(selectSongsCreating);
  const updating = useAppSelector(selectSongsUpdating);
  const deleting = useAppSelector(selectSongsDeleting);
  const actionError = useAppSelector(selectSongsActionError);

  // ─── Player ─────────────────────────────────────────────────────
  const nowPlaying = useAppSelector(selectNowPlaying);
  const isPlaying = useAppSelector((s) => s.player.isPlaying);

  // ─── Fetch on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (status === "idle") dispatch(fetchSongs());
  }, [dispatch, status]);

  // ─── Form / delete UI state ─────────────────────────────────────
  // We pre-bind the save/delete handlers to dispatch; the hook owns
  // modal + form local state only.
  const editingIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  const handleSave = useCallback(
    (intent: SaveSongIntent, editingSong: Song | null) => {
      submittingRef.current = true;
      editingIdRef.current = editingSong?.id ?? null;
      if (editingSong) {
        dispatch(
          updateSong({
            id: editingSong.id,
            text: intent.text,
            imageFile: intent.imageFile,
            audioFile: intent.audioFile,
          }),
        );
      } else {
        dispatch(
          createSong({
            text: {
              title: intent.text.title,
              artist: intent.text.artist,
              album: intent.text.album,
              genre: intent.text.genre,
              duration: intent.text.duration,
              status: intent.text.status,
              releaseYear: intent.text.releaseYear,
              description: intent.text.description,
            },
            imageFile: intent.imageFile,
            audioFile: intent.audioFile,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleConfirmDelete = useCallback(
    (song: Song) => {
      submittingRef.current = true;
      dispatch(deleteSong(song.id));
    },
    [dispatch],
  );

  const crud = useSongs({
    onSave: handleSave,
    onDelete: handleConfirmDelete,
  });

  // Close modals when a mutation completes successfully.
  const wasCreating = useRef(false);
  const wasUpdating = useRef(false);
  const wasDeleting = useRef(false);
  useEffect(() => {
    if (wasCreating.current && !creating && !actionError) {
      crud.setIsFormModalOpen(false);
    }
    wasCreating.current = creating;
  }, [creating, actionError, crud]);
  useEffect(() => {
    if (wasUpdating.current && !updating && !actionError) {
      crud.setIsFormModalOpen(false);
    }
    wasUpdating.current = updating;
  }, [updating, actionError, crud]);
  useEffect(() => {
    if (wasDeleting.current && !deleting && !actionError) {
      crud.setIsDeleteModalOpen(false);
      crud.setSongToDelete(null);
    }
    wasDeleting.current = deleting;
  }, [deleting, actionError, crud]);

  // ─── Filtering ─────────────────────────────────────────────────
  const filters = useSongFilters(songs, searchQuery);

  // Keep the player queue in sync with the visible filtered list.
  useEffect(() => {
    dispatch(setQueue(filters.filteredSongs));
  }, [dispatch, filters.filteredSongs]);

  // If the now-playing song got removed, clear playback.
  useEffect(() => {
    if (nowPlaying && !songs.some((s) => s.id === nowPlaying.id)) {
      dispatch(clearPlayback());
    }
  }, [dispatch, songs, nowPlaying]);

  const handlePlay = useCallback(
    (song: Song) => {
      if (!song.audioUrl?.url) return;
      dispatch(playSongById(song.id));
    },
    [dispatch],
  );

  // Clear stale action errors when the user closes the form modal manually.
  useEffect(() => {
    if (!crud.isFormModalOpen && actionError) {
      dispatch(clearActionError());
    }
  }, [crud.isFormModalOpen, actionError, dispatch]);

  const submitting = creating || updating;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <>
      <PageHeader>
        <TitleBlock>
          <PageTitle>Song Management</PageTitle>
          <PageSubtitle>
            Manage your digital assets, metadata, and distribution settings.
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

      {loadError && (
        <ErrorBanner>
          <span>{loadError}</span>
          <ClearFiltersButton onClick={() => dispatch(fetchSongs())}>
            Retry
          </ClearFiltersButton>
        </ErrorBanner>
      )}

      {status === "loading" && songs.length === 0 && (
        <LoadingState>
          <Loader2 size={28} className="spin" />
          <span>Loading songs…</span>
        </LoadingState>
      )}

      {status !== "loading" &&
        songs.length > 0 &&
        filters.filteredSongs.length === 0 && (
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
            isPlaying={isPlaying}
            nowPlaying={nowPlaying}
            playSong={handlePlay}
            handleOpenForm={crud.handleOpenForm}
            confirmDelete={crud.confirmDelete}
            getStatusColor={getStatusColor}
            getStatusDotColor={getStatusDotColor}
          />
        ))}
        {status !== "loading" && !filters.isFiltered && (
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

      {crud.isFormModalOpen && (
        <SongFormModal
          editingSong={crud.editingSong}
          setIsFormModalOpen={crud.setIsFormModalOpen}
          formData={crud.formData}
          setFormData={crud.setFormData}
          formErrors={crud.formErrors}
          handleSaveSong={crud.handleSaveSong}
          GENRES={GENRES}
          submitting={submitting}
          submitError={actionError}
        />
      )}

      {crud.isDeleteModalOpen && crud.songToDelete && (
        <DeleteConfirmModal
          songToDelete={crud.songToDelete}
          setIsDeleteModalOpen={crud.setIsDeleteModalOpen}
          setSongToDelete={crud.setSongToDelete}
          handleDelete={crud.handleDelete}
          deleting={deleting}
          deleteError={actionError}
        />
      )}
    </>
  );
}
