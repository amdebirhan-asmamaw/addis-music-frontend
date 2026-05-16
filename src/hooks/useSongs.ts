// hooks/useSongs.ts — UI-state hook for the song form + delete dialog
//
// Server state (the songs list and the CRUD network calls) lives in
// `songsSlice` + `songsSaga`. This hook is intentionally light: it owns
// modal visibility, the in-progress form data, validation errors, and
// the "song queued for deletion" pointer. Pages glue it to Redux by
// dispatching createSong/updateSong/deleteSong inside the handlers.

import { useCallback, useState } from "react";
import { DEFAULT_FORM_STATE, songFormSchema } from "../constants/forms";
import type {
  Song,
  SongFormData,
  SongFormErrors,
  SongStatus,
} from "../types/song";

export interface SaveSongIntent {
  text: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration?: string;
    status?: SongStatus;
    releaseYear?: number;
    description?: string;
  };
  imageFile?: File | null;
  audioFile?: File | null;
}

interface UseSongsOptions {
  /** Required asset rules — defaults: image+audio required on create. */
  onSave: (intent: SaveSongIntent, editingSong: Song | null) => void;
  onDelete: (song: Song) => void;
}

interface UseSongsReturn {
  isFormModalOpen: boolean;
  editingSong: Song | null;
  formData: SongFormData;
  formErrors: SongFormErrors;
  isDeleteModalOpen: boolean;
  songToDelete: Song | null;
  handleOpenForm: (song?: Song | null) => void;
  handleSaveSong: () => void;
  setFormData: React.Dispatch<React.SetStateAction<SongFormData>>;
  setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDelete: (song: Song) => void;
  handleDelete: () => void;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSongToDelete: React.Dispatch<React.SetStateAction<Song | null>>;
}

export function useSongs({ onSave, onDelete }: UseSongsOptions): UseSongsReturn {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formData, setFormData] = useState<SongFormData>(DEFAULT_FORM_STATE);
  const [formErrors, setFormErrors] = useState<SongFormErrors>({});

  const handleOpenForm = useCallback((song: Song | null = null) => {
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
        status: song.status,
        imageFile: null,
        audioFile: null,
        imagePreview: song.image?.url ?? "",
        audioPreview: song.audioUrl?.url ?? "",
      });
    } else {
      setEditingSong(null);
      setFormData(DEFAULT_FORM_STATE);
    }
    setFormErrors({});
    setIsFormModalOpen(true);
  }, []);

  const handleSaveSong = useCallback(() => {
    const result = songFormSchema.safeParse({
      title: formData.title,
      artist: formData.artist,
      album: formData.album,
      genre: formData.genre,
      duration: formData.duration,
      status: formData.status,
      releaseYear: formData.releaseYear,
      description: formData.description,
    });

    const fieldErrors: SongFormErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SongFormErrors;
        fieldErrors[field] = issue.message;
      }
    }

    // Files required only when creating; edits can keep existing assets.
    if (!editingSong) {
      if (!formData.imageFile) {
        fieldErrors.imageFile = "Cover artwork is required";
      }
      if (!formData.audioFile) {
        fieldErrors.audioFile = "Audio file is required";
      }
    }

    if (Object.keys(fieldErrors).length > 0 || !result.success) {
      setFormErrors(fieldErrors);
      return;
    }

    onSave(
      {
        text: result.data,
        imageFile: formData.imageFile,
        audioFile: formData.audioFile,
      },
      editingSong,
    );
  }, [formData, editingSong, onSave]);

  const confirmDelete = useCallback((song: Song) => {
    setSongToDelete(song);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!songToDelete) return;
    onDelete(songToDelete);
  }, [songToDelete, onDelete]);

  return {
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
  };
}
