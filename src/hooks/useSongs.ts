// hooks/useSongs.ts — CRUD operations + form state for songs

import { useState, useCallback } from "react";
import { songFormSchema } from "../constants/forms";
import { DEFAULT_FORM_STATE } from "../constants/forms";
import type { Song, SongFormData, SongFormErrors } from "../types/song";

interface SongsCrudState {
  songs: Song[];
  // Form
  isFormModalOpen: boolean;
  editingSong: Song | null;
  formData: SongFormData;
  formErrors: SongFormErrors;
  // Delete
  isDeleteModalOpen: boolean;
  songToDelete: Song | null;
  // Actions
  handleOpenForm: (song?: Song | null) => void;
  handleSaveSong: () => void;
  setFormData: React.Dispatch<React.SetStateAction<SongFormData>>;
  setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Delete actions
  confirmDelete: (song: Song) => void;
  handleDelete: () => void;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSongToDelete: React.Dispatch<React.SetStateAction<Song | null>>;
  addSong: (song: Song) => void;
}

export function useSongs(
  initialSongs: Song[],
  onSongDeleted?: (deletedId: number) => void,
): SongsCrudState {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formData, setFormData] = useState<SongFormData>(DEFAULT_FORM_STATE);
  const [formErrors, setFormErrors] = useState<SongFormErrors>({});

  const handleOpenForm = useCallback(
    (song: Song | null = null) => {
      if (song) {
        setEditingSong(song);
        setFormData({
          title: song.title,
          artist: song.artist,
          album: song.album,
          genre: song.genre,
          duration: song.duration,
          releaseYear: song.releaseYear,
          description: song.description,
          image: song.image,
          audioUrl: song.audioUrl ?? "",
        });
      } else {
        setEditingSong(null);
        setFormData(DEFAULT_FORM_STATE);
      }
      setFormErrors({});
      setIsFormModalOpen(true);
    },
    [],
  );

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

    if (editingSong) {
      setSongs((prev) =>
        prev.map((s) =>
          s.id === editingSong.id ? { ...s, ...result.data } : s,
        ),
      );
    } else {
      const newSong: Song = {
        ...result.data,
        id: Date.now(),
        status: "LIVE",
        image:
          result.data.image ||
          `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=600&h=600&fit=crop&q=80`,
      };
      setSongs((prev) => [newSong, ...prev]);
    }
    setIsFormModalOpen(false);
  }, [formData, editingSong]);

  const confirmDelete = useCallback((song: Song) => {
    setSongToDelete(song);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!songToDelete) return;
    const deletedId = songToDelete.id;
    setSongs((prev) => prev.filter((s) => s.id !== deletedId));
    onSongDeleted?.(deletedId);
    setIsDeleteModalOpen(false);
    setSongToDelete(null);
  }, [songToDelete, onSongDeleted]);

  const addSong = useCallback((song: Song) => {
    setSongs((prev) => [song, ...prev]);
  }, []);

  return {
    songs,
    isFormModalOpen,
    editingSong,
    formData,
    formErrors,
    isDeleteModalOpen,
    songToDelete,
    handleOpenForm,
    handleSaveSong,
    setFormData,
    setIsFormModalOpen,
    confirmDelete,
    handleDelete,
    setIsDeleteModalOpen,
    setSongToDelete,
    addSong,
  };
}
